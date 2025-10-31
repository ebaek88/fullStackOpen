const redis = require("redis");
// const { promisify } = require("util");
const { REDIS_URL } = require("../util/config");
const { Todo } = require("../mongo");

// let getAsync;
// let setAsync;

// if (!REDIS_URL) {
//   const redisIsDisabled = () => {
//     console.log("No REDIS_URL set, Redis is disabled");
//     return null;
//   };
//   getAsync = redisIsDisabled;
//   setAsync = redisIsDisabled;
// } else {
//   const client = redis.createClient({
//     url: REDIS_URL,
//   });

//   client.on("connect", async () => {
//     console.log("Connected to Redis");

//     const getAsyncTemp = promisify(client.get).bind(client);
//     const setAsyncTemp = promisify(client.set).bind(client);

//     const existingValue = await getAsyncTemp("added_todos");
//     if (existingValue === null) {
//       const todos = await Todo.find({});
//       await setAsyncTemp("added_todos", todos.length);
//     }
//   });

//   client.on("error", (error) => console.error("Redis error", error));

//   getAsync = promisify(client.get).bind(client);
//   setAsync = promisify(client.set).bind(client);
// }

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
    const todos = await Todo.find({});
    await client.set("added_todos", todos.length);
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
