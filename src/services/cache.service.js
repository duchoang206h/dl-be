const NodeCache = require('node-cache');
const logger = require('../config/logger');
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120, useClones: false, maxKeys: 100 });
const setCache = (key, data, ttl = 10 * 60) => {
  try {
    cache.set(key, data, ttl);
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
};
