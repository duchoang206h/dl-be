const TOKEN_EXPIRED = 'Token expired';
const TOKEN_INVALID = 'Token invalid';
const NO_TOKEN_PROVIDED = 'No token provided';
const TEETIME_MUST_BE_INCLUDE_ALL_PLAYERS = 'Teetime must include all players';
const PLAYER_NOT_FOUND = (name) => `Golfer with name ${name} not found in list`;
module.exports = {
  TOKEN_EXPIRED,
  TOKEN_INVALID,
  NO_TOKEN_PROVIDED,
  TEETIME_MUST_BE_INCLUDE_ALL_PLAYERS,
  PLAYER_NOT_FOUND,
};
