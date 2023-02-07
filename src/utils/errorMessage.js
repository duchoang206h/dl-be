const TOKEN_EXPIRED = 'Token expired';
const TOKEN_INVALID = 'Token invalid';
const NO_TOKEN_PROVIDED = 'No token provided';
const TEETIME_MUST_BE_INCLUDE_ALL_PLAYERS = 'Teetime must include all players';
const PLAYER_NOT_FOUND = (name) => `Golfer with name ${name} not found in list`;
const USER_EXIST = 'Username has existed';
const NUM_PUTT_INVALID = 'Putt must greater than 0 and less than 50';
const INVALID_GROUP_TIME = 'Times must be the same';
const INVALID_GROUP_TEE = 'Tees must be the same';
const INVALID_TOTAL_HOLE = (hole) => `Golf score must have enough ${hole} holes`;
const INVALID_TOTAL_PAR = (PAR) => `Golf score must have enough ${PAR} par`;
const INVALID_GOLFER_CODE = `Golfer vga field must be unique`;
const INVALID_GOLFER_LEVEL = `Level must be Amateur or Professional`;
const INVALID_GOLFER_NAME = `Golfer name field must be unique`;
const INVALID_SCORE_INPUT = `Previous hole score must be completed, then create a new one`;
const INVALID_COUNTRY_CODE = `Invalid country code`;
module.exports = {
  TOKEN_EXPIRED,
  TOKEN_INVALID,
  NO_TOKEN_PROVIDED,
  TEETIME_MUST_BE_INCLUDE_ALL_PLAYERS,
  PLAYER_NOT_FOUND,
  USER_EXIST,
  NUM_PUTT_INVALID,
  INVALID_GROUP_TIME,
  INVALID_GROUP_TEE,
  INVALID_TOTAL_HOLE,
  INVALID_TOTAL_PAR,
  INVALID_GOLFER_CODE,
  INVALID_GOLFER_NAME,
  INVALID_SCORE_INPUT,
  INVALID_GOLFER_LEVEL,
  INVALID_COUNTRY_CODE,
};
