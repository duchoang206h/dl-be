const httpStatus = require('http-status');
const { ApiError } = require('../utils/ApiError');
const { User, Player } = require('../models/schema');
const { hashPassword, randomString } = require('../utils/hash');
const { writeToXlsx } = require('./xlsxService');
const path = require('path');
const { ROLE } = require('../config/constant');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
/* const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
}; */

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
/* const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
}; */

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return await User.findByPk(id, { raw: true });
};

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
  return await User.findOne({ where: { username }, raw: true, attributes: { exclude: ['createdAt', 'updatedAt'] } });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};
const genCaddyUsers = async (players, courseId) => {
  //const players = await Player.findAll({ where: { course_id: courseId }, attributes: ['vga', 'fullname'], raw: true });
  const caddies = players.map((p) => {
    return {
      'name-golfer': p.fullname,
      caddie_username: `C_${courseId}_` + p.vga,
      password: randomString(8),
    };
  });
  const filePath = path.join(__dirname, '..', '..', '/data', `course_${courseId}_caddies.xlsx`);
  await writeToXlsx(caddies, filePath);
  const createCaddiesData = caddies.map((c) => {
    return {
      username: c.caddie_username,
      password: hashPassword(c.password),
      role: ROLE.CADDIE,
      course_id: courseId,
    };
  });
  await User.bulkCreate(createCaddiesData);
  return true;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};
const createUser = async (createBody) => {
  const cloneBody = { ...createBody, password: hashPassword(createBody.password) };
  const user = await User.create(cloneBody, { raw: true });
  user.password = null;
  return user;
};

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByUsername,
  genCaddyUsers,
};
