# Update 1.0.3: rename to "Google Ads Agent by Adssassin"

Three things change: the name, one line of the description, and the icon (`logo.png` and `composer-icon.png`
are now the Google Ads logo mark). The MCP server, tools, annotations, test cases and demo video are the same
as the approved 1.0.2.

## What to do in the OpenAI dashboard

1. Rebuild the ZIP (or use the one already built for you):
   ```
   cd chatgpt-app/plugin-bundle && zip -r -X ../adssassin-plugin-submission.zip plugin.json mcp.json skills assets
   ```
2. Open the published app, start a new version, and upload the ZIP.
3. If the form has its own name field, set it to **Google Ads Agent by Adssassin**.
4. If the form has its own long-description field, end it with:
   `Adssassin is not affiliated with or endorsed by Google. Google Ads is a trademark of Google LLC.`
5. Paste the reviewer note below into the version notes, then submit.

The approved 1.0.2 listing stays live while 1.0.3 is in review.

## Reviewer note (paste into the version notes)

> This update changes the app's display name, from "Adssassin AI for Google Ads" to "Google Ads Agent by
> Adssassin", so users searching the directory see what the app works with first, and updates the icon to
> show the Google Ads product it connects to. The name says who makes
> it ("by Adssassin", a product of Renew Enterprises LLC, the verified business on this account), and the
> description states that Adssassin is not affiliated with or endorsed by Google and that Google Ads is a
> trademark of Google LLC. The tools, annotations, behaviour, test cases and demo are unchanged from the
> approved version.

## If it's rejected for the name or icon

Submit again with what 1.0.2 shipped: the name **Adssassin AI for Google Ads** (`displayName` in
`plugin-bundle/plugin.json`) and/or the Adssassin icon (`git show 9e15366:chatgpt-app/plugin-bundle/assets/logo.png`,
same for `composer-icon.png`). Bump the version and rebuild the ZIP. Nothing else needs to change.
