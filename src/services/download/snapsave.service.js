const { default: axios } = require("axios");
const _ = require('lodash')
const { GenLinkService } = require("./genlink.service");
const { Y2MATE_API, SNAPSAVE_API } = require("../../config/constant");
const { getYTImageUrl } = require("../../utils/common");
const vm = require('vm');
const { encryptAes } = require("../../utils/hash");
const getResolutionRegex = /\d{3,4}p/g;
const getImageUrlRegex = /https:\/\/scontent[a-zA-Z0-9.\-\/\_\?\=\&]*/g;
const getRenderLinkRegex = /render.php\?token[=a-zA-Z0-9\.\-\_]+/g
const getLinkRegex = /https:\/\/video[\-a-zA-Z0-9\.\/\_\?\=\&]+/g
class SnapsaveService extends GenLinkService {
    getResolutions = async (url) => {
        try {
            const { data } = await axios.post(SNAPSAVE_API.GET_RESOLUTION_URL, `------WebKitFormBoundaryi6HWPBVg1XlASU5L\r\nContent-Disposition: form-data; name="url"\r\n\r\n${url}\r\n------WebKitFormBoundaryi6HWPBVg1XlASU5L--\r\/`, {
                headers: SNAPSAVE_API.HEADERS
            })
            let code = data.replace('eval', '')
            const script = new vm.Script(code);
            code = script.runInThisContext({});
            const resolutions = code.match(getResolutionRegex);
            const image = code.match(getImageUrlRegex) && code.match(getImageUrlRegex)[0];
            const links = _.uniq(code.match(getLinkRegex))
            const renderLinks = _.uniq(code.match(getRenderLinkRegex))
            const videos = links.map(l => {
                return {
                    type: 'mp4',
                    size: null,
                    quality: resolutions.shift(),
                    key: encodeURI(encryptAes(l))
                }
            })
            const renderVideos = await Promise.all(renderLinks.map(async l => {
                return {
                    type: 'mp4',
                    size: null,
                    quality: resolutions.shift(),
                    key: encodeURI(encryptAes(await this.getLinks({ token: l.replace('render.php?token=', '') })))
                }
            }))
            videos.push(...renderVideos)
            console.log(videos);
            return {
                status: true,
                videos,
                title: '',
                image,
                audios: []
            }
        } catch (error) {
            console.log(error);
            return {
                status: false,
                audios: [],
                videos: [],
                title: '',
                image: ''
            }
        }
    }
    getLinks = async ({ token }) => {
        try {
            const { data } = await axios.get(SNAPSAVE_API.GET_LINK_URL, {
                params: {
                    token
                },
                headers: Y2MATE_API.HEADERS
            })
            return data?.data?.file_path
        } catch (error) {
            return ''
        }
    }
}
module.exports = new SnapsaveService()