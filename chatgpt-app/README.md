# Adssassin — ChatGPT App Directory submission kit

Everything needed to submit Adssassin to the **ChatGPT app directory** (OpenAI's
"Apps in ChatGPT", built on the Apps SDK / MCP). The app is backed by the
**already-live** Adssassin MCP server — this kit is the listing, the review
materials, and the conformance checklist around it.

> ⚠️ **Verify against current OpenAI docs before submitting.** This kit was
> assembled from OpenAI's public announcements + help-center guidance and the
> Apps SDK as known at build time; the submission portal, required fields, and
> review rules change often. Confirm each item against:
> - Submitting apps to the ChatGPT app directory (OpenAI Help Center)
> - The Apps SDK developer docs (`developers.openai.com/apps-sdk`)
> - OpenAI's app developer guidelines / usage policies
> Where this kit states a specific number or field, treat it as "last known" and
> re-check. Items we could not verify live are marked **[VERIFY]**.

---

## The pitch (one line for the reviewer and the listing)
Adssassin puts a decade of Google Ads expertise inside ChatGPT: it audits the
account, finds wasted spend, researches keywords, builds campaigns and writes
ads — and **every change waits for the user's approval**.

## Why Adssassin is well-positioned
The hard parts are already done and in production:

| Requirement | Status |
|---|---|
| Live remote MCP server (must be live at submission) | ✅ `https://mcp.adssassin.ai/mcp` |
| OAuth 2.x with dynamic client registration + `.well-known` discovery | ✅ Clerk-backed |
| Mutations gated behind explicit user confirmation | ✅ preview-by-default, applies only on `confirm=true` |
| Server-side account fencing (can't touch accounts the user didn't attach) | ✅ |
| Website / Support / Privacy / Terms URLs | ✅ all four exist (see `listing.md`) |
| A domain you control for verification | ✅ `adssassin.ai` |

## What still has to be produced (and where it lives here)
1. **Listing metadata** — name, descriptions, category, the 4 URLs, logo → [`listing.md`](./listing.md)
2. **Test cases** — the positive + negative cases the review requires → [`test-cases.md`](./test-cases.md)
3. **Demo video** — reviewer-facing walkthrough → script in [`demo-video-script.md`](./demo-video-script.md)
4. **Domain verification** — prove you own `adssassin.ai` → [`domain-verification.md`](./domain-verification.md)
5. **MCP / Apps SDK conformance** — the technical audit + open decisions → [`mcp-conformance.md`](./mcp-conformance.md)

## Suggested order of operations
1. Read [`mcp-conformance.md`](./mcp-conformance.md) and close any **[GAP]** items on the MCP server (the big ones — OAuth, confirmation gating — are already done).
2. Confirm your OpenAI account/workspace is **eligible to submit** an app. **[VERIFY]**
3. Do the **domain verification** for `adssassin.ai`.
4. Finalize the **listing** copy + logo.
5. Record the **demo video** from the script.
6. Prepare the **test cases** in the reviewer's required format.
7. Submit, resolve any automated findings, and wait for review. **Submission ≠ guaranteed listing** — OpenAI reviews for quality/safety.

## One product note worth deciding before launch
A user who installs the app in ChatGPT and never visits the Adssassin web
dashboard still has to (a) connect their Google account and (b) — on the free
plan — pick their one account. The MCP guides (a) via its `/connect` link; (b)
currently happens on the web dashboard. For a clean ChatGPT-only onboarding,
consider surfacing "pick your account" through the MCP itself. Not a submission
blocker, but it affects first-run success — and the demo video should show the
full connect → authorize → work flow so the reviewer sees it succeed.
