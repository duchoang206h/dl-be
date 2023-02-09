const AWS = require('aws-sdk');
const multer = require('multer');
const { default: axios } = require('axios');
const fs = require('fs');
const { Image } = require('../models/schema');
const path = require('path');
const { COUNTRY } = require('../config/constant');
const delay = require('delay');
const s3 = new AWS.S3();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, folderImages);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});
const uploadMulter = multer({ storage });
const uploadSingleFile = async (file, type) => {
  const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + file.mimetype.replace('image/', '.');
  await fs.promises.writeFile(path.join(__dirname, '../../data/images', filename), file.buffer);
  return filename;
};
const storeImage = async ({ courseId, path, type }) => {
  const existImage = await Image.findOne({ where: { course_id: courseId, type } });
  if (existImage) {
    existImage.path = path;
    await existImage.save();
    return existImage;
  }
  return await Image.create({ course_id: courseId, path, type });
};
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
module.exports = {
  uploadSingleFile,
  uploadMulter,
  storeImage,
};
