const NodeCache = require('node-cache');
const logger = require('../config/logger');
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120, useClones: false, maxKeys: 100 });
const { createClient } = require('redis');

// Create a Redis instance.
// By default, it will connect to localhost:6379.
// We are going to cover how to specify connection options soon.
/* const client = createClient({
  url: `redis://@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  database: 0,
}); */
/* const redisConnect = async () => {
  await client
    .connect()
    .then(() => console.log('connect to redis'))
    .catch((error) => console.log(error));
}; */
const setCache = async (key, data, ttl = 10 * 60) => {
  try {
    logger.info(`cache-set-key': ${key}`);
    cache.set(key, data, ttl);
  } catch (error) {
    console.log(error);
  }
};
const getCache = async (key) => {
  try {
    logger.info(`cache-get-key': ${key}`);
    return cache.get(key);
  } catch (error) {
    console.log(error);
    return null;
  }
};
const hasKey = async (key) => {
  try {
    return cache.has(key);
  } catch (error) {
    console.log(error);
  }
};
const clearCache = async () => {
  await cache.flushAll();
  logger.info('clear cache');
};
/* client.on('set', function (key, _) {
  logger.info(`cache-key': ${key}`);
  logger.info(`cache-size': ${JSON.stringify(cache.getStats())}`);
});
client.on('message', function (key) {
  logger.info(`cache-key': ${key}`);
  logger.info(`cache-size': ${JSON.stringify(cache.getStats())}`);
});
client.on('get', function (key) {
  logger.info(`cache-key': ${key}`);
  logger.info(`cache-size': ${JSON.stringify(cache.getStats())}`);
});
client.on('expired', function (key, _) {
  logger.info(`cache-key': ${key}`);
});
client.on('flush', function () {
  logger.info(`clear cache`);
});
client.on('get', function () {
  logger.info(`clear hit`);
}); */
module.exports = {
  setCache,
  getCache,
  hasKey,
  clearCache,
};
