const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { contentService } = require('../services');
const { decodeUri } = require('../utils/hash');
const getContentResolutions = catchAsync(async (req, res) => {
    const { url } = req.query;
    const result = await contentService.getContentDownloadUrl(decodeUri(url));
    return res.status(httpStatus.OK).json({ result })
})
const downloadContent = catchAsync(async (req, res) => {
    const { key, type } = req.query;
    return contentService.downloadContent({ key, type }, res)
})
module.exports = { getContentResolutions, downloadContent }