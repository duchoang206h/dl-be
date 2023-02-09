const { default: axios } = require('axios');
const fs = require('fs');
const path = require('path');
const { COUNTRY } = require('../config/constant');
const delay = require('delay');
const downloadCountryImages = async () => {
  try {
    for (const country of COUNTRY) {
      await delay(100);
      const result = await axios.get(`https://countryflagsapi.com/png/${country.code.toLowerCase()}`, {
        responseType: 'stream',
      });

      result.data.pipe(
        fs.createWriteStream(path.join(__dirname, '../../data/images', `country_${country.code.toLowerCase()}.png`))
      );
    }
  } catch (error) {
    console.log(error);
  }
};
downloadCountryImages();
