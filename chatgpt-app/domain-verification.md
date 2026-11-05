# Domain verification for `adssassin.ai`

The submission requires proving you control the app's domain. The exact method
is set by the form — **last known: place a verification token at a specific path
on your domain** (some flows use a DNS TXT record instead). **[VERIFY]** which
one the current form asks for, then follow the matching section below. Both are
easy because `adssassin.ai` is the Next.js site on Vercel.

---

## Method A — token at a URL path (most likely)  ← scaffolded already
**A serving route is already in `adssassin-site`** at
`app/.well-known/openai-domain-verification.txt/route.ts`, serving
`https://adssassin.ai/.well-known/openai-domain-verification.txt`. To use it:
1. Set **`OPENAI_DOMAIN_VERIFICATION`** = the token OpenAI gives you, on the
   **adssassin-site** Vercel project.
2. Redeploy, then `curl` the URL to confirm the token is returned.
3. Click **Verify** in the form.
If OpenAI asks for a **different path/filename**, rename that route folder to
match. The rest of this section is the manual fallback.

OpenAI gives you a token string and a path (e.g. `/.well-known/openai-domain-verification.txt`
or a `/.well-known/...` JSON — use whatever the form specifies).

**Serve it from the Next.js site (`adssassin-site`):**
- Easiest: drop a static file in `public/` so it's served at the exact path.
  - e.g. `public/.well-known/openai-domain-verification.txt` → served at
    `https://adssassin.ai/.well-known/openai-domain-verification.txt`.
  - Paste OpenAI's token as the file's contents, commit, deploy.
- If the required path can't be a static file, add a route handler
  (`app/.well-known/<name>/route.ts`) that returns the token as `text/plain`.

Then confirm it's live:
```
curl https://adssassin.ai/.well-known/openai-domain-verification.txt
```
and click "Verify" in the form.

> Note: `adssassin.ai` already serves other `.well-known` content needs fine on
> Vercel; a static file under `public/.well-known/` is the least-effort route.

## Method B — DNS TXT record
If the form asks for DNS instead:
- In your DNS provider for `adssassin.ai`, add a **TXT** record with the host
  and value OpenAI gives you (often host `@` or a `_openai`-style subdomain).
- Wait for propagation (minutes to a couple hours), then click "Verify".

---

## Which domain to verify
Verify **`adssassin.ai`** (the brand/site). The MCP lives at the
`mcp.adssassin.ai` subdomain and the app at `app.adssassin.ai`, but the listing
and ownership are tied to the root brand domain. **[VERIFY]** whether the form
also wants the MCP host verified or allow-listed separately (the tool/domain
"justification" step may ask you to list the domains the app connects to — see
`mcp-conformance.md`).
