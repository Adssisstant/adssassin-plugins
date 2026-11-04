---
name: build-search-campaign
description: Build a new Google Ads Search campaign end-to-end through Adssassin — research the business, pick keywords, structure ad groups, write ads, set budget and bidding — created paused for approval. Use when someone wants to launch, create, or set up a new Google Ads search campaign, or build out a new offer. Requires the Adssassin MCP connected.
---

# Build a Search campaign — via Adssassin

Build everything through the **Adssassin MCP**. New campaigns and ads are created
**paused** so the user reviews before anything spends.

1. Call **`plan_task`** with the user's request and follow the workflow it returns.
2. Research first: **`research_brand`** on the business URL (offerings, pricing,
   positioning) and **`get_keyword_ideas`** for the keyword set, volumes, and bid
   estimates. Let `plan_task` sequence these.
3. Propose the structure — campaign settings, ad groups, keywords with match
   types, responsive search ads, budget, bidding, and negatives — as a clear plan
   the user can edit.
4. Build with **`create_campaign`** (or the tools `plan_task` names). It previews
   the exact campaign by default; show it, get explicit approval, then re-call with
   **`confirm=true`**. Keep it PAUSED unless the user asks to launch live.
5. Relay any limit/upgrade message with its link and stop (free covers a limited
   number of approved changes a month).

Confirm the destination URL, location targeting, and budget with the user before
building — those are the easy things to get wrong.
