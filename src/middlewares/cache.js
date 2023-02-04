const httpStatus = require('http-status');
const { cacheService } = require('../services');

const cacheMiddleware = async (req, res, next) => {
  try {
    const key = req.originalUrl;
    if (key.includes('/images/')) return next();
    if (req.method !== 'GET') cacheService.clearCache();
    else {
      if (cacheService.hasKey(key)) return res.status(httpStatus.OK).send({ result: cacheService.getCache(key) });
    }
    return next();
  } catch (error) {
    return next();
  }
};
module.exports = {
  cacheMiddleware,
};
