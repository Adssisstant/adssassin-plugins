# Update 1.0.4: own-colour icon after the 1.1b rejection

1.0.3 ("Google Ads Agent by Adssassin", Google Ads logo icon) was rejected on 2026-11-25 for
**1.1b. Do not engage in misleading or copycat designs or impersonation.** The likeliest trigger is the
icon, which was Google's own Google Ads logo in Google's colours.

1.0.4 changes only the icon: `logo.png` and `composer-icon.png` are now the same A-shape redrawn in
Adssassin red (three shades) on white. Name, description, tools and test cases are unchanged from 1.0.3.

## Submit

1. Upload `adssassin-plugin-submission-1.0.4.zip` as a new version (or rebuild it:
   `cd chatgpt-app/plugin-bundle && zip -r -X ../adssassin-plugin-submission.zip plugin.json mcp.json skills assets`).
2. If the dashboard has its own icon upload, use `plugin-bundle/assets/logo.png`.
3. Paste the reviewer note below.

## Reviewer note

> Thanks for the review. Version 1.0.3 used the Google Ads logo as its icon. 1.0.4 replaces it with our own
> icon in Adssassin's brand colours, so the app no longer uses Google's logo or colours. The listing names
> its developer (Renew Enterprises LLC, the verified business on this account) and states that Adssassin is
> not affiliated with or endorsed by Google, and that Google Ads is a trademark of Google LLC. Nothing else
> has changed.

## If 1.1b is raised again

The other candidate is the name, which leads with "Google Ads". Resubmit with the approved 1.0.2 name,
**Adssassin AI for Google Ads** (`displayName` in `plugin-bundle/plugin.json`), keeping this icon. If that is
also rejected, go back to the 1.0.2 icon too (`git show 9e15366:chatgpt-app/plugin-bundle/assets/logo.png`).
