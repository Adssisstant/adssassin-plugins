// Per-Slack-user OAuth to the Adssassin MCP (Clerk OAuth behind mcp.adssassin.ai).
//
// Each Slack user connects their OWN Adssassin account, so every MCP call runs
// against their own tenant and Google Ads account. Flow:
//   1. Bot DMs a one-time "Connect" link  → /connect?s=<state>
//   2. Confirmation page (shows which Slack user is being linked)
//   3. /connect/go → PKCE + redirect to the Adssassin (Clerk) authorize page
//   4. /oauth/adssassin/callback → exchange code, store tokens (encrypted)
//   5. getAccessToken() refreshes transparently before expiry

import { config, oauthCallbackUrl } from "./config.js";
import { store } from "./store.js";
import { encrypt, decrypt, randomToken, pkcePair } from "./crypto.js";

const CONNECT_TTL_MS = 15 * 60_000;
const mcpOrigin = new URL(config.adssassin.mcpUrl).origin;

let metadataCache = null;
async function authServerMetadata() {
  if (metadataCache) return metadataCache;
  const res = await fetch(`${mcpOrigin}/.well-known/oauth-authorization-server`);
  if (!res.ok) throw new Error(`OAuth metadata fetch failed: HTTP ${res.status}`);
  metadataCache = await res.json();
  return metadataCache;
}

/** The app's own OAuth client: env override, else Dynamic Client Registration (once). */
async function oauthClient() {
  if (config.adssassin.clientId) {
    return { client_id: config.adssassin.clientId, client_secret: config.adssassin.clientSecret || undefined };
  }
  const saved = await store.get("meta", "oauth_client");
  if (saved?.redirect_uri === oauthCallbackUrl) {
    return { client_id: saved.client_id, client_secret: saved.client_secret ? decrypt(saved.client_secret) : undefined };
  }
  const meta = await authServerMetadata();
  if (!meta.registration_endpoint) {
    throw new Error("Authorization server has no registration_endpoint; set ADSSASSIN_OAUTH_CLIENT_ID.");
  }
  const res = await fetch(meta.registration_endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_name: "Adssassin for Slack",
      redirect_uris: [oauthCallbackUrl],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "client_secret_post",
      scope: config.adssassin.scopes,
    }),
  });
  if (!res.ok) throw new Error(`Dynamic client registration failed: HTTP ${res.status} ${await res.text()}`);
  const reg = await res.json();
  await store.set("meta", "oauth_client", {
    client_id: reg.client_id,
    client_secret: reg.client_secret ? encrypt(reg.client_secret) : null,
    redirect_uri: oauthCallbackUrl,
    registeredAt: new Date().toISOString(),
  });
  console.log(`[oauth] registered OAuth client ${reg.client_id} via DCR`);
  return { client_id: reg.client_id, client_secret: reg.client_secret };
}

export const userKey = (teamId, userId) => `${teamId}:${userId}`;

/** Create a single-use connect link for one Slack user. */
export async function createConnectLink({ teamId, userId, channelId }) {
  const state = randomToken(24);
  await store.set("pending", state, {
    teamId,
    userId,
    channelId: channelId || null,
    expiresAt: new Date(Date.now() + CONNECT_TTL_MS),
  });
  return `${config.publicUrl}/connect?s=${encodeURIComponent(state)}`;
}

async function loadPending(state) {
  if (!state) return null;
  const p = await store.get("pending", state);
  if (!p || new Date(p.expiresAt).getTime() < Date.now()) return null;
  return p;
}

export async function describePending(state) {
  return loadPending(state);
}

/** Step 3: build the authorize URL (PKCE) for a pending state. */
export async function authorizeUrlFor(state) {
  const pending = await loadPending(state);
  if (!pending) return null;
  const meta = await authServerMetadata();
  const { client_id } = await oauthClient();
  const { verifier, challenge } = pkcePair();
  await store.set("pending", state, { ...pending, verifier: encrypt(verifier) });
  const u = new URL(meta.authorization_endpoint);
  u.search = new URLSearchParams({
    response_type: "code",
    client_id,
    redirect_uri: oauthCallbackUrl,
    scope: config.adssassin.scopes,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    resource: config.adssassin.mcpUrl,
  }).toString();
  return u.toString();
}

async function tokenRequest(params) {
  const meta = await authServerMetadata();
  const { client_id, client_secret } = await oauthClient();
  const body = new URLSearchParams({ ...params, client_id });
  if (client_secret) body.set("client_secret", client_secret);
  const res = await fetch(meta.token_endpoint, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Token endpoint error: HTTP ${res.status} ${json.error ?? ""}`);
  return json;
}

async function saveTokens(key, tok, previous) {
  const refresh = tok.refresh_token ?? (previous?.refresh ? decrypt(previous.refresh) : null);
  await store.set("users", key, {
    access: encrypt(tok.access_token),
    refresh: refresh ? encrypt(refresh) : null,
    expiresAt: tok.expires_in ? Date.now() + tok.expires_in * 1000 : null,
    connectedAt: previous?.connectedAt ?? new Date().toISOString(),
  });
}

/** Step 4: OAuth callback. Returns the pending record (team/user/channel) on success. */
export async function completeConnect({ state, code }) {
  const pending = await loadPending(state);
  if (!pending?.verifier) throw new Error("This connect link expired or was already used. Ask the bot for a new one.");
  await store.del("pending", state); // single use
  const tok = await tokenRequest({
    grant_type: "authorization_code",
    code,
    redirect_uri: oauthCallbackUrl,
    code_verifier: decrypt(pending.verifier),
    resource: config.adssassin.mcpUrl,
  });
  await saveTokens(userKey(pending.teamId, pending.userId), tok, null);
  return pending;
}

/** A valid access token for this Slack user, refreshing if needed; null if not connected. */
export async function getAccessToken(key) {
  const rec = await store.get("users", key);
  if (!rec) return null;
  const fresh = !rec.expiresAt || rec.expiresAt - Date.now() > 60_000;
  if (fresh) return decrypt(rec.access);
  if (!rec.refresh) return null;
  try {
    const tok = await tokenRequest({ grant_type: "refresh_token", refresh_token: decrypt(rec.refresh) });
    await saveTokens(key, tok, rec);
    return tok.access_token;
  } catch (err) {
    console.warn(`[oauth] refresh failed for ${key}: ${err.message}`);
    await store.del("users", key);
    return null;
  }
}

export async function disconnect(key) {
  await store.del("users", key);
}
