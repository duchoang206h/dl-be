const NodeCache = require('node-cache');
const logger = require('../config/logger');
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120, useClones: false, maxKeys: 100 });
const { createClient } = require('redis');

// Create a Redis instance.
// By default, it will connect to localhost:6379.
// We are going to cover how to specify connection options soon.
const client = createClient({
  url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
const redisConnect = async () => {
  await client
    .connect()
    .then(() => console.log('connect to redis'))
    .catch(() => console.log());
};
const setCache = (key, data, ttl = 10 * 60) => {
  try {
    client.set(key, data, ttl);
  } catch (error) {}
};
const getCache = (key) => cache.get(key);
const hasKey = (key) => cache.has(key);
const clearCache = () => {
  cache.flushAll();
  logger.info('clear cache');
};
cache.on('set', function (key, _) {
  logger.info(`cache-key': ${key}`);
  logger.info(`cache-size': ${JSON.stringify(cache.getStats())}`);
});
cache.on('expired', function (key, _) {
  logger.info(`cache-key': ${key}`);
});
cache.on('flush', function () {
  logger.info(`clear cache`);
});
module.exports = {
  setCache,
  getCache,
  hasKey,
  clearCache,
  redisConnect,
};
