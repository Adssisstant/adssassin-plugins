# Update 1.0.8: documentation and support links

1.0.7 was approved and is listed publicly. 1.0.8 changes two links and nothing else:

| Field | 1.0.7 | 1.0.8 |
|---|---|---|
| `homepage` | `https://adssassin.ai` | `https://adssassin.ai/docs` |
| `extensions.com.openai.interface.supportURL` | `https://adssassin.ai` | `https://adssassin.ai/support` |

`/docs` is the public documentation page: setup in each AI, connecting Google Ads, the tool list, how
changes are approved, plan limits, data handling, and an OAuth/endpoint reference for IT admins. `/support`
is the support page (contact, response time, billing, data requests).

Tools, server, skills, test cases and listing copy are unchanged.

## Build the ZIP

```
cd chatgpt-app/plugin-bundle && zip -r -X ../adssassin-plugin-submission-1.0.8.zip plugin.json mcp.json skills assets
```

## In the OpenAI dashboard

1. **MCPs tab → the MCP card → Rescan** before uploading (see "The MCP card" below).
2. Upload `adssassin-plugin-submission-1.0.8.zip` as a new version.
3. If the form has a **Documentation** field, set it to `https://adssassin.ai/docs`. Set **Support** to
   `https://adssassin.ai/support` if it has its own field.
4. Reviewer note:

> This version updates two listing links: the homepage now points to the app's documentation
> (adssassin.ai/docs) and the support link to its support page (adssassin.ai/support). The MCP server's
> display title now matches the listing name, "Google Ads Agent by Adssassin". Tools, annotations, skills
> and test cases are unchanged.

If the Rescan in step 1 showed new tools (`connect_google_ads`, `review_negative_keywords`,
`show_audit_summary`, the in-chat cards, which exist only when `MCP_UI_CARDS` is on in production), the
tools did change. In that case use this note instead:

> This version updates two listing links (homepage to adssassin.ai/docs, support to adssassin.ai/support)
> and adds three read-only tools that render in-chat cards: a Google Ads connection status card, a review
> card for proposed negative keywords, and an audit scorecard. Changes still apply only after the user
> confirms. The MCP server's display title now matches the listing name, "Google Ads Agent by Adssassin".
> Existing tools and test cases are unchanged.

## The MCP card ("Adssassin AI for Google Ads", black "A")

The card on the MCPs tab still shows the name and icon it got when the MCP was first configured in 1.0.1.
The dashboard has no rename control. The server now publishes its own display identity in `serverInfo`
(adssassin-google-ads-mcp #208, #209, and the follow-up that set the title): title
**Google Ads Agent by Adssassin**, matching the listing name, a one-line description,
`websiteUrl` https://adssassin.ai and the red Adssassin mark at
https://mcp.adssassin.ai/brand/icon.png. The card's last scan ran about when those shipped, so it may
predate them.

1. Click **Rescan** on the card. If the name and icon update, done.
2. If not, click **Reconnect** (re-runs the OAuth handshake and `initialize`), then **Rescan** again.
3. If it still shows the old name, the card is stored on OpenAI's side. Ask OpenAI support (Help in
   the platform) to refresh the MCP display name and icon from `serverInfo` for plugin
   `plugin_asdk_app_6aecdfa4c0148191b016199246fd6698`.
