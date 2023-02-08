const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120, useClones: false, maxKeys: 100 });
const { createClient } = require('redis');
const client = createClient({
  url: `redis://@42.96.43.9:6379`,
  database: 0,
});
const redisConnect = async () => {
  await client
    .connect()
    .then(() => console.log('connect to redis'))
    .catch((error) => console.log(error));
};
const setCache = async (key, data, ttl = 10 * 60) => {
  try {
    await client.set(key, JSON.stringify(data), { EX: ttl });
  } catch (error) {
    console.log(error);
  }
};
const getCache = async (key) => {
  try {
    const data = await client.get(key);
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};
const hasKey = async (key) => {
  try {
    return await client.exists(key);
  } catch (error) {
    return false;
    console.log(error);
  }
};
const clearCache = async () => {
  await client.flushAll();
  logger.info('clear cache');
};
async function main() {
  try {
    await redisConnect();
    await setCache('test', JSON.stringify({ aa: 'aa' }));
    console.log(await getCache('test'));
  } catch (error) {
    console.log(error);
  }
}
main();
