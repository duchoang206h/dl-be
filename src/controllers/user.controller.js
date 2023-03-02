const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { ROLE } = require('../config/constant');
const { User, Player } = require('../models/schema');
const { USER_EXIST } = require('../utils/errorMessage');
const path = require('path');
const fs = require('fs');
const createUser = catchAsync(async (req, res) => {
  const existUser = await User.count({ where: { username: req.body.username } });
  if (existUser) return res.status(httpStatus.BAD_REQUEST).send({ message: USER_EXIST });
  const createData = { ...req.body, is_super: false, role: ROLE.COURSE_USER, course_id: req.params.courseId };
  const user = await userService.createUser(createData);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});
const getCaddieAccount = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const filePath = path.join(__dirname, '..', '..', `/data/course_${courseId}_caddies.xlsx`);
  if (!fs.existsSync(filePath)) {
    const players = await Player.findAll({ where: { course_id: courseId }, raw: true });
    await userService.genCaddyUsers(players, courseId);
  }
  res.download(filePath, 'caddie_account.xlsx');
});
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getCaddieAccount,
};
