const httpStatus = require('http-status');
const { cacheService } = require('../services');

const cacheMiddleware = async (req, res, next) => {
  try {
    const key = req.originalUrl;
    if (key.includes('/images/')) return next();
    if (req.method !== 'GET' && req.method !== 'OPTIONS') await cacheService.clearCache();
    else {
      let result = null;
      const hasKey = await cacheService.hasKey(key);
      if (hasKey) {
        console.log(key.split('').reverse().join('').slice(0, 10));
        if (key.split('').reverse().join('').slice(0, 10) === '=eman?citsitats') {
          result = await cacheService.getCache(key);
          return res.status(httpStatus.OK).send({ result: result.result, lastUpdatedAt: result.lastUpdatedAt });
        }
        result = await cacheService.getCache(key);
        //console.log(result);
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
