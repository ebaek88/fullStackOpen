const redis = require("redis");
// const { promisify } = require("util");
// since Redis v4, promisify is no longer needed since client.get() and client.set() themselves return Promise
const { REDIS_URL } = require("../util/config");

let client;

async function connectRedis() {
  if (!REDIS_URL) {
    console.log("No REDIS_URL set, Redis is disabled");
    return null;
  }

  client = redis.createClient({ url: REDIS_URL });

  client.on("error", (err) => console.error("Redis Client Error:", err));

  await client.connect();
  console.log("Connected to Redis");

  const existingValue = await client.get("added_todos");
  if (existingValue === null) {
    await client.set("added_todos", 0);
  }

  return client;
}

connectRedis();

module.exports = {
  getAsync: async (key) => {
    if (!client) return null;
    return await client.get(key);
  },
  setAsync: async (key, value) => {
    if (!client) return null;
    return await client.set(key, value);
  },
};
