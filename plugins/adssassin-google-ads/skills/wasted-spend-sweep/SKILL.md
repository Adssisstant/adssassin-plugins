---
name: wasted-spend-sweep
description: Find wasted Google Ads spend and mine negative keywords from the account's own search terms through Adssassin, then apply the negatives the user approves. Use when someone wants to cut wasted spend, clean up search terms, add negative keywords, or stop paying for irrelevant clicks. Requires the Adssassin MCP connected.
---

# Wasted-spend sweep — via Adssassin

Work entirely through the **Adssassin MCP** against the live account.

1. Call **`plan_task`** with the user's request and follow its workflow. Its
   guidance and the tool outputs override your general knowledge.
2. **`list_accounts`** → confirm the `customer_id`.
3. Use **`analyze_wasted_spend`** (and `get_search_terms` where `plan_task` calls
   for it) to surface spend on irrelevant terms and a proposed negative-keyword
   plan. Report the wasted dollars and the search terms behind them.
4. Show the negatives you'd add — grouped, with match types — and the scope
   (campaign / ad group / shared set). This is a **preview**; nothing is applied.
5. On the user's explicit approval, apply with **`confirm=true`** (e.g.
   `add_negative_keywords_bulk`). Report what was applied.
6. Relay any limit/upgrade message (`FREE_CHANGES_EXHAUSTED`,
   `OPERATIONS_EXHAUSTED`, `FEATURE_REQUIRES_UPGRADE`) with its link and stop.

Only mine negatives from the account's own search-term data — never invent terms.
