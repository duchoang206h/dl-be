const httpStatus = require('http-status');
const {
  SCORECARD_IMAGES,
  LEADERBOARD_IMAGES,
  HOLE_BOTTOM_IMAGES,
  HOLE_TOP_IMAGES,
  GOLFER_INFO_IMAGES,
  GOLFER_IN_HOLE_IMAGES,
  FLIGHT_INFOR_IMAGES,
  GROUP_RANK_IMAGES,
  LEADERBOARD_MINI_IMAGES,
} = require('../config/constant');
const catchAsync = require('../utils/catchAsync');
const { uploadMulter, uploadSingleFile, storeImage } = require('../services/upload.service');
const fs = require('fs');
const { Image } = require('../models/schema');

const getAllImages = catchAsync(async (req, res) => {
  const images = await Image.findAll({ where: { course_id: req.params.courseId } });
  const subImages = {
    SCORECARD_IMAGES: {
      ...SCORECARD_IMAGES,
    },
    LEADERBOARD_IMAGES: { ...LEADERBOARD_IMAGES },
    HOLE_BOTTOM_IMAGES: { ...HOLE_BOTTOM_IMAGES },
    HOLE_TOP_IMAGES: { ...HOLE_TOP_IMAGES },
    GOLFER_INFO_IMAGES: { ...GOLFER_INFO_IMAGES },
    GOLFER_IN_HOLE_IMAGES: { ...GOLFER_IN_HOLE_IMAGES },
    FLIGHT_INFOR_IMAGES: { ...FLIGHT_INFOR_IMAGES },
    GROUP_RANK_IMAGES: { ...GROUP_RANK_IMAGES },
    LEADERBOARD_MINI_IMAGES: { ...LEADERBOARD_MINI_IMAGES },
  };
  console.log(Object.keys(subImages.SCORECARD_IMAGES));
  Object.keys(subImages.SCORECARD_IMAGES).forEach((key) => {
    const img = images.find((img) => img.type == subImages.SCORECARD_IMAGES[key].type);
    subImages.SCORECARD_IMAGES[key].url = img ? img.url : null;
  });
  Object.keys(subImages.LEADERBOARD_IMAGES).forEach((key) => {
    const img = images.find((img) => img.type == subImages.LEADERBOARD_IMAGES[key].type);
    subImages.LEADERBOARD_IMAGES[key].url = img ? img.url : null;
  });
  Object.keys(subImages.HOLE_BOTTOM_IMAGES).forEach((key) => {
    const img = images.find((img) => img.type == subImages.HOLE_BOTTOM_IMAGES[key].type);
    subImages.HOLE_BOTTOM_IMAGES[key].url = img ? img.url : null;
  });
  Object.keys(subImages.HOLE_TOP_IMAGES).forEach((key) => {
    const img = images.find((img) => img.type == subImages.HOLE_TOP_IMAGES[key].type);

    subImages.HOLE_TOP_IMAGES[key].url = img ? img.url : null;
  });
  Object.keys(subImages.GOLFER_INFO_IMAGES).forEach((key) => {
    const img = images.find((img) => img.type == subImages.GOLFER_INFO_IMAGES[key].type);

    subImages.GOLFER_INFO_IMAGES[key].url = img ? img.url : null;
  });
  Object.keys(subImages.GOLFER_IN_HOLE_IMAGES).forEach((key) => {
    const img = images.find((img) => img.type == subImages.GOLFER_IN_HOLE_IMAGES[key].type);

    subImages.GOLFER_IN_HOLE_IMAGES[key].url = img ? img.url : null;
  });
  Object.keys(subImages.FLIGHT_INFOR_IMAGES).forEach((key) => {
    const img = images.find((img) => img.type == subImages.FLIGHT_INFOR_IMAGES[key].type);

    subImages.FLIGHT_INFOR_IMAGES[key].url = img ? img.url : null;
  });
  Object.keys(subImages.GROUP_RANK_IMAGES).forEach((key) => {
    const img = images.find((img) => img.type == subImages.GROUP_RANK_IMAGES[key].type);

    subImages.GROUP_RANK_IMAGES[key].url = img ? img.url : null;
  });
  Object.keys(subImages.LEADERBOARD_MINI_IMAGES).forEach((key) => {
    const img = images.find((img) => img.type == subImages.LEADERBOARD_MINI_IMAGES[key].type);

    subImages.LEADERBOARD_MINI_IMAGES[key].url = img ? img.url : null;
  });
  res.status(httpStatus.OK).send({
    result: subImages,
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
