// Central env config. Everything secret comes from the environment — never commit
// real values. See ../.env.example for the full list.

function req(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var ${name} (see .env.example)`);
  return v;
}

function num(name, fallback) {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

export const config = {
  port: num("PORT", 3000),
  // Public HTTPS origin this app is reachable at, e.g. https://slack.adssassin.ai
  publicUrl: req("PUBLIC_URL").replace(/\/+$/, ""),

  slack: {
    signingSecret: req("SLACK_SIGNING_SECRET"),
    // Multi-workspace (Marketplace) mode: set client id/secret/state secret.
    clientId: process.env.SLACK_CLIENT_ID || "",
    clientSecret: process.env.SLACK_CLIENT_SECRET || "",
    stateSecret: process.env.SLACK_STATE_SECRET || "",
    // Single-workspace mode (your own test workspace): set the bot token only.
    botToken: process.env.SLACK_BOT_TOKEN || "",
  },

  anthropic: {
    // The SDK reads ANTHROPIC_API_KEY itself; we only check it is present.
    apiKey: req("ANTHROPIC_API_KEY"),
    model: process.env.ANTHROPIC_MODEL || "claude-opus-5-5",
    effort: process.env.ANTHROPIC_EFFORT || "medium",
  },

  adssassin: {
    mcpUrl: process.env.ADSSASSIN_MCP_URL || "https://mcp.adssassin.ai/mcp",
    // Optional: a pre-registered OAuth client. When unset, the app registers
    // itself once via Dynamic Client Registration and remembers the result.
    clientId: process.env.ADSSASSIN_OAUTH_CLIENT_ID || "",
    clientSecret: process.env.ADSSASSIN_OAUTH_CLIENT_SECRET || "",
    scopes: process.env.ADSSASSIN_OAUTH_SCOPES || "profile email",
  },

  // 32-byte key (64 hex chars) used to encrypt stored OAuth tokens at rest.
  tokenEncryptionKey: req("TOKEN_ENCRYPTION_KEY"),

  // Storage: MongoDB when MONGODB_URI is set, otherwise a local JSON file.
  mongoUri: process.env.MONGODB_URI || "",
  mongoDb: process.env.MONGODB_DB || "adssassin_slack",
  dataDir: process.env.DATA_DIR || "./data",

  // Cost guard: Claude API calls are billed to you, not the Slack user.
  maxMessagesPerUserPerDay: num("MAX_MESSAGES_PER_USER_PER_DAY", 50),
};

export const multiWorkspace = Boolean(
  config.slack.clientId && config.slack.clientSecret && config.slack.stateSecret
);

if (!multiWorkspace && !config.slack.botToken) {
  throw new Error(
    "Set SLACK_BOT_TOKEN (single workspace) or SLACK_CLIENT_ID + SLACK_CLIENT_SECRET + SLACK_STATE_SECRET (multi-workspace)."
  );
}

export const oauthCallbackUrl = `${config.publicUrl}/oauth/adssassin/callback`;
