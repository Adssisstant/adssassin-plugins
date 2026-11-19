# Resubmission notes (after the 2026-11-18 rejection)

OpenAI rejected the first submission ("Google Ads Tool (Adssassin AI)") for six reasons. This page lists
what changed for each one, what you still need to do in the OpenAI dashboard, and the per-tool annotation
justifications the form asks for.

The server changes are in `adssassin-google-ads-mcp` (PR "ChatGPT app review: no hidden tools, explicit
annotations, neutral copy, no commerce over MCP"). They apply to every MCP connection on
`https://mcp.adssassin.ai/mcp`; the Adssassin web app is unchanged.

| # | Rejection reason | What changed | Your action |
|---|---|---|---|
| 1 | Enables commerce for digital goods/services | Over MCP, plan limits now only state the limit ("this isn't included in this account's plan"). No upgrade links, checkout or top-up URLs, or prices appear in any tool result. | None in code. Don't mention pricing or plans in the listing, demo video or test prompts. |
| 2 | Name/description implies affiliation or uses trademarks | Listing copy rewritten (`listing.md`): name **Adssassin**, with a non-affiliation line in the long description. | Change the app name in the dashboard from "Google Ads Tool (Adssassin AI)" to **Adssassin**, and paste the new descriptions. |
| 3 | Annotations don't match behavior / not explicit | Every exposed tool now sets all four hints explicitly (`src/tools/annotations.ts`). Tools that only add things (create campaign, add keyword or negative) are no longer marked destructive; tools that overwrite a setting are. Relative budget changes are not idempotent. Account reads are closed-world; fetching public web pages and Keyword Planner data is open-world. | Paste the justifications from the table below into the form. |
| 4 | Tool naming and description quality | Directive and comparative wording removed from names, titles, descriptions and server instructions (no "ALWAYS CALL THIS FIRST", "flagship", "use this instead", "overrides general knowledge"). Every description now says what the tool does and when to use it. | None. |
| 5 | Dynamic tools run operations not exposed for review | `plan_task` used to search and recommend the full 157-tool catalog, and the capability checker named tools ChatGPT couldn't see. Both now only name the 45 tools exposed. `apply_recommendation`, which applied any type of Google recommendation, was removed from the exposed set. `run_gaql_query` no longer refuses to run until `plan_task` has been called. | None. Every model-callable operation is now one of the 45 tools listed below. |
| 6 | Couldn't verify the owner of the plugin/brand | — | Complete **business verification** in OpenAI Platform settings (use the "Platform Settings" link in the rejection email) as Adssassin's legal entity, or submit from the account that's already verified for the business. Make sure the verified business name matches Adssassin, and that domain verification for `adssassin.ai` is done (`domain-verification.md`). |

## Reply to the reviewer (optional, paste into the appeal or the resubmission notes)

> Thanks for the review. We've addressed each point: the app is now listed as "Adssassin", with no third-party
> names in the title and a non-affiliation statement in the description. Tool results contain no purchase links
> or pricing. All 45 tools set readOnlyHint, destructiveHint, idempotentHint and openWorldHint explicitly; the
> justification for each is below. Tool descriptions describe only what each tool does. No tool dispatches to
> operations outside the exposed list: the planning tool only returns the names of exposed tools, and the tool
> that applied arbitrary Google recommendations has been removed. Every tool that changes an account returns a
> preview and only applies the change when called again with confirm=true. Business verification is complete
> for [legal entity name].

## Tool annotations and justifications

Hints describe the confirmed call (the worst case): every tool that changes an account returns a preview unless
called with `confirm=true`. Generated from `adssassin-google-ads-mcp/src/tools/annotations.ts`.

45 tools

| Tool | readOnlyHint | destructiveHint | idempotentHint | openWorldHint | Why |
|---|---|---|---|---|---|
| `plan_task` | true | false | true | false | Returns a plan built from server-side workflow definitions. Reads no account data, changes nothing, calls no external system. |
| `run_audit_phase` | true | false | true | false | Runs a fixed set of read-only report queries and returns findings. Changes nothing. |
| `isolate_keyword` | false | false | false | true | Creates a new paused campaign with one keyword and ad, and adds negative keywords to it and to the user's other isolation/broad campaigns. Only adds; it never removes or overwrites existing keywords, bids or budgets. |
| `get_negatives_snapshot` | true | false | true | false | Reads the account's negative keywords and lists. Read-only. |
| `list_accounts` | true | false | true | false | Lists the Google Ads accounts the user connected. Read-only. |
| `run_gaql_query` | true | false | true | false | Runs a SELECT report query against the user's account. The server rejects anything but SELECT, so it cannot change data. |
| `get_account_overview` | true | false | true | false | Reads account-level metrics from the user's account. Read-only. |
| `get_campaigns` | true | false | true | false | Reads campaigns and their metrics. Read-only. |
| `get_ad_groups` | true | false | true | false | Reads ad groups and their metrics. Read-only. |
| `get_keywords` | true | false | true | false | Reads keywords and their metrics. Read-only. |
| `get_search_terms` | true | false | true | false | Reads the search terms report. Read-only. |
| `get_ads` | true | false | true | false | Reads ads and their metrics. Read-only. |
| `get_conversion_actions` | true | false | true | false | Reads conversion action settings. Read-only. |
| `get_recommendations` | true | false | true | false | Reads Google's recommendations for the account without applying any. Read-only. |
| `get_change_history` | true | false | true | false | Reads the account's change history. Read-only. |
| `pause_campaign` | false | true | true | true | Sets a campaign's status to PAUSED, overwriting its current status. Reversible; repeating it has no further effect. |
| `enable_campaign` | false | true | true | true | Sets a campaign's status to ENABLED, overwriting its current status. Reversible; repeating it has no further effect. |
| `adjust_budget` | false | true | false | true | Overwrites a campaign's daily budget. Not idempotent: relative changes (increase_by, increase_percent...) compound if repeated. |
| `update_campaign_bidding` | false | true | true | true | Overwrites a campaign's bidding strategy and targets with the given values. Repeating it has no further effect. |
| `update_campaign` | false | true | true | true | Overwrites a campaign's name and/or status with the given values. Repeating the same values has no further effect. |
| `add_keyword` | false | false | false | true | Adds a keyword to an ad group. Adds only; existing keywords are unchanged. |
| `add_negative_keyword` | false | false | false | true | Adds a negative keyword. Adds only; nothing existing is removed or overwritten. |
| `adjust_keyword_bid` | false | true | true | true | Overwrites a keyword's CPC bid with the given amount. Repeating it has no further effect. |
| `set_keyword_status` | false | true | true | true | Sets a keyword to ENABLED or PAUSED, overwriting its status. Reversible; repeating it has no further effect. |
| `add_negative_keywords_bulk` | false | false | false | true | Adds a batch of negative keywords. Adds only; nothing existing is removed or overwritten. |
| `adjust_ad_group_bid` | false | true | true | true | Overwrites an ad group's CPC or target CPC bid with the given amount. Repeating it has no further effect. |
| `set_ad_status` | false | true | true | true | Sets an ad to ENABLED or PAUSED, overwriting its status. Reversible; repeating it has no further effect. |
| `create_campaign` | false | false | false | true | Creates a new campaign (paused unless launch_now=true). Adds only; touches no existing campaign. Not idempotent: a repeat creates another campaign. Open world: its ads can serve publicly. |
| `create_ad_group` | false | false | false | true | Creates a new ad group. Adds only. A repeat creates another ad group. |
| `create_responsive_search_ad` | false | false | false | true | Creates a new ad. Adds only. A repeat creates another ad; ads can serve publicly. |
| `get_keyword_ideas` | true | false | true | true | Queries Google's Keyword Planner for public search-volume data. Read-only; the data is about public search behaviour, not the user's account. |
| `discover_opportunities` | true | false | true | false | Runs read-only report queries and returns suggested fixes. It applies nothing; each fix is a separate write tool that previews first. |
| `analyze_wasted_spend` | true | false | true | false | Runs read-only search-term reports and returns suggested negatives. It adds nothing itself. |
| `research_brand` | true | false | true | true | Fetches a public website the user names and extracts its content. Read-only, but reaches the open web. |
| `search_expert_knowledge` | true | false | true | false | Searches Adssassin's own best-practice knowledge base by topic. Changes nothing; no account data and no external system. |
| `check_google_ads_capability` | true | false | true | false | Looks up a static list of what this app supports. Changes nothing; no external system. |
| `get_product_performance` | true | false | true | false | Reads product-level Shopping/Performance Max metrics. Read-only. |
| `get_geo_performance` | true | false | true | false | Reads metrics segmented by location. Read-only. |
| `get_performance_breakdown` | true | false | true | false | Reads metrics segmented by device, day, hour or network. Read-only. |
| `get_conversion_breakdown` | true | false | true | false | Reads conversions per conversion action. Read-only. |
| `get_impression_share` | true | false | true | false | Reads impression share metrics. Read-only. |
| `compare_periods` | true | false | true | false | Reads metrics for two date ranges and computes the differences. Read-only. |
| `add_account_negative_keywords` | false | false | false | true | Adds account-level negative keywords. Adds only. |
| `list_account_negative_keywords` | true | false | true | false | Reads account-level negative keywords. Read-only. |
| `inspect_site_tags` | true | false | true | true | Fetches public web pages' HTML to detect tracking tags. Read-only, but reaches the open web. |
