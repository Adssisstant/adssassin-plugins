---
name: rsa-copywriter
description: Write high-converting Google responsive search ads (headlines and descriptions) for a business through Adssassin, grounded in its real offerings, then add them to an ad group on approval. Use when someone wants Google Ads copy, RSAs, headlines, or descriptions, or gives a business URL and asks for search ads. Requires the Adssassin MCP connected.
---

# RSA copywriter — via Adssassin

Ground the copy in the real business and the live account, through the **Adssassin
MCP** — not generic templates.

1. Call **`plan_task`** with the user's request and follow its workflow.
2. Use **`research_brand`** on the business URL to pull offerings, pricing, proof
   points, and positioning. Use the account's own winning themes where `plan_task`
   points to them.
3. Draft the RSA within Google's limits — up to 15 headlines (≤30 chars) and 4
   descriptions (≤90 chars). Cover distinct angles: the offer, the USP, proof,
   and a clear call to action. Avoid generic AI filler.
4. Show the full ad for review. To add it, use **`create_responsive_search_ad`**
   (or what `plan_task` names): it previews by default; on explicit approval,
   re-call with **`confirm=true`** against the chosen ad group.
5. Relay any limit/upgrade message with its link and stop.

Respect character limits exactly, and never make trademark or superlative claims
the business can't back up.
