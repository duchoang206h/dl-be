const httpStatus = require('http-status');
const { ApiError } = require('../utils/ApiError');
const {
  User,
  Player,
  Round,
  MatchPlayVersus,
  TeeTime,
  TeeTimeGroup,
  TeeTimeGroupPlayer,
  sequelize,
} = require('../models/schema');
const { hashPassword, randomString } = require('../utils/hash');
const { writeToXlsx } = require('./xlsxService');
const path = require('path');
const { ROLE, CADDIE_ACCOUNT_TYPE, PLAYER_STATUS } = require('../config/constant');
const fs = require('fs');

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
const genCaddyUsers = async (players, courseId, type = CADDIE_ACCOUNT_TYPE.BELONG_TO_PLAYER) => {
  let t = await sequelize.transaction();
  try {
    if (type === CADDIE_ACCOUNT_TYPE.BY_PLAYER) {
      players = players ?? (await Player.findAll({ where: { course_id: courseId }, raw: true }));
      const caddies = players.map((p) => {
        return {
          'name-golfer': p.fullname,
          caddie_username: `C_${courseId}_` + p.vga,
          password: randomString(8),
        };
      });
      const filePath = path.join(__dirname, '..', '..', '/data', `course_${courseId}_caddies_${type}.xlsx`);
      await writeToXlsx(caddies, filePath);
      const createCaddiesData = caddies.map((c) => {
        return {
          username: c.caddie_username,
          password: hashPassword(c.password),
          role: ROLE.CADDIE,
          course_id: courseId,
          type: CADDIE_ACCOUNT_TYPE.BY_PLAYER,
        };
      });
      await User.bulkCreate(createCaddiesData);
      return true;
    } else if (type === CADDIE_ACCOUNT_TYPE.BY_ROUND_MATCH) {
      const roundAndMatch = await MatchPlayVersus.findAll({
        where: {
          course_id: courseId,
        },
        raw: true,
        order: [
          ['round_num', 'ASC'],
          ['match_num', 'ASC'],
        ],
      });
      const caddieAccounts = roundAndMatch.map((r) => {
        return {
          username: `c${courseId}r${r.round_num}m${r.match_num}`,
          password: randomString(8),
          round: r.round_num,
          match: r.match_num,
          type: r.type,
        };
      });
      const filePath = path.join(__dirname, '..', '..', '/data', `course_${courseId}_caddies_${type}.xlsx`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await writeToXlsx(caddieAccounts, filePath);
      const createCaddiesData = caddieAccounts.map((c) => {
        return {
          username: c.username,
          password: hashPassword(c.password),
          role: ROLE.CADDIE,
          course_id: courseId,
          type: CADDIE_ACCOUNT_TYPE.BY_ROUND_MATCH,
        };
      });
      //await User.bulkCreate(createCaddiesData);
      await Promise.all(
        createCaddiesData.map(async (c) => {
          const existUser = await User.findOne({
            where: {
              course_id: courseId,
              username: c.username,
            },
          });
          if (existUser) return true;
          else {
            return await User.create(c, { transaction: t });
          }
        })
      );
    } else if (type === CADDIE_ACCOUNT_TYPE.BY_FLIGHT) {
      let teetimes = await TeeTime.findAll({
        where: {
          course_id: courseId,
        },
        include: [
          {
            model: TeeTimeGroup,
            as: 'groups',
            attributes: { exclude: ['createdAt', 'updatedAt'] },

            include: [
              {
                model: TeeTimeGroupPlayer,
                as: 'group_players',
                attributes: { exclude: ['createdAt', 'updatedAt', 'course_id', 'round_id'] },
                include: [
                  {
                    model: Player,
                    as: 'players',
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    where: { status: PLAYER_STATUS.NORMAL },
                  },
                ],
              },
            ],
          },
        ],
      });
      teetimes = teetimes.map((teetime) => {
        teetime.toJSON();
        return {
          teetime_group_id: teetime.teetime_group_id,
          tee: teetime.tee,
          time: teetime.time,
          group_num: teetime.groups.group_num,
          players: teetime.groups.group_players.map((player) => player.players),
        };
      });
      console.log(teetimes);
      const caddieAccounts = teetimes.map((t) => {
        return {
          username: `c${courseId}f${t.group_num}`,
          password: randomString(8),
          flight: t.group_num,
        };
      });
      const filePath = path.join(__dirname, '..', '..', '/data', `course_${courseId}_caddies_${type}.xlsx`);
      await writeToXlsx(caddieAccounts, filePath);
      const createCaddiesData = caddieAccounts.map((c) => {
        return {
          username: c.username,
          password: hashPassword(c.password),
          role: ROLE.CADDIE,
          course_id: courseId,
          type: CADDIE_ACCOUNT_TYPE.BY_FLIGHT,
        };
      });
      await User.bulkCreate(createCaddiesData);
      return true;
    }
    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    throw error;
  }
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
