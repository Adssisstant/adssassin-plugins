# Submission status — the 6 open items

Snapshot of where each pre-submission item stands after the prep pass.

| # | Item | Status | Owner / next action |
|---|------|--------|---------------------|
| 1 | **Square app icon** | ✅ **Done** | `assets/adssassin-icon-{1024,512,256}.png` in this folder — upload the size the form wants. |
| 2 | **OpenAI account eligible to submit** | ❌ **You** | Can't be done here. In your OpenAI account, confirm you're on a workspace/plan allowed to submit an app, and locate the submission portal. **[VERIFY]** |
| 3 | **Domain verification (`adssassin.ai`)** | 🟡 **Scaffolded** | Serving route added to `adssassin-site` at `/.well-known/openai-domain-verification.txt`. When OpenAI gives you the token, set `OPENAI_DOMAIN_VERIFICATION` on the site's Vercel project, redeploy, then click Verify. Confirm the required path/filename; rename the route if different. |
| 4 | **Tool-surface curation** | 🟡 **Decided (doc)** | See `tool-profile.md`. Recommendation: ship the **full set** unless testing or a directory cap forces curation — then narrow *per-client* (never trim the global MCP). No code change made. |
| 5 | **In-chat Google connect** | ✅ **Already works** | The MCP throws a connect-link error when Google isn't connected (`tenantContext.ts` `effectiveCredentials`), so ChatGPT guides the user to their `/connect` link automatically. Just show it succeeding in the demo video. |
| 6 | **OAuth (PKCE/DCR) with ChatGPT** | ✅ **Verified in code** | Discovery endpoints present: `/.well-known/oauth-protected-resource[/mcp]` and `/.well-known/oauth-authorization-server` (Clerk, dynamic client registration). Remaining: do **one real connect test from ChatGPT** before recording the video. |

## What's left for you (the human-only bits)
1. **Confirm submission eligibility** and find the current submission portal (#2).
2. **Get the domain token** from the form → set `OPENAI_DOMAIN_VERIFICATION` on the site → Verify (#3).
3. **Do one live connect test from ChatGPT** (Adssassin OAuth → Google connect → run a tool) to confirm #5/#6 end to end.
4. **Record the demo video** from `demo-video-script.md`.
5. **Fill the listing** from `listing.md`, **upload the icon**, prepare the **test cases** from `test-cases.md`, and **submit**.

The technical foundations (live MCP, OAuth + DCR, approval-gated writes, in-chat
connect) are in production. The remaining work is account/form steps and the
video — no further backend code is required for a first submission.

## Optional fast-follow (not required)
- **Approval-card widget** — an inline Apps SDK component showing the exact
  before → after of a pending change with an Approve button. Strong brand fit
  ("you approve every change"); a real build (serve an HTML/Skybridge component
  + wire the approve action). Scope it separately if you want it.
