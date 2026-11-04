# Adssassin Google Ads — Claude plugin

Bundles the **Adssassin MCP** (`https://mcp.adssassin.ai/mcp`) and the skills that
drive it, so one install gives a Claude client the connection **and** the
workflows. Each skill routes through the MCP: `plan_task` first, preview every
change, apply only with `confirm=true` after approval, and relay the upgrade
message at any limit.

## What's inside
- `.claude-plugin/plugin.json` — plugin manifest.
- `.mcp.json` — the Adssassin MCP server (remote, Streamable HTTP, OAuth).
- `skills/` — `google-ads-audit`, `wasted-spend-sweep`, `build-search-campaign`,
  `rsa-copywriter`. Standard `SKILL.md`, so they also work dropped into any
  skills directory on their own.

## Install (Claude Code)
```
/plugin marketplace add Adssisstant/adssassin-plugins
/plugin install adssassin-google-ads@adssassin
```
(`adssassin-google-ads` is the plugin name; `adssassin` is the marketplace name
from `.claude-plugin/marketplace.json`.)

Then connect: the MCP prompts an OAuth sign-in on first use (run `/mcp` if it
doesn't) — then open your Adssassin `/connect` link to authorize your Google Ads
account.

## Before publishing — validate
```
claude plugin validate ./plugins/adssassin-google-ads
claude plugin validate ./            # the marketplace
```
Test the MCP connection on a personal machine first:
```
claude mcp add --transport http adssassin https://mcp.adssassin.ai/mcp
```

## First run
Ask it to work on your Google Ads — "audit account 123-456-7890", "find wasted
spend and add negatives", or "write search ads for my landing page." The skill
takes over from there.
