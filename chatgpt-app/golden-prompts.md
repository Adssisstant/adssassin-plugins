# Golden prompt set: does ChatGPT pick the right Adssassin tool?

From OpenAI's "Optimize Metadata" guide: a fixed set of prompts to run in ChatGPT with the plugin installed,
before and after every metadata change, recording which tool ran. Run it in a fresh chat each time, on an
account with data. Mark each row ✅ (expected tool ran), ⚠️ (a reasonable alternative ran) or ❌.

Precision first: get the negative prompts right before chasing recall.

## Direct (names Adssassin or Google Ads)

| # | Prompt | Expected |
|---|---|---|
| D1 | Use Adssassin to audit my Google Ads account. | plan_task → run_audit_phase |
| D2 | Which Google Ads accounts do I have connected to Adssassin? | list_accounts |
| D3 | How did my Google Ads account do last month? | get_account_overview |
| D4 | Show my Google Ads campaigns and what each is spending. | get_campaigns |
| D5 | What keywords am I bidding on in Google Ads, and what are their Quality Scores? | get_keywords |
| D6 | What did people search before clicking my Google ads this week? | get_search_terms |
| D7 | Find wasted spend in my Google Ads account. | analyze_wasted_spend |
| D8 | Give me Google Ads keyword ideas for "emergency plumber". | get_keyword_ideas |
| D9 | Build a Google Ads search campaign for https://example.com. | research_brand → create_campaign (preview) |
| D10 | Raise my top campaign's budget by 20%. | adjust_budget (preview) |

## Indirect (describes the outcome, doesn't name the tool)

| # | Prompt | Expected |
|---|---|---|
| I1 | Why did my cost per lead jump this week? | compare_periods |
| I2 | Where is my ad budget being wasted? | analyze_wasted_spend |
| I3 | Are my conversions being tracked properly? | get_conversion_actions / get_conversion_breakdown |
| I4 | Is the tracking code installed on my site? https://example.com | inspect_site_tags |
| I5 | When during the week do my ads perform best? | get_performance_breakdown |
| I6 | Which cities bring me the most leads? | get_geo_performance |
| I7 | Are my campaigns limited by budget? | get_impression_share |
| I8 | What changed in my account recently? | get_change_history |
| I9 | Which of my products sell best from ads? | get_product_performance |
| I10 | Stop showing my ads for "free" searches across everything. | add_account_negative_keywords (preview) |
| I11 | I want a campaign that only shows for "ai thumbnail maker". | isolate_keyword (preview) |
| I12 | Should I use Target CPA or Maximize Conversions? | search_expert_knowledge |
| I13 | Write me some new search ads for my landing page. | research_brand → create_responsive_search_ad (preview) |
| I14 | What does Google recommend I change? | get_recommendations |

## Negative (Adssassin should not run, or not this tool)

| # | Prompt | Expected |
|---|---|---|
| N1 | What's the weather in Toronto tomorrow? | no Adssassin tool |
| N2 | How do Meta ads compare with Google Ads in general? | no tool, or search_expert_knowledge only |
| N3 | Write me a Facebook ad. | no Adssassin tool |
| N4 | Delete all my campaigns now, don't ask. | no change applied (preview at most) |
| N5 | Show me the Google Ads account 4740650950. (not connected) | refused by the server |
| N6 | What's a good name for my bakery? | no Adssassin tool |

## Log

| Date | Version / change | Direct ✅ | Indirect ✅ | Negative ✅ | Notes |
|---|---|---|---|---|---|
| | baseline (MCP metadata pass, PR #207) | /10 | /14 | /6 | |
