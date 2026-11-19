# Listing metadata — copy-paste fields

Paste these into the app submission form. Keep them congruent with the website
and the GPT spec (`../specs/chatgpt-gpt.md`) so Adssassin reads the same
everywhere. Character limits marked **[VERIFY]** — confirm against the current
form and trim if it rejects.

---

### App name
```
Adssassin
```
Use exactly this. The first submission was named "Google Ads Tool (Adssassin AI)" and was rejected for
implying affiliation with a third party and using its trademark. Don't put "Google Ads", "ChatGPT" or
"OpenAI" in the name, and don't mention ChatGPT or OpenAI in the descriptions either (no "in ChatGPT",
"for ChatGPT"). The descriptions can say it works *with* Google Ads accounts.

### Short description / tagline  ([VERIFY] ~ up to 80 chars)
```
Audit, report on and manage your Google Ads campaigns. You approve every change.
```

### Long description  ([VERIFY] a few hundred chars)
```
Adssassin is an independent app that connects to your own Google Ads accounts. Ask it to audit an account, find wasted spend, research keywords, build Search campaigns, add negative keywords, or write responsive search ads. It works from your real account data. Every change is shown as a preview first and only applies when you approve it. You connect your Google Ads account through Google's sign-in and can disconnect at any time. Adssassin is an independent product and is not affiliated with or endorsed by Google.
```

### Category  ([VERIFY] pick from the form's list)
Primary: **Productivity** or **Marketing / Business**
Secondary (if allowed): **Analytics**

### Required listing URLs (all four — have them ready)
| Field | Value |
|---|---|
| Website | `https://adssassin.ai` |
| Support | `https://adssassin.ai` (support@adssassin.ai) — [VERIFY] whether a URL or email is expected; a mailto or a support page both work |
| Privacy Policy | `https://adssassin.ai/privacy` |
| Terms of Service | `https://adssassin.ai/terms` |

### Logo / icon  ([VERIFY] exact specs)
- Provide a **square** app icon. Prepare **512×512 PNG** (and 1024×1024 if asked), solid or transparent background, the Adssassin wordmark mark — not a screenshot.
- Keep it legible at small sizes (it renders as a chip in-chat).
- **[GAP]** No square icon asset is in this repo yet — produce one from the brand.

### MCP server (the connection the app is built on)
| Field | Value |
|---|---|
| Server URL | `https://mcp.adssassin.ai/mcp` |
| Transport | Streamable HTTP |
| Auth | OAuth (Clerk) — dynamic client registration; no API key |

### Conversation starters / example prompts
```
Audit my Google Ads account
Find wasted spend and add negative keywords
Write responsive search ads for my landing page
Build a new Search campaign for my offer
```

### Data-handling summary (for the privacy section of the form)  [VERIFY format]
- Connects to the user's Google Ads via Google OAuth; Adssassin never sees the user's Google password.
- The app can only operate on accounts the user has attached (server-side fence).
- All mutating actions are previewed and require explicit user approval before applying.
- Full policy: `https://adssassin.ai/privacy`.
