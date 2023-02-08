const httpStatus = require('http-status');
const { cacheService } = require('../services');

const cacheMiddleware = async (req, res, next) => {
  try {
    const key = req.originalUrl;
    if (key.includes('/images/')) return next();
    if (key.includes('seed')) return next();
    if (key.includes('export')) return next();
    if (key.includes('livestream')) return next();
    if (req.method !== 'GET' && req.method !== 'OPTIONS') await cacheService.clearCache();
    else {
      let result = null;
      const hasKey = cacheService.hasKey(key);
      if (hasKey) {
        if (key.split('').reverse().join('').slice(0, 10) === '=eman?citsitats') {
          result = cacheService.getCache(key);
          return res.status(httpStatus.OK).send({ result: result.result, lastUpdatedAt: result.lastUpdatedAt });
        }
        result = cacheService.getCache(key);
        return res.status(httpStatus.OK).send({ result });
      }
    }
    return next();
  } catch (error) {
    console.log(error);
    return next();
  }
};
module.exports = {
  cacheMiddleware,
};
