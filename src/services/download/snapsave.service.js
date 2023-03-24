const { default: axios } = require("axios");
const { GenLinkService } = require("./genlink.service");
const { Y2MATE_API, SNAPSAVE_API } = require("../../config/constant");
const { getYTImageUrl } = require("../../utils/common");
const vm = require('vm');
class SnapsaveService extends GenLinkService {
    getResolutions = async (url) => {
        try {
            const { data } = await axios.post(SNAPSAVE_API.GET_RESOLUTION_URL, `------WebKitFormBoundaryi6HWPBVg1XlASU5L\r\nContent-Disposition: form-data; name="url"\r\n\r\n${url}\r\n------WebKitFormBoundaryi6HWPBVg1XlASU5L--\r\/`, {
                headers: SNAPSAVE_API.HEADERS
            })
            let code = data.replace('eval', '')
            const script = new vm.Script(code);
            code = script.runInThisContext({});
            console.log(code);
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
const snapsaveService = new SnapsaveService()
const main = async () => {
    await snapsaveService.getResolutions('https://fb.watch/jtbWnRi7RL/')
}
main()
//module.exports =