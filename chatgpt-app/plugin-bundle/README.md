# ChatGPT plugin bundle (source of the submission ZIP)

These files are the contents of the ZIP uploaded in the OpenAI dashboard. To rebuild it, zip the files
in this folder (not the folder itself), leaving out this README:

```
cd chatgpt-app/plugin-bundle && zip -r -X ../adssassin-plugin-submission.zip plugin.json mcp.json skills assets
```

v1.0.8: links only. `homepage` is the documentation page (https://adssassin.ai/docs) and `supportURL` the
support page (https://adssassin.ai/support). See ../update-1.0.8.md.
v1.0.7: developer name "Adssassin AI" (owned by Renew Enterprises LLC, stated in the description and on
adssassin.ai); Display removed from the campaign types claimed (Search, Shopping and Performance Max are the
supported builds). See ../update-1.0.7.md.
v1.0.6: listing rewritten for directory search (see ../update-1.0.6.md): long description with headed
sections covering everything the tools do, 12 specific capabilities, category Business & Operations, an
audit-first starter prompt, and the four skills from the Claude plugin (audit, wasted-spend sweep, Search
campaign build, RSA copywriter) alongside get-started.
v1.0.5: our own mark in Adssassin red (#E0524A) on white: two rounded strokes forming an "A", replacing
the 1.0.4 red version of the Google Ads shape. (An earlier near-black version is kept in
../assets/adssassin-mark-dark-512.png.)
v1.0.4: icon redrawn in Adssassin red on white (1.0.3 used Google's own Google Ads logo and was rejected
under 1.1b, misleading/copycat designs or impersonation). See ../update-1.0.4.md.
v1.0.3: name "Google Ads Agent by Adssassin"; "Google Ads is a trademark of Google LLC." added to the
long description; icon is the Google Ads logo mark. See ../update-1.0.3.md.
v1.0.2: Adssassin icon instead of the Google Ads logo, 25-character subtitle.
v1.0.1 (2026-11-19, after the first rejection): name "Adssassin AI for Google Ads", developer Renew
Enterprises LLC, no ChatGPT/OpenAI mentions in the copy, neutral commerce note. See ../resubmission.md.
