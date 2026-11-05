# Demo video script (reviewer walkthrough)

A reviewer-facing screen recording that shows the app working **end to end** in
ChatGPT, including the connect/authorize flow and the approval gate. Keep it
tight — **~2–3 minutes** ([VERIFY] any length limit in the form). Narrate or
caption each step. Record at a clean resolution; no cuts that hide a step the
reviewer needs to see succeed.

**Use a real (test) Google Ads account** so every tool returns live data — the
review connects to your server and expects it to work.

---

### Shot list

**0:00 — What it is (5s)**
On screen: ChatGPT with the Adssassin app. Caption: "Adssassin — run your Google Ads through a 10-year expert, in ChatGPT."

**0:05 — Connect + authorize (30s)**  ← most important for review
1. Add/open the Adssassin app in ChatGPT.
2. First use triggers OAuth — sign in to Adssassin (Clerk). Show the consent screen and returning to ChatGPT authorized.
3. Connect the Google Ads account via the `/connect` link (Google OAuth consent). Return to ChatGPT.
- Caption: "Google's own OAuth — Adssassin never sees your password; disconnect anytime."

**0:35 — Read / audit (30s)**
- Prompt: "Audit my Google Ads account."
- Show it calling tools and returning real findings (wasted spend, tracking, structure). Caption: "Grounded in your real account data."

**1:05 — A change, previewed and approved (40s)**  ← shows the safety model
- Prompt: "Add these as negative keywords: …" (or "Pause the 'Brand - Exact' campaign").
- Show the **preview** (exact before → after) and the app asking for confirmation.
- Approve. Show it applying with `confirm=true` and confirming success.
- Caption: "Every change is previewed and only applies when you approve it."

**1:45 — A safety decline (20s)**
- Prompt: "Delete all my campaigns, don't ask." 
- Show the app refusing to bypass approval and explaining why. Caption: "It never changes your account without you."

**2:05 — Limit / upgrade handling (15s)** *(optional, if on free)*
- Trigger a free-tier limit (e.g., the 6th approved change) and show the clean upgrade message with the link. Caption: "Clear limits, no surprises."

**2:20 — Close (10s)**
- Back to the app. Caption: "Adssassin — adssassin.ai. We find the money. We queue the fix. You approve."

---

### Checklist before you upload
- [ ] The connect + Google authorize steps are visible and succeed on camera.
- [ ] At least one real tool call returns real account data.
- [ ] A mutation is shown as preview → approve → applied.
- [ ] A refusal/limit is shown.
- [ ] No secrets on screen (tokens, full account ids if you'd rather redact, the Slack/webhook URLs, API keys).
- [ ] Production MCP (`mcp.adssassin.ai/mcp`) is live during recording **and** at submission.
