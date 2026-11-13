# Adssassin on Slack — build, test & submit

Get Adssassin into Slack as an AI app that connects the **Adssassin remote MCP**
(`https://mcp.adssassin.ai/mcp`) so Slack's AI runs Google Ads work in
conversation, then list it in the Slack Marketplace.

**Key fact:** your MCP already supports OAuth **Dynamic Client Registration
(DCR)** over Streamable HTTP, which is exactly what Slack's **Slackbot MCP
Client** uses for third-party servers. So there are **no server changes** — this
is a Slack-app build, not backend work.

Docs to keep open (the two that matter):
- Slackbot MCP Client: https://docs.slack.dev/ai/slackbot-mcp-client/
- Distributing an MCP app: https://docs.slack.dev/ai/slackbot-mcp-client/distributing/
- Marketplace review guide: https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide

---

## Phase 1 — Create the app

1. Go to https://api.slack.com/apps → **Create New App** → **From a manifest**.
2. Pick the workspace you'll test in.
3. Paste `manifest.yaml` from this folder. If the create step **rejects** any
   field, it's almost certainly one of the two `# VERIFY` fields (the
   `assistant_view` block or a manifest-level `mcp` block) — remove it and set
   it in the dashboard instead (Phase 3), then re-create.
4. Create the app. Note the **App ID** and **Client ID / Client Secret**
   (Settings → Basic Information). Keep the secret private — never commit it.

## Phase 2 — Enable the AI assistant

1. In the app config, open **Agents & AI Apps** (or **App Home → Assistant**).
2. Enable the assistant/agent surface so users get the Adssassin DM/assistant.
3. Confirm the bot scope **`mcp:connect`** is present (OAuth & Permissions).

## Phase 3 — Register the Adssassin MCP server (the important step)

1. In the app config, find the **MCP** section (under Agents & AI Apps).
2. Add an MCP server:
   - **URL:** `https://mcp.adssassin.ai/mcp`
   - **Transport:** Streamable HTTP
   - **Auth:** **Dynamic Client Registration (DCR)** — you provide only the URL;
     the server registers the OAuth client automatically. No client ID/secret to
     enter for the MCP (that's the point of DCR).
3. Save.

## Phase 4 — Install to your workspace and TEST (de-risk gate)

> This is the decision point. Slack's own docs warn that after connecting a DCR
> server, Slackbot **may** return an `invalid_client` error when calling it. We
> need to find out whether that happens against `mcp.adssassin.ai` **before**
> investing in the Marketplace push.

1. Install the app to your test workspace (**Install App** in the config).
2. Open the Adssassin assistant in Slack. When it first calls the MCP, Slack
   should trigger the **OAuth consent** — sign in with an Adssassin account
   (Clerk). This is **per-user**: each Slack user authorizes their own Adssassin
   login, which is what connects their own Google Ads account. ✅ matches your
   per-tenant model.
3. Run the smoke tests:
   - `Audit my Google Ads account and show me where I'm wasting spend.`
   - `Which search terms spent money last month without converting?`
   - `Add the worst as negative keywords.` → must **preview**, not apply.
4. **Record the outcome:**
   - ✅ Tools list, auth completes, a read returns real data, a write previews →
     the connection works; proceed to Phase 5.
   - ❌ `invalid_client` (or auth never completes) → **stop and report it.** This
     is the known Slack DCR rough edge. Options then: file it with Slack
     developer support, or evaluate the "Use my own client" path (pre-registered
     OAuth client instead of DCR) as a workaround. Do not spend on installs until
     this is green.

## Phase 5 — Build the install (OAuth) flow for other workspaces

Only needed to distribute beyond your own workspace (required for Marketplace).

1. Stand up two endpoints on the **existing backend** (don't make a new service):
   - `GET /slack/install` → redirects to Slack's OAuth authorize URL with the
     app's client_id + bot scopes (incl. `mcp:connect`).
   - `GET /slack/oauth/callback` → exchanges `code` for the bot token via
     `oauth.v2.access`, stores it per workspace.
   - Put the callback URL in the manifest's `oauth_config.redirect_urls`.
   - Simplest home: add these routes to `chat-runtime` (it already serves
     `app.adssassin.ai` + handles OAuth-style flows) or the MCP server. Ask the
     agent to scaffold them when you reach this phase.
2. Add an **"Add to Slack"** button on a page (e.g. a `/slack` lander) pointing
   at `/slack/install`.

## Phase 6 — Reach the install threshold ⚠️

**You must have ≥10 installs on active workspaces before you can submit** to the
Marketplace (Slack raised it from 5 to 10 in Sept 2026). This is a distribution
task, not engineering — get real users/customers to add the app in their Slack.

## Phase 7 — Submit to the Slack Marketplace

Pre-submission checklist (MCP apps have extra requirements on top of the normal
ones — https://docs.slack.dev/ai/slackbot-mcp-client/distributing/):
- [ ] `mcp:connect` in bot scopes
- [ ] MCP server configured with a valid HTTPS URL + auth (Phase 3)
- [ ] OAuth install flow works for a fresh workspace (Phase 5)
- [ ] ≥10 active-workspace installs (Phase 6)
- [ ] Support URL: `https://adssassin.ai/support`
- [ ] Privacy policy: `https://adssassin.ai/privacy`
- [ ] Narrow scopes, each justified
- [ ] Agree to the security review
- [ ] Reviewer test account: `app@realgrowthpartner.com` (+ password) with a
      Google Ads account connected; **2FA disabled** for the reviewer
- [ ] Demo video (reuse the one from the other submissions)

Submit from **Settings → Submit to the Slack Marketplace**. Review is automated
feedback → manual review; resubmitting resets your queue position, so get it
right the first time. Supplying the test account + demo video speeds it up.

---

## Listing copy (reuse across the submission)

- **Name:** Adssassin — Google Ads
- **Tagline:** Audit & optimize Google Ads, in Slack.
- **Short:** Run Google Ads through Adssassin in Slack — audits, wasted-spend
  sweeps, campaign builds, and ad copy. Every change previews first.
- **Category:** Analytics / Marketing
- **Icon:** `https://raw.githubusercontent.com/Adssisstant/adssassin-plugins/main/assets/google-ads-mcp-icon.png`

## Open items to confirm against the live docs
- Exact manifest schema for the assistant + any `mcp` block (the `# VERIFY`
  fields). docs.slack.dev was unreachable from the build environment; confirm
  on a normal browser, or have the agent re-check once reachable.
- Whether the MCP server is registered via manifest or dashboard-only.
- Any AI-component-specific Marketplace guidelines.
