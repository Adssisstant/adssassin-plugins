// Adssassin for Slack — Bolt app entry point.
//
//   Slack (assistant pane / DM / @mention)
//     → this app (Bolt, HTTP mode)
//       → Claude (Messages API + MCP connector)
//         → mcp.adssassin.ai/mcp with the Slack user's own Adssassin OAuth token
//
// HTTP routes:
//   POST /slack/events               Slack events (Bolt)
//   GET  /slack/install              "Add to Slack" (multi-workspace mode)
//   GET  /slack/oauth_redirect       Slack install callback (multi-workspace mode)
//   GET  /connect?s=…                per-user "connect your Adssassin account" page
//   GET  /connect/go?s=…             → Adssassin sign-in
//   GET  /oauth/adssassin/callback   Adssassin OAuth callback
//   GET  /healthz

import bolt from "@slack/bolt";
import { config, multiWorkspace } from "./config.js";
import { store } from "./store.js";
import {
  userKey,
  createConnectLink,
  describePending,
  authorizeUrlFor,
  completeConnect,
  getAccessToken,
  disconnect,
} from "./adssassinAuth.js";
import { runAgent, historyFromThread, NeedsReconnectError } from "./agent.js";

const { App, Assistant, ExpressReceiver, LogLevel } = bolt;

// ── Slack installation store (multi-workspace mode) ─────────────────────────
const installationId = (q) => (q.isEnterpriseInstall && q.enterpriseId ? `E:${q.enterpriseId}` : `T:${q.teamId}`);
const installationStore = {
  async storeInstallation(installation) {
    const id =
      installation.isEnterpriseInstall && installation.enterprise
        ? `E:${installation.enterprise.id}`
        : `T:${installation.team.id}`;
    await store.set("installations", id, { json: JSON.stringify(installation) });
  },
  async fetchInstallation(query) {
    const rec = await store.get("installations", installationId(query));
    if (!rec) throw new Error("No installation for this workspace");
    return JSON.parse(rec.json);
  },
  async deleteInstallation(query) {
    await store.del("installations", installationId(query));
  },
};

const receiver = new ExpressReceiver({
  signingSecret: config.slack.signingSecret,
  ...(multiWorkspace
    ? {
        clientId: config.slack.clientId,
        clientSecret: config.slack.clientSecret,
        stateSecret: config.slack.stateSecret,
        scopes: ["assistant:write", "chat:write", "im:history", "app_mentions:read", "channels:history"],
        installationStore,
        installerOptions: { directInstall: true },
      }
    : {}),
});

const app = new App({
  receiver,
  logLevel: process.env.SLACK_LOG_LEVEL === "debug" ? LogLevel.DEBUG : LogLevel.INFO,
  ...(multiWorkspace ? {} : { token: config.slack.botToken }),
});

// ── Helpers ─────────────────────────────────────────────────────────────────
const MARKDOWN_BLOCK_LIMIT = 11_500;

function chunks(text) {
  const parts = [];
  let rest = text;
  while (rest.length > MARKDOWN_BLOCK_LIMIT) {
    let cut = rest.lastIndexOf("\n\n", MARKDOWN_BLOCK_LIMIT);
    if (cut < MARKDOWN_BLOCK_LIMIT / 2) cut = MARKDOWN_BLOCK_LIMIT;
    parts.push(rest.slice(0, cut));
    rest = rest.slice(cut).trimStart();
  }
  parts.push(rest);
  return parts;
}

async function postMarkdown(say, text, threadTs) {
  for (const part of chunks(text)) {
    await say({
      text: part.slice(0, 3000), // notification / fallback text
      blocks: [{ type: "markdown", text: part }],
      ...(threadTs ? { thread_ts: threadTs } : {}),
    });
  }
}

function connectBlocks(url, reason) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${reason}\nConnect your Adssassin account to let me work on your Google Ads. It's free to start, and the link is for you only and expires in 15 minutes.`,
      },
    },
    {
      type: "actions",
      elements: [
        { type: "button", text: { type: "plain_text", text: "Connect Adssassin" }, url, style: "primary", action_id: "connect_adssassin" },
      ],
    },
  ];
}

async function overDailyLimit(key) {
  const day = new Date().toISOString().slice(0, 10);
  const n = await store.incr("usage", `${key}:${day}`, "count");
  return n > config.maxMessagesPerUserPerDay;
}

const CONTROL = /^\s*(disconnect|logout|log out|sign out)\s*$/i;

/**
 * Shared handler for assistant-thread messages and @mentions.
 * Returns nothing; replies via `say`.
 */
async function handleTurn({ client, context, teamId, userId, channel, threadTs, text, say, setStatus }) {
  const key = userKey(teamId, userId);

  if (CONTROL.test(text)) {
    await disconnect(key);
    await say({ text: "Disconnected your Adssassin account from Slack. Say anything to connect again.", ...(threadTs ? { thread_ts: threadTs } : {}) });
    return;
  }

  const token = await getAccessToken(key);
  if (!token) {
    const url = await createConnectLink({ teamId, userId, channelId: channel });
    // Ephemeral so the one-time link is visible only to this user.
    await client.chat.postEphemeral({
      channel,
      user: userId,
      ...(threadTs ? { thread_ts: threadTs } : {}),
      text: `Connect your Adssassin account: ${url}`,
      blocks: connectBlocks(url, "First, one quick step."),
    });
    return;
  }

  if (await overDailyLimit(key)) {
    await say({ text: "You've hit today's message limit for Adssassin in Slack. It resets at midnight UTC.", ...(threadTs ? { thread_ts: threadTs } : {}) });
    return;
  }

  await setStatus?.("is working on your Google Ads…");

  // Rebuild the conversation from the Slack thread so context survives restarts.
  let history = [{ role: "user", content: text }];
  if (threadTs) {
    try {
      const replies = await client.conversations.replies({ channel, ts: threadTs, limit: 50 });
      const built = historyFromThread(replies.messages ?? [], context.botUserId, context.botId);
      if (built.length) history = built;
    } catch (err) {
      console.warn(`[slack] could not read thread history: ${err.message}`);
    }
  }

  try {
    const reply = await runAgent(history, token);
    await postMarkdown(say, reply, threadTs);
  } catch (err) {
    if (err instanceof NeedsReconnectError) {
      await disconnect(key);
      const url = await createConnectLink({ teamId, userId, channelId: channel });
      await client.chat.postEphemeral({
        channel,
        user: userId,
        ...(threadTs ? { thread_ts: threadTs } : {}),
        text: `Please reconnect Adssassin: ${url}`,
        blocks: connectBlocks(url, "Your Adssassin sign-in expired."),
      });
      return;
    }
    console.error("[agent] error:", err);
    await say({ text: "Something went wrong talking to Adssassin. Please try again in a moment.", ...(threadTs ? { thread_ts: threadTs } : {}) });
  }
}

// ── Assistant pane (Agents & AI Apps) ───────────────────────────────────────
const assistant = new Assistant({
  threadStarted: async ({ say, setSuggestedPrompts }) => {
    await say("Hi! I'm Adssassin. I can audit your Google Ads, find wasted spend, build campaigns, and write ad copy. Every change previews first.");
    await setSuggestedPrompts({
      title: "Try one of these:",
      prompts: [
        { title: "Audit my account", message: "Audit my Google Ads account and show me where I'm wasting spend." },
        { title: "Find wasted spend", message: "Which search terms spent money last month without converting?" },
        { title: "Build a campaign", message: "Build a paused search campaign for my top product, and show me the preview before anything goes live." },
      ],
    });
  },
  userMessage: async ({ client, context, message, say, setStatus }) => {
    if (!("text" in message) || !message.text || !("user" in message)) return;
    await handleTurn({
      client,
      context,
      teamId: context.teamId ?? message.team,
      userId: message.user,
      channel: message.channel,
      threadTs: message.thread_ts,
      text: message.text,
      say,
      setStatus,
    });
  },
});
app.assistant(assistant);

// ── @mentions in channels ───────────────────────────────────────────────────
app.event("app_mention", async ({ event, client, context, say }) => {
  const text = (event.text || "").replace(/<@[^>]+>/g, "").trim();
  if (!text || !event.user) return;
  await handleTurn({
    client,
    context,
    teamId: context.teamId ?? event.team,
    userId: event.user,
    channel: event.channel,
    threadTs: event.thread_ts ?? event.ts,
    text,
    say,
  });
});

// Button clicks on the connect link are plain URL buttons; ack so Slack doesn't warn.
app.action("connect_adssassin", async ({ ack }) => ack());

app.event("app_uninstalled", async ({ context }) => {
  if (multiWorkspace) {
    await installationStore.deleteInstallation({ teamId: context.teamId, enterpriseId: context.enterpriseId, isEnterpriseInstall: Boolean(context.isEnterpriseInstall) });
  }
});

// ── Connect pages ───────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function page(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>
body{font:16px/1.5 system-ui,sans-serif;background:#141210;color:#f4efe8;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px}
main{max-width:440px}a.btn{display:inline-block;background:#e4572e;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600}
p.muted{color:#b5aca1;font-size:14px}</style></head><body><main>${body}</main></body></html>`;
}

async function slackClientFor(teamId) {
  if (!multiWorkspace) return app.client;
  const inst = await installationStore.fetchInstallation({ teamId, isEnterpriseInstall: false });
  return new app.client.constructor(inst.bot?.token);
}

receiver.router.get("/healthz", (_req, res) => res.json({ ok: true }));

receiver.router.get("/connect", async (req, res) => {
  const state = String(req.query.s || "");
  const pending = await describePending(state);
  if (!pending) {
    return res.status(410).send(page("Link expired", "<h1>This link expired</h1><p>Send the Adssassin bot any message in Slack to get a new one.</p>"));
  }
  let who = "your Slack account";
  try {
    const client = await slackClientFor(pending.teamId);
    const [u, t] = await Promise.all([client.users.info({ user: pending.userId }), client.team.info()]);
    who = `${u.user?.real_name || u.user?.name || "you"} in the ${t.team?.name || "Slack"} workspace`;
  } catch {
    /* name lookup is cosmetic */
  }
  res.send(
    page(
      "Connect Adssassin",
      `<h1>Connect Adssassin to Slack</h1>
<p>You're linking your Adssassin account to <strong>${esc(who)}</strong>. The bot will act on your Google Ads only when that Slack user asks it to.</p>
<p><a class="btn" href="/connect/go?s=${encodeURIComponent(state)}">Continue to Adssassin</a></p>
<p class="muted">If you didn't ask for this link in Slack, close this page.</p>`
    )
  );
});

receiver.router.get("/connect/go", async (req, res) => {
  try {
    const url = await authorizeUrlFor(String(req.query.s || ""));
    if (!url) return res.status(410).send(page("Link expired", "<h1>This link expired</h1><p>Ask the bot for a new one.</p>"));
    res.redirect(url);
  } catch (err) {
    console.error("[connect/go]", err);
    res.status(500).send(page("Error", "<h1>Couldn't start sign-in</h1><p>Please try again in a minute.</p>"));
  }
});

receiver.router.get("/oauth/adssassin/callback", async (req, res) => {
  const { state, code, error } = req.query;
  if (error || !code) {
    return res.status(400).send(page("Not connected", `<h1>Not connected</h1><p>${esc(error || "No authorization code returned.")}</p>`));
  }
  try {
    const pending = await completeConnect({ state: String(state), code: String(code) });
    try {
      const client = await slackClientFor(pending.teamId);
      await client.chat.postMessage({
        channel: pending.userId, // DM the user
        text: "✅ Your Adssassin account is connected. Ask me anything about your Google Ads — e.g. “Audit my account”.",
      });
    } catch (err) {
      console.warn(`[callback] could not DM user: ${err.message}`);
    }
    res.send(page("Connected", "<h1>✅ Connected</h1><p>You can close this tab and go back to Slack.</p>"));
  } catch (err) {
    console.error("[callback]", err);
    res.status(400).send(page("Not connected", `<h1>Not connected</h1><p>${esc(err.message)}</p>`));
  }
});

await app.start(config.port);
console.log(`⚡ Adssassin for Slack listening on :${config.port} (${multiWorkspace ? "multi-workspace" : "single-workspace"} mode)`);
