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
(If the form wants a category-qualified name: `Adssassin — Google Ads`.)

### Short description / tagline  ([VERIFY] ~ up to 80 chars)
```
A 10-year Google Ads expert in ChatGPT. You approve every change.
```

### Long description  ([VERIFY] a few hundred chars)
```
Adssassin runs your Google Ads with a decade of hands-on expert methodology — not generic advice. Ask it to audit the account, find wasted spend, research keywords, build Search campaigns, mine negative keywords, or write responsive search ads. It reads your real account data and does the work. Every change is previewed with the exact before → after and only applies when you approve it — nothing touches your account on its own. Connect with Google's own OAuth; disconnect anytime.
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
