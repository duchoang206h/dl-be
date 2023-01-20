const httpStatus = require('http-status');
const { ApiError } = require('../utils/ApiError');
const { User } = require('../models/schema');
const { hashPassword } = require('../utils/hash');

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
  return await User.create(cloneBody);
};

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByUsername,
};
