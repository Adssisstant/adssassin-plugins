# Update 1.0.7: developer name "Adssassin AI"

Contains everything in 1.0.6 plus:

- **Developer name `Adssassin AI`** (was Renew Enterprises LLC). Every top "google ads" result shows its
  brand as the developer, and the long legal name truncated our card ("Audit & manage Google…"). The long
  description now says "Adssassin AI is owned and operated by Renew Enterprises LLC", matching
  adssassin.ai's privacy page, terms and footer.
- **Display removed** from the campaign types listed: the builder supports Search, Shopping and
  Performance Max.

If 1.0.6 hasn't been submitted yet, submit 1.0.7 only. Note the trade-off: if the reviewer rejects the
developer name, the 1.0.6 listing changes wait with it. To keep them independent, submit 1.0.6 first and
1.0.7 once it's approved.

## In the dashboard

1. Upload `adssassin-plugin-submission-1.0.7.zip`.
2. If the form has its own developer or publisher name field, set it to **Adssassin AI**. If it only offers
   the verified business name, the plugin.json value may be overridden; tell us what the form shows.
3. Same MCP card rename as 1.0.6 if not done yet (**Adssassin Google Ads Agent**, red icon).
4. Reviewer note:

> This version changes the developer name shown on the listing to "Adssassin AI", the product name. Adssassin
> AI is owned and operated by Renew Enterprises LLC, the business verified on this account; this is stated in
> the listing description and on adssassin.ai (privacy policy, terms and site footer). The version also
> corrects the list of campaign types the app can create. Tools and behaviour are unchanged.

## If the developer name is rejected

Resubmit with `developerName` and `author.name` set to `Adssassin AI (Renew Enterprises LLC)` (the format
Loopthink uses: "Loopthink (TechnologyCircle GmbH)"). If that's also rejected, go back to
`Renew Enterprises LLC` and register "Adssassin AI" as an assumed name (DBA) for Renew Enterprises LLC, then
verify it in the OpenAI Platform.
