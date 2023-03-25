const { default: axios } = require("axios");
const { GenLinkService } = require("./genlink.service");
const { Y2MATE_API } = require("../../config/constant");
const { getYTImageUrl } = require("../../utils/common");
const { encryptAes } = require("../../utils/hash");

class Y2MateService extends GenLinkService {
    getResolutions = async (url) => {
        try {
            const { data } = await axios.post(Y2MATE_API.GET_RESOLUTION_URL, new URLSearchParams({
                'k_query': url,
                'k_page': 'Youtube',
                'hl': 'vi',
                'q_auto': '0'
            }), {
                headers: Y2MATE_API.HEADERS
            })
            const vid = data.vid
            const promises = []
            promises.push(Promise.all(Object.values(data.links.mp4).map(async v => {
                return {
                    type: v.f,
                    qualify: v.q,
                    size: v.size,
                    key: encryptAes(await this.getLinks({ key: v.k, vid }))
                }
            })))
            promises.push(Promise.all(Object.values(data.links.mp3).map(async v => {
                return {
                    type: v.f,
                    qualify: v.q,
                    size: v.size,
                    key: encryptAes(await this.getLinks({ key: v.k, vid }))
                }
            })))
            const [videos, audios] = await Promise.all(promises)
            console.log({
                title: data.title,
                image: getYTImageUrl(vid),
                audios,
                videos,
                status: true,
            });
            return {
                title: data.title,
                image: getYTImageUrl(vid),
                audios,
                videos,
                status: true,
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
    getLinks = async ({ key, vid }) => {
        try {
            const { data } = await axios.post(Y2MATE_API.GET_LINK_URL, new URLSearchParams({
                'vid': vid,
                'k': key
            }), {
                headers: Y2MATE_API.HEADERS
            })
            return data.dlink
        } catch (error) {
            return ''
        }
    }
}
module.exports = new Y2MateService()