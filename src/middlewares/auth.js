const httpStatus = require('http-status');
const { ApiError } = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { jwtVerify } = require('../services/token.service');
const { getUserById } = require('../services/user.service');
const { TOKEN_EXPIRED, TOKEN_INVALID, NO_TOKEN_PROVIDED } = require('../utils/errorMessage');

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
    const { token } = req.headers || {};
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
    if (user && user.is_super) return next();
    else if (user && user.course_id == req.params.courseId) return next();
    return res.status(httpStatus.FORBIDDEN).send();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
  }
};
module.exports = { isSuperAdmin, auth, checkAminPermission };
