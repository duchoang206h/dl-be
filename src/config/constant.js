const Y2MATE_API = {
  GET_RESOLUTION_URL: 'https://www.y2mate.com/mates/analyzeV2/ajax',
  HEADERS: {
    authority: 'www.y2mate.com',
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    cookie:
      '_gid=GA1.2.30771428.1679648336; _gat_gtag_UA_84863187_21=1; _ga=GA1.1.1560280974.1679648336; _ga_K8CD7CY0TZ=GS1.1.1679648336.1.1.1679648344.0.0.0',
    origin: 'https://www.y2mate.com',
    referer: 'https://www.y2mate.com/vi/youtube/8AKfe0WuedE',
    'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
  },
  GET_LINK_URL: 'https://www.y2mate.com/mates/convertV2/index',
};
const SNAPSAVE_API = {
  GET_RESOLUTION_URL: 'https://snapsave.app/action.php',
  HEADERS: {
    authority: 'snapsave.app',
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryi6HWPBVg1XlASU5L',
    cookie: '_ga=GA1.2.580373680.1679648320; _gid=GA1.2.51546560.1679648320; _gat=1',
    origin: 'https://snapsave.app',
    referer: 'https://snapsave.app/vn',
    'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Mobile Safari/537.36',
  },
  GET_LINK_URL: 'https://snapsave.app/render.php',
};
const RESOURCES = {
  YOUTUBE: 'youtube',
  FACEBOOK: 'facebook',
  TIKTOK: 'tiktok',
  OTHER: 'other',
};
const YT4K_API = {
  GET_RESOLUTION_URL: 'https://youtube4kdownloader.com/en62/',
  HEADERS: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    Accept: '*/*',
    'Accept-Language': 'en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-type': 'application/x-www-form-urlencoded',
    Origin: 'https://youtube4kdownloader.com',
    Pragma: 'no-cache',
    Referer: 'https://youtube4kdownloader.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
  },

}
const MAX_RECORD_RETURN = 1000;
module.exports = {
  Y2MATE_API,
  SNAPSAVE_API,
  RESOURCES,
  MAX_RECORD_RETURN,
  YT4K_API
};
