const { BaseService } = require("./base.service");
const { Content } = require('../models/schema/Content');
const { getContentType } = require("../utils/common");
const { RESOURCES } = require("../config/constant");
const downloadService = require("./download/download.service");
const { decryptAes } = require("../utils/hash");
class ContentService extends BaseService {
    constructor() {
        super(Content)
    }
    getContentDownloadUrl = async (url) => {
        return downloadService.getResolutions(url)
    }
    downloadContent = async ({ key, type }, res) => {
        console.log({ key });

        console.log({ url: decryptAes(key) });
        const url = decryptAes(key)
        return downloadService.downloadFile({ url, type }, res)
    }
}
module.exports = new ContentService()