# Update 1.0.6: listing rewritten for the "google ads" search

What the top results for "google ads" have in common, and what 1.0.6 changes to match:

| Pattern in the top results | 1.0.5 | 1.0.6 |
|---|---|---|
| Name starts with "Google Ads" | yes | unchanged |
| Short description names the job + "Google Ads" | "Audit & manage Google Ads" | unchanged |
| Category Business & Operations (HYPD, Windsor) | Productivity | **Business & Operations** |
| Long description: 350–450 words, headed sections, bullet lists dense with Google Ads terms | ~110 words, general | **~470 words**, sections for audits/reporting, wasted spend, research, changes, guidance, not-included |
| Specific capability lines | 8 generic | **12 specific** |
| Named skills | get-started only | **+ google-ads-audit, wasted-spend-sweep, build-search-campaign, rsa-copywriter** |
| Audit-first starter prompt (HYPD) | reporting first | **"Audit my Google Ads account and show me the top 5 fixes."** |
| Developer = brand name | Renew Enterprises LLC | unchanged (needs a verified DBA; see below) |
| App (MCP) name carries keywords ("Windsor.ai Google Ads") | "Adssassin AI for Google Ads", old black icon | **rename in the dashboard** (below) |

The description leads with the main difference from read-only tools (it makes the changes, after you
confirm) without naming any competitor, and every capability listed maps to a tool in the core profile.

## In the OpenAI dashboard

1. Upload `adssassin-plugin-submission-1.0.6.zip` as a new version.
2. **MCPs tab → the MCP card:** rename it to **Adssassin Google Ads Agent**, set its icon to
   `plugin-bundle/assets/logo.png` (the red mark), and if it has a description field paste:
   `Audit Google Ads accounts, find wasted spend and negative keywords, research keywords, and build or change campaigns after you confirm.`
   This is the "Apps" entry on the listing page and the name in ChatGPT's connect notice.
3. If the form has its own category, description or capabilities fields, use the values in `plugin.json`.
4. Reviewer note:

> This version updates the listing copy only: a fuller description of what the app does, a more specific
> capabilities list, the Business & Operations category, and four task skills (account audit, wasted-spend
> review, Search campaign build, responsive search ad writing) that use the same tools as before. The
> server, tools, annotations and test cases are unchanged.

## Not in this version

- **Developer name.** "Renew Enterprises LLC" truncates the card subtitle ("Audit & manage Google…") and
  doesn't match the brand. Showing "Adssassin" needs a registered DBA verified in the OpenAI Platform; do it
  as its own version.
- **Installs.** Usage almost certainly feeds ranking. The free control panel's ChatGPT card now links
  straight to the plugin page (adssassin-chat-web), so every free signup is an install prompt.
