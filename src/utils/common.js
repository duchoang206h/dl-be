const { RESOURCES, MAX_RECORD_RETURN } = require('../config/constant');

const getLimitRecordReturn = (limit) => {
  return limit > MAX_RECORD_RETURN ? MAX_RECORD_RETURN : limit;
};
const getYTImageUrl = (vid) => {
  return `https://i.ytimg.com/vi/${vid}/0.jpg`;
};
const getContentType = (url) => {
  let type;
  switch (true) {
    case url.includes('yt') || url.includes('youtube'):
      type = RESOURCES.YOUTUBE;
      break;
    case url.includes('fb') || url.includes('facebook'):
      type = RESOURCES.FACEBOOK;
      break;
    case url.includes('tiktok'):
      type = RESOURCES.TIKTOK;
      break;
    default:
      type = RESOURCES.OTHER;
      break;
  }
  return type;
};
const getFileSizeMB = (bytes) => (!isNaN(bytes) ? Number(bytes) * 10e-6 : 0);
module.exports = {
  getLimitRecordReturn,
  getYTImageUrl,
  getContentType,
  getFileSizeMB
};
