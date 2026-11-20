// The agent: one Slack turn → Claude with the user's Adssassin MCP attached.
//
// No hand-written tool loop. Anthropic's MCP connector connects to
// mcp.adssassin.ai server-side using the Slack user's own OAuth token, lists the
// tools, and runs them; we only loop on `pause_turn` (the server pausing a long
// turn) and return the text.

import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config.js";

const anthropic = new Anthropic();
const MCP_NAME = "adssassin";
const MAX_CONTINUATIONS = 6;

const SYSTEM = `You are Adssassin, a Google Ads expert working inside Slack. You run the user's own Google Ads account through the Adssassin tools.

- For every Google Ads request, call the Adssassin plan_task tool first and follow the plan it returns.
- Start with list_accounts when you need a customer_id. If several accounts come back, ask which one.
- Mutating tools preview by default. Show the preview, then apply (confirm=true) only after the user explicitly approves in this thread.
- Lead with the answer. Use short paragraphs, bullet lists, and small tables; Slack readers skim. Show money with currency symbols and round sensibly.
- If a tool says the Google Ads account isn't connected, or the plan doesn't allow an action, say so plainly and pass along any link the tool returns.`;

export class NeedsReconnectError extends Error {}

/**
 * @param {Anthropic.Beta.BetaMessageParam[]} history  prior turns, oldest first, ending with the new user message
 * @param {string} accessToken  the Slack user's Adssassin OAuth access token
 * @returns {Promise<string>} markdown reply
 */
export async function runAgent(history, accessToken) {
  const messages = [...history];
  const texts = [];

  for (let i = 0; i <= MAX_CONTINUATIONS; i++) {
    let msg;
    try {
      msg = await anthropic.beta.messages
        .stream({
          model: config.anthropic.model,
          max_tokens: 64000,
          betas: ["mcp-client-2025-11-20", "server-side-fallback-2026-07-01"],
          // On a safety decline, the API re-runs the turn on a fallback model.
          fallbacks: "default",
          output_config: { effort: config.anthropic.effort },
          system: SYSTEM,
          mcp_servers: [
            { type: "url", url: config.adssassin.mcpUrl, name: MCP_NAME, authorization_token: accessToken },
          ],
          tools: [{ type: "mcp_toolset", mcp_server_name: MCP_NAME }],
          messages,
        })
        .finalMessage();
    } catch (err) {
      if (err instanceof Anthropic.APIError && /unauthori[sz]ed|401|invalid[_ ]token|authorization/i.test(err.message)) {
        throw new NeedsReconnectError(err.message);
      }
      throw err;
    }

    for (const block of msg.content) {
      if (block.type === "text" && block.text.trim()) texts.push(block.text);
    }

    if (msg.stop_reason === "pause_turn") {
      // Server paused a long tool-using turn: send the content back to continue.
      messages.push({ role: "assistant", content: msg.content });
      continue;
    }
    if (msg.stop_reason === "refusal") {
      texts.push("_I can't help with that request._");
    } else if (msg.stop_reason === "max_tokens") {
      texts.push("_(Reply cut off — ask me to continue.)_");
    }
    break;
  }

  return texts.join("\n\n").trim() || "I didn't get a response that time — please try again.";
}

/**
 * Build Claude messages from a Slack thread. Bot messages → assistant, everyone
 * else → user. Consecutive same-role turns are fine (the API merges them).
 */
export function historyFromThread(slackMessages, botUserId, botId) {
  const out = [];
  for (const m of slackMessages) {
    const text = (m.text || "").trim();
    if (!text || m.subtype === "assistant_app_thread") continue;
    const fromBot = m.bot_id === botId || m.user === botUserId || Boolean(m.bot_id);
    out.push({ role: fromBot ? "assistant" : "user", content: text });
  }
  const recent = out.slice(-30);
  while (recent.length && recent[0].role !== "user") recent.shift();
  return recent;
}
