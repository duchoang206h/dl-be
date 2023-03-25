const { Y2MATE_APIS, YT4K_API } = require('../../config/constant');
const delay = require('delay');
const puppeteer = require('puppeteer');
const { default: axios } = require('axios');
const { encryptAes } = require('../../utils/hash');
const { getFileSizeMB } = require('../../utils/common');
class YT4KService {
    getResolutions = async (link) => {
        try {
            let data = null;
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
            });
            const page = await browser.newPage();
            await page.setExtraHTTPHeaders(YT4K_API.HEADERS);
            await page.setRequestInterception(true);
            page.on('request', (request) => request.continue());
            await page.goto(YT4K_API.GET_RESOLUTION_URL);
            await delay(3000);
            await page.type('#video', link);
            await page.click(
                'body > div.main-wrapper > div.main-content > main > section.banner-area.search-area > div > div.formContainer > form > input.downloadBtn'
            );
            const response = await page.waitForResponse((response) => response.url().includes('getLinks.php'));
            const responseBody = await response.json();
            data = responseBody.data;
            await browser.close();
            const videos = data.av.map(v => {
                return {
                    key: encryptAes(v.url),
                    quality: v.quality,
                    size: getFileSizeMB(v.size),
                    type: v.ext
                }
            })
            const audios = data.a.map(a => {
                return {
                    key: encryptAes(a.url),
                    quality: a.quality,
                    size: getFileSizeMB(a.size),
                    type: a.ext
                }
            })
            return {
                audios,
                videos,
                title: data.title,
                image: data.thumbnail,
                status: true
            }
        } catch (error) {
            console.log(error);
            return {
                status: true,
            };
        }
    };
    getLinks = async (data) => {
        try {
            const { vid, k } = data;
            const { data } = await axios.post(
                Y2MATE_APIS.GET_LINK,
                new URLSearchParams({
                    vid,
                    k,
                }),
                {
                    headers: Y2MATE_APIS.HEADERS,
                }
            );
            return {
                status: true,
                link: data.dlink,
            };
        } catch (error) {
            return {
                status: false,
            };
        }
    };
}
const main = async () => {
    const y4 = new YT4KService()
    await y4.getResolutions('https://www.youtube.com/watch?v=QtmnqxjR2q0')
}
main()