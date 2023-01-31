const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Image } = require('../models/schema');
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
console.log(__dirname);
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
module.exports = {
  uploadSingleFile,
  uploadMulter,
  storeImage,
};
