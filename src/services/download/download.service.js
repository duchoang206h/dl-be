const { RESOURCES } = require("../../config/constant");
const { getContentType } = require("../../utils/common");
const snapsaveService = require("./snapsave.service");
const y2mateService = require("./y2mate.service");
const { default: axios } = require('axios');


class DownloadService {
    getResolutions = async (url) => {
        const type = getContentType(url);
        switch (type) {
            case RESOURCES.YOUTUBE:
                return y2mateService.getResolutions(url);
            case RESOURCES.FACEBOOK:
                return snapsaveService.getResolutions(url);
            case RESOURCES.TIKTOK:
                return snapsaveService.getResolutions(url);
            default:
                return
        }
    }
    downloadFile = async (data, res) => {
        const { url, type } = data
        return axios({
            url,
            method: 'GET',
            responseType: 'stream',
        }).then((response) => {
            // Detect the file type based on the response data
            res.set('Content-Disposition', "attachment; filename=" + 'download.' + type.replace('.', ''));
            // Pipe the response data to the response object
            response.data.pipe(res);
        });
    }
}
module.exports = new DownloadService()