# Tool profile for the ChatGPT app (decision)

**The question:** the Adssassin MCP exposes ~150 tools. Should the ChatGPT app
expose all of them, or a curated subset?

**Why it matters:** a large tool list can hurt tool-selection accuracy and may
exceed a practical cap the Apps SDK / directory imposes. **[VERIFY]** whether
the directory enforces a tool limit.

**The constraint:** the MCP at `mcp.adssassin.ai/mcp` is the **same server** that
serves Claude and the paid app today. Curating must NOT remove tools from those
clients. So this is a *per-client profile*, not a global trim — do **not** change
the global tool surface for this.

## Recommendation
1. If the directory has **no hard cap** and selection quality is fine in testing → **ship the full set** (simplest; no code change).
2. If a cap applies or selection degrades → expose a **curated profile** via a mechanism that only narrows for the ChatGPT connection (e.g. an env/flag-gated tool filter, or a dedicated MCP route/profile). Implementation is a backend change in `adssassin-google-ads-mcp` and should be decided explicitly — it's not done here.

## The curated set (if needed) — the high-value verbs
Routing + discovery
- `plan_task` (always — the router), `list_accounts`, `check_google_ads_capability`

Research
- `research_brand`, `get_keyword_ideas`, `search_expert_knowledge`

Audit + reporting (read)
- `discover_opportunities`, `run_audit_phase`, `analyze_wasted_spend`,
  `get_account_overview`, `get_campaigns`, `get_ad_groups`, `get_keywords`,
  `get_search_terms`, `get_ads`, `compare_periods`, `run_gaql_query`

Build + optimize (preview→confirm)
- `create_campaign`, `create_responsive_search_ad`, `add_negative_keywords_bulk`,
  `add_keyword`, `adjust_budget`, `adjust_keyword_bid`,
  `pause_campaign` / `enable_campaign`, `set_campaigns_status_bulk`

Account onboarding
- (none needed — the connect link is surfaced automatically when Google isn't
  connected; see mcp-conformance.md #5)

Deliberately **excluded** from a curated ChatGPT profile (power/edge tools that
add noise for a first-run app user): ads-script tooling, automations/rules,
experiments, Slack tools, memory tools, isolation tools (paid-gated anyway),
PMax/shopping/feed internals, conversion-import tooling. Keep these in the full
Claude/app surface; just don't surface them to a brand-new ChatGPT user.

> Start with option 1 (full set) and only curate if testing or a directory
> limit forces it. Curating is reversible and additive-safe.
