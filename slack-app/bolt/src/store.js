// Tiny key-value store with two backends:
//   - MongoDB (production) when MONGODB_URI is set
//   - a JSON file under DATA_DIR (local dev) otherwise
//
// Collections used by the app:
//   installations  Slack workspace installs (multi-workspace mode)
//   users          per-Slack-user Adssassin OAuth tokens (encrypted)
//   pending        short-lived OAuth "connect" states (single use)
//   meta           the app's own OAuth client registration
//   usage          per-user daily message counters

import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";

function fileStore() {
  const file = path.resolve(config.dataDir, "store.json");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    data = {};
  }
  const flush = () => {
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(data), { mode: 0o600 });
    fs.renameSync(tmp, file);
  };
  return {
    async get(coll, id) {
      return data[coll]?.[id] ?? null;
    },
    async set(coll, id, doc) {
      (data[coll] ??= {})[id] = doc;
      flush();
    },
    async del(coll, id) {
      if (data[coll]) delete data[coll][id];
      flush();
    },
    async incr(coll, id, field) {
      const doc = ((data[coll] ??= {})[id] ??= {});
      doc[field] = (doc[field] ?? 0) + 1;
      flush();
      return doc[field];
    },
  };
}

async function mongoStore() {
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(config.mongoUri);
  await client.connect();
  const db = client.db(config.mongoDb);
  const col = (name) => db.collection(`slack_${name}`);
  // Expire one-shot OAuth states and old usage counters automatically.
  await col("pending").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await col("usage").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  return {
    async get(coll, id) {
      const doc = await col(coll).findOne({ _id: id });
      if (!doc) return null;
      const { _id, ...rest } = doc;
      return rest;
    },
    async set(coll, id, doc) {
      await col(coll).replaceOne({ _id: id }, { ...doc }, { upsert: true });
    },
    async del(coll, id) {
      await col(coll).deleteOne({ _id: id });
    },
    async incr(coll, id, field) {
      const res = await col(coll).findOneAndUpdate(
        { _id: id },
        { $inc: { [field]: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + 3 * 86400_000) } },
        { upsert: true, returnDocument: "after" }
      );
      return res?.[field] ?? 1;
    },
  };
}

export const store = config.mongoUri ? await mongoStore() : fileStore();
