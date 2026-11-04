# Adssassin — distribution

Everything to put Adssassin into people's own **Claude, ChatGPT, and Gemini**.
The engine is a hosted, OAuth-authenticated MCP server
(`https://mcp.adssassin.ai/mcp`); users connect it, sign in, connect their
Google Ads account, and work — on the free tier or a paid plan.

## Layout
```
.claude-plugin/marketplace.json          Claude plugin marketplace (this repo)
plugins/adssassin-google-ads/            the Claude plugin: MCP + skills
project-instructions.md                  the custom-instructions block to paste
specs/chatgpt-gpt.md                     build the ChatGPT custom GPT
specs/gemini-gem.md                      build the Gemini Gem
```

## Claude — the plugin (one install)
```
/plugin marketplace add Adssisstant/adssassin-plugins
/plugin install adssassin-google-ads@adssassin
```
Gives Claude the MCP connection **and** the four skills together. See
`plugins/adssassin-google-ads/README.md`.

## ChatGPT & Gemini — build once, share the link
- `specs/chatgpt-gpt.md` — exact fields for a custom GPT. Publish it, then set
  `NEXT_PUBLIC_CHATGPT_GPT_URL` on the app for a one-click button on `/free`.
- `specs/gemini-gem.md` — the Gem. Set `NEXT_PUBLIC_GEMINI_GEM_URL` likewise.

## The instruction block
`project-instructions.md` is the portable custom-instructions block — the same
text goes in a Claude Project, a custom GPT, or a Gem. The specs inline it so
each is self-contained.

## Notes
- Plugin/marketplace manifests are verified against the current Claude Code docs
  (code.claude.com/docs/en/plugins). Re-validate with `claude plugin validate`
  before publishing, and verify the ChatGPT/Gemini connector flows — those move
  fast. The MCP URL + OAuth are the stable parts everywhere.
- Make this repo **public** when you're ready for users to
  `/plugin marketplace add` it.
