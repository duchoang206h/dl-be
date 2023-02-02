const httpStatus = require('http-status');
const { SCORECARD_IMAGES, LEADERBOARD_IMAGES } = require('../config/constant');
const catchAsync = require('../utils/catchAsync');
const { uploadMulter, uploadSingleFile, storeImage } = require('../services/upload.service');
const fs = require('fs');
const { Image } = require('../models/schema');

const getAllImages = catchAsync(async (req, res) => {
  const images = await Image.findAll({ where: { course_id: req.params.courseId } });
  res.status(httpStatus.OK).send({
    result: {
      SCORECARD_IMAGES,
      LEADERBOARD_IMAGES,
    },
  });
});
const upload = catchAsync(async (req, res) => {
  console.log(req.files);
  if (req.files.length <= 0) return res.status(httpStatus.BAD_REQUEST).send();
  const path = await uploadSingleFile(req.files[0], req.body.type);
  const images = await storeImage({ courseId: req.params.courseId, path, type: req.body.type });
  return res.status(httpStatus.CREATED).send({ result: images });
});
module.exports = {
  getAllImages,
  upload,
};
