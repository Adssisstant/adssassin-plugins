# MCP / Apps SDK conformance audit

What a ChatGPT app needs on top of a standard MCP server, mapped to what the
Adssassin MCP already does. **[VERIFY]** every requirement against the current
Apps SDK docs — the fields and rules below are "last known" and this file could
not be checked against the live docs at build time (OpenAI doc hosts were not
reachable from the build environment).

Legend: ✅ done · **[GAP]** needs work · **[VERIFY]** confirm against docs · **[DECISION]** a choice to make.

---

## Transport & protocol
- **Remote MCP over Streamable HTTP** — ✅ `https://mcp.adssassin.ai/mcp`.
- Server responds to `initialize` with `serverInfo` (name, version) — **[VERIFY]** the directory likely pulls the app's display name/description/icon from server metadata and/or the form; make sure `serverInfo.name` is "Adssassin" and a version is set, and **[GAP]** confirm an **icon** is exposed where the Apps SDK expects it (server metadata vs. form upload).

## Authentication
- **OAuth 2.x** with **dynamic client registration** + `.well-known` discovery — ✅ (Clerk; `/.well-known/oauth-protected-resource/mcp`).
- **[VERIFY]** PKCE and the exact discovery documents the Apps SDK expects (`oauth-protected-resource`, `oauth-authorization-server`). Clerk supports these, but confirm ChatGPT can complete the flow as a dynamically-registered client.
- **Second-hop auth (Google):** after authorizing Adssassin, the user still connects their Google Ads account via the `/connect` link. **[DECISION]** make sure this is discoverable from inside ChatGPT (a tool or a clear prompt that hands them the connect link) so a ChatGPT-only user can finish onboarding. The demo video must show this succeed.

## Tools
- Rich tool set already exposed (audit, research, keywords, campaign builds, negatives, ad copy, reporting, isolation [paid]).
- **[DECISION] Tool surface size.** The server exposes ~150 tools. **[VERIFY]** whether the Apps SDK / directory has a practical cap or prefers a curated set per app. If so, consider exposing a **curated subset** for the ChatGPT app (the high-value verbs: `plan_task`, `list_accounts`, `discover_opportunities`, `analyze_wasted_spend`, `get_*` reporting, `create_campaign`, `add_negative_keywords_bulk`, RSA tools, `pause_campaign`/status) behind an app-specific profile, rather than all 150.
- **Tool metadata:** **[VERIFY]** whether tools should carry `_meta` / `openai/*` fields (e.g., human-readable invoking/invoked labels) for a better in-chat display. Optional but improves UX.
- **Confirmation on writes:** ✅ **structurally enforced** — mutating tools preview by default and only apply with `confirm=true`. This directly satisfies the "destructive actions require user confirmation" expectation. Make sure write tools are also flagged with the appropriate **annotations** (e.g., not read-only) so ChatGPT treats them as consequential. **[VERIFY]** the exact annotation fields.

## UI component (widget)
- **[DECISION]** Apps SDK supports rendering **UI components** (widgets) inline, but a **tool-only** app (text responses, no custom UI) is **[VERIFY] believed allowed**. 
- **Recommended, not required:** an **"approval card" widget** — render the exact before → after of a pending change with an Approve button — is an excellent fit for Adssassin's "you approve every change" model and would strengthen the listing. This is a real build (serve an HTML/Skybridge component + wire the approve action through the MCP). Treat as a **fast-follow**, not a blocker for a first submission.

## Security / safety / data
- ✅ Server-side account fence (can only operate on attached accounts).
- ✅ Preview-then-confirm on all mutations.
- ✅ Google OAuth (no password handling); user can revoke.
- **Allowed-domains / tool justification:** **[VERIFY]** the form likely asks you to justify tools and declare the domains the app connects to / loads resources from. Declare `mcp.adssassin.ai` (and any domain a widget would load from). Keep this list tight.
- **Policy:** ensure behavior matches OpenAI's usage policies — the app stays in scope (Google Ads), refuses abuse/injection (see `test-cases.md` N3), and never bypasses the approval gate (N1).

---

## Open items to close before submitting
> Current status of all six is tracked in [`STATUS.md`](./STATUS.md). Summary:

1. ✅ **Square app icon** — produced: `assets/adssassin-icon-{1024,512,256}.png`.
2. **[VERIFY — you]** Confirm OpenAI account/workspace **eligibility to submit** an app.
3. **[VERIFY]** Confirm the server exposes the **name/description/icon** the directory reads, in the place the Apps SDK expects (the icon can also be uploaded on the form).
4. **[DECISION]** Curate the **tool subset** for the app (vs. all ~150) only if a directory limit/testing calls for it — see [`tool-profile.md`](./tool-profile.md). No global change made.
5. ✅ **Google connect reachable in-chat** — resolved. `effectiveCredentials()` (`src/util/tenantContext.ts`) throws an actionable error containing the user's `/connect` link whenever Google isn't connected, so ChatGPT guides them automatically. Show it in the demo.
6. ✅ **OAuth discovery present (code-verified)** — `/.well-known/oauth-protected-resource[/mcp]` + `/.well-known/oauth-authorization-server` (Clerk, DCR). Remaining: one real connect test from ChatGPT before recording.
7. **Fast-follow:** the **approval-card widget** (optional, high-value).

The OAuth + confirmation + in-chat-connect foundations — usually the hard part —
are already in production; the remaining work is account/form steps + the video.
