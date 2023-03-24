const Y2MATE_API = {
  GET_RESOLUTION_URL: 'https://www.y2mate.com/mates/analyzeV2/ajax',
  HEADERS: {
    'authority': 'www.y2mate.com',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'cookie': '_gid=GA1.2.30771428.1679648336; _gat_gtag_UA_84863187_21=1; _ga=GA1.1.1560280974.1679648336; _ga_K8CD7CY0TZ=GS1.1.1679648336.1.1.1679648344.0.0.0',
    'origin': 'https://www.y2mate.com',
    'referer': 'https://www.y2mate.com/vi/youtube/8AKfe0WuedE',
    'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest'
  },
  GET_LINK_URL: 'https://www.y2mate.com/mates/convertV2/index',
}
const SNAPSAVE_API = {
  GET_RESOLUTION_URL: 'https://snapsave.app/action.php',
  HEADERS: {
    'authority': 'snapsave.app',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryi6HWPBVg1XlASU5L',
    'cookie': '_ga=GA1.2.580373680.1679648320; _gid=GA1.2.51546560.1679648320; _gat=1',
    'origin': 'https://snapsave.app',
    'referer': 'https://snapsave.app/vn',
    'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Mobile Safari/537.36'
  },
  GET_LINK_URL: ''
}
module.exports = {
  Y2MATE_API,
  SNAPSAVE_API
}