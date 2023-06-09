const httpStatus = require('http-status');
const { ApiError } = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { jwtVerify } = require('../services/token.service');
const { getUserById } = require('../services/user.service');
const { TOKEN_EXPIRED, TOKEN_INVALID, NO_TOKEN_PROVIDED, CADDIE_NOT_PERMISSION } = require('../utils/errorMessage');
const { ROLE, COURSE_TYPE, CADDIE_ACCOUNT_TYPE } = require('../config/constant');
const { Player, MatchPlayVersus, MatchPlayTeamPlayer, TeeTimeGroup, TeeTimeGroupPlayer } = require('../models/schema');
const { Op } = require('sequelize');
const getVgaRegex = /C_\d+_/;
const getRMRegex = /\D+/g;
const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.user_id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

/* const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  }; */
const auth = async (req, res, next) => {
  try {
    const token = req.headers.token || req.cookies.token;
    if (!token) return res.status(httpStatus.UNAUTHORIZED).send({ message: NO_TOKEN_PROVIDED });
    const payload = jwtVerify(token);
    req.isAuthenticated = true;
    req.userId = payload.sub;
    return next();
  } catch (error) {
    if (error.message === 'jwt expired') return res.status(httpStatus.UNAUTHORIZED).send({ message: TOKEN_EXPIRED });
    return res.status(httpStatus.UNAUTHORIZED).send({ message: TOKEN_INVALID });
  }
};
const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await getUserById(req.userId);
    req.user = user;
    if (user && user.is_super) return next();
    return res.status(httpStatus.FORBIDDEN).send();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
  }
};
const checkAminPermission = async (req, res, next) => {
  try {
    const user = await getUserById(req.userId);
    req.user = user;
    if (user && user.is_super) return next();
    else if (user && user.course_id == req.params.courseId) return next();
    return res.status(httpStatus.FORBIDDEN).send();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
  }
};
const checkCaddiePermission = async (req, res, next) => {
  try {
    const user = req.user;
    const { courseId, roundNum, playerId } = req.params;
    if (user && user.role === ROLE.CADDIE) {
      if (user.type === CADDIE_ACCOUNT_TYPE.BY_PLAYER) {
        const vga = user.username?.replace(getVgaRegex, '');

        const roundType = await MatchPlayVersus.findOne({
          where: {
            course_id: courseId,
            round_num: roundNum,
          },
        });
        if (roundType.type === COURSE_TYPE.FOURSOME) {
          const teamPlayer = await MatchPlayTeamPlayer.findOne({
            where: { player_id: playerId },
            include: [{ model: Player, as: 'players' }],
          });
          const teammate = await MatchPlayTeamPlayer.findOne({
            where: {
              matchplay_team_id: teamPlayer.matchplay_team_id,
              player_id: {
                [Op.notIn]: [playerId],
              },
            },
            include: [{ model: Player, as: 'players' }],
          });
          if (teamPlayer && teammate && [teammate?.players?.vga, teamPlayer?.players?.vga].includes(vga)) return next();
          return res.status(httpStatus.BAD_REQUEST).send({
            message: CADDIE_NOT_PERMISSION,
          });
        }
        const player = await Player.findOne({
          where: { course_id: req.params.courseId, player_id: req.params.playerId },
        });
        if (player && vga === player.vga) return next();
        return res.status(httpStatus.BAD_REQUEST).send({
          message: CADDIE_NOT_PERMISSION,
        });
      } else if (user.type === CADDIE_ACCOUNT_TYPE.BY_ROUND_MATCH) {
        console.log('---------------');
        const [_, __, round, match] = user.username.replace(getRMRegex, '_').split('_');
        console.log({ round, match });
        const scores = req.body?.scores;
        console.log(scores);
        const checkMatch = scores.filter((s) => s.match_num == match).length;
        if (checkMatch > 0 && +round == roundNum) return next();
        return res.status(httpStatus.BAD_REQUEST).send({
          message: CADDIE_NOT_PERMISSION,
        });
      } else if (user.type === CADDIE_ACCOUNT_TYPE.BY_FLIGHT) {
        const [_, __, flight] = user.username.replace(getRMRegex, '_').split('_');
        const teetimeGroup = await TeeTimeGroup.findOne({
          where: {
            course_id: courseId,
            group_num: +flight,
          },
          include: [{ model: TeeTimeGroupPlayer, as: 'group_players', include: [{ model: Player, as: 'players' }] }],
        });
        const checkPlayer = teetimeGroup?.group_players.find((p) => {
          p.toJSON();
          console.log(p.players.player_id);
          return p.players.player_id == playerId;
        });
        console.log({ playerId });
        console.log(checkPlayer);
        if (checkPlayer) return next();
        return res.status(httpStatus.BAD_REQUEST).send({
          message: CADDIE_NOT_PERMISSION,
        });
      }
    }
    return next();
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
  }
};
module.exports = { isSuperAdmin, auth, checkAminPermission, checkCaddiePermission };
