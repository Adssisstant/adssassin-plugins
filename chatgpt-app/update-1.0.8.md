# Update 1.0.8: in-chat cards, documentation and support links

1.0.7 was approved and is listed publicly. 1.0.8 adds:

1. **In-chat cards** (server side, adssassin-google-ads-mcp #210 to #214), turned on with
   `MCP_UI_CARDS=on`. Three new read-only tools and an approval card on every change:
   - `connect_google_ads`: connection status card. Not connected: a button that opens Google's sign-in
     in a new tab through ChatGPT's own link opener (`openExternal`) rather than a plain link, then re-checks
     on its own and lists the ad accounts once connected. Check in testing that a pop-up blocker doesn't stop it.
   - `review_negative_keywords`: the proposed negatives with what each search term cost. The user unticks
     any to keep, previews, then approves; the card calls `add_negative_keywords_bulk`.
   - `show_audit_summary`: the audit as a scorecard, findings in priority order.
   - Every change tool's preview appears on a review card with an Approve button.
2. **Links** in `plugin.json`:

   | Field | 1.0.7 | 1.0.8 |
   |---|---|---|
   | `homepage` | `https://adssassin.ai` | `https://adssassin.ai/docs` |
   | `interface.supportURL` | `https://adssassin.ai` | `https://adssassin.ai/support` |

3. **Review test cases** for the three card tools, and the write test now expects the review card.
4. **Listing copy**: the subtitle (`shortDescription`) changes from "Audit & manage Google Ads" to
   **"AI Audit & Fix Google Ads"**, and the long description now opens "Google Ads Agent by Adssassin is an AI agent
   for Google Ads." The name stays "Google Ads Agent by Adssassin": "Google Ads AI Agent by Adssassin" is 32
   characters and the form caps names at 30. If the reviewer rejects the subtitle, go back to
   "Audit & manage Google Ads", which is approved.

Also live on the server (no bundle change): the MCP display title is "Google Ads Agent by Adssassin", and
a user who hasn't connected Google Ads gets the connect link as the first reply.

## Build the ZIP

```
cd chatgpt-app/plugin-bundle && zip -r -X ../adssassin-plugin-submission-1.0.8.zip plugin.json mcp.json skills assets
```

## Steps

1. **Railway**: on the service that serves mcp.adssassin.ai, add the variable `MCP_UI_CARDS` = `on` and
   let it redeploy. Check https://mcp.adssassin.ai/health: `"tools"` goes from 45 to **48**.
2. **OpenAI dashboard → MCPs tab → the MCP card → Rescan.** The tool list should now include
   `connect_google_ads`, `review_negative_keywords` and `show_audit_summary`. The card's name and icon
   should update too (see "The MCP card" below).
3. Upload `adssassin-plugin-submission-1.0.8.zip` as a new version.
4. If the form has a **Documentation** field, set it to `https://adssassin.ai/docs`. Set **Support** to
   `https://adssassin.ai/support` if it has its own field.
5. Reviewer note:

> This version adds in-chat cards, updates the subtitle to "AI Audit & Fix Google Ads" and the first line of the
> description, and updates two listing links. Three new read-only tools render cards: a
> Google Ads connection status card, a review card for proposed negative keywords (the user picks which to
> add, then previews and approves), and an audit scorecard. Every change's preview now appears on a review
> card with an Approve button; nothing is applied until the user approves. The homepage now points to the
> documentation (adssassin.ai/docs) and the support link to adssassin.ai/support. The MCP server's display
> title now matches the listing name, "Google Ads Agent by Adssassin". Existing tools and test cases are
> unchanged apart from the write test, which now shows the review card.

ChatGPT may keep using the tool list it reviewed for 1.0.7 until 1.0.8 is approved, so expect the cards
there after approval. Claude reads the tool list live and should show them once step 1 deploys.

## The MCP card ("Adssassin AI for Google Ads", black "A")

The card on the MCPs tab still shows the name and icon it got when the MCP was first configured in 1.0.1.
The dashboard has no rename control. The server publishes its own display identity in `serverInfo`
(adssassin-google-ads-mcp #208, #209, #215): title **Google Ads Agent by Adssassin**, a one-line
description, `websiteUrl` https://adssassin.ai and the red Adssassin mark at
https://mcp.adssassin.ai/brand/icon.png.

1. Click **Rescan** on the card. If the name and icon update, done.
2. If not, click **Reconnect** (re-runs the OAuth handshake and `initialize`), then **Rescan** again.
3. If it still shows the old name, the card is stored on OpenAI's side. Ask OpenAI support (Help in
   the platform) to refresh the MCP display name and icon from `serverInfo` for plugin
   `plugin_asdk_app_6aecdfa4c0148191b016199246fd6698`.
