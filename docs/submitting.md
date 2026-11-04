# Adssassin — distribution packaging

How to get Adssassin into people's own Claude, ChatGPT, and Gemini, and what to
submit to each platform's directory. The engine is a hosted, OAuth-authenticated
MCP server; a user connects it, signs in, connects their Google Ads account, and
works through their own AI — on the free tier or a paid plan.

- **MCP endpoint:** `https://mcp.adssassin.ai/mcp` (the public MCP service, Clerk
  OAuth). Set `NEXT_PUBLIC_MCP_URL` on the app so the free dashboard shows it.
- **Auth:** each user signs in with Clerk (dynamic client registration via
  `/.well-known/oauth-protected-resource/mcp`); they then open their `/connect`
  link to authorize their Google Ads account. No shared keys.
- **Custom instructions:** `project-instructions.md` in this folder — the block
  users paste into their project / GPT / Gem.

The user's funnel: **pricing → Start free → connect Google → copy the MCP URL →
add it to their AI → paste the instructions → work.**

---

## The onboarding flow we teach a new (free) user

1. Go to the pricing page, click **Start free** → land on the `/free` dashboard.
2. **Connect your Google Ads account** (the dashboard's connect link).
3. **Copy the MCP server URL** from the dashboard.
4. In your AI, **add Adssassin as an MCP connector** (steps per platform below)
   and sign in with the same Adssassin account.
5. Create a project / GPT / Gem and **paste the custom instructions**
   (`project-instructions.md`).
6. Ask it to work on your Google Ads. Free covers read + research + audits and
   5 approved changes a month on one account; upgrade for more.

---

## Per-platform setup + what to submit

> Platform MCP support and directory requirements change often. The engine
> (OAuth MCP + the skills) is platform-agnostic and done; the per-store
> packaging and review is the work. **Verify each platform's current steps
> before submitting** — the notes below are the shape, not a frozen spec.

### Claude
- **Connect:** add the MCP URL as a **custom connector** (Settings → Connectors),
  sign in via the OAuth prompt, then open `/connect` for Google Ads.
- **Submit:**
  - **Connector directory** — submit the hosted MCP URL.
  - **Skills** — publish the Google Ads skill bundle (audit, copywriter,
    keyword-isolation, etc.) that routes through this MCP.
  - **Plugin** — a `.claude-plugin` that bundles the skills + the MCP connection
    + the custom instructions in one install.

### ChatGPT
- **Connect:** add Adssassin as an **MCP connector / Action** (developer mode /
  Apps SDK), authorize via OAuth.
- **Submit:**
  - A **custom GPT** with the instructions from `project-instructions.md` and the
    Adssassin Action/connector attached.
  - An **app/connector** listing where the directory accepts third-party MCPs.

### Gemini
- **Connect:** add Adssassin as an **MCP / extension** endpoint where the
  workspace supports it.
- **Submit:**
  - A **Gem** with the custom instructions.
  - An **extension** manifest mapping the MCP tools (or an OpenAPI shim if MCP
    isn't natively accepted yet).

---

## A reusable submission kit (build once, list everywhere)

- The hosted **MCP URL** + its `/.well-known` OAuth metadata (done).
- The public **skills bundle** (methodology + per-task workflows that call the MCP).
- The **custom-instructions block** (`project-instructions.md`).
- A marketing **one-pager**: "Free = read + research + methodology + 5 live
  changes, in your own AI."
- Per-platform **listing copy**, **screenshots**, and a **privacy/permissions**
  blurb (each directory requires its own).

## What each platform gates (so support can answer "why can't I…")

Free users get: direct MCP, 1 account, read/research/audits, 5 approved
changes/month, and the expert methodology. Paid unlocks: unlimited changes,
more accounts, automations & scripts, the hosted interface, and the proprietary
keyword-isolation strategy. The MCP returns an upgrade message with a link at
each of those boundaries — the custom instructions tell the model to relay it.
