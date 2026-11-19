---
name: get-started
description: Connect a Google Ads account and run your first audit with Adssassin. Use when someone first installs the plugin, asks how to get started, or asks what Adssassin can do.
---

# Getting started with Adssassin

Adssassin connects your Google Ads account so you can audit it, find
wasted spend and make approved changes in conversation.

## First step: confirm the connection

Before anything else, check which account is connected:

> What Google Ads accounts can you see?

This calls `list_accounts` and returns the account name and its 10-digit
customer ID. Every later request runs against that account. If nothing is
returned, the workspace has not completed the Google Ads connection yet.

## Get oriented

Start with the account-level picture, then narrow:

> How did my account perform over the last 30 days?

Returns spend, clicks, conversions, CPA and ROAS. From there you can ask
for campaigns, ad groups, keywords, search terms, products, geography or
device breakdowns.

## Find the money being wasted

The highest-value first question for most accounts:

> Which search terms are wasting my budget?

Returns terms that cost money and did not convert, ranked by spend. The
usual next step is adding them as negative keywords.

## Making changes

Every write is previewed before it happens. Ask for a change and you get
a preview of exactly what will be modified; nothing is applied until you
confirm. This covers budgets, bids, bidding strategies, negative
keywords, campaign and ad status, and new campaigns or ads.

> Add 'free' as a negative keyword to my top spending campaign.

Review the preview, then confirm to apply.

## What is in scope

Google Ads only. Reporting and analysis, measurement and conversion
checks, change history, and account changes with approval. Requests
unrelated to Google Ads don't use Adssassin's tools.

## Access boundaries

A workspace can only reach the Google Ads accounts it has connected.
Requests for any other account are refused by the server, including
through raw query tools.
