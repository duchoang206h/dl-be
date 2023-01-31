const COURSE_TYPE = {
  STOKE_PLAY: 'Stroke play',
  MATCH_PLAY: 'Match play',
  FOURSOME: 'Foursome',
  FOUR_BALL: 'Four ball',
  STABLEFORD: 'Stableford',
};
const SCORE_TYPE = {
  PAR: 'PAR',
  BIRDIE: 'Birdie',
  EAGLE: 'Eagle',
  BOGEY: 'Bogey',
  D_BOGEY: 'D.Bogey+',
};
const ROLE = {
  ADMIN: 'admin',
  COURSE_USER: 'course_user',
};
const DATE_FORMAT = 'DD-MM-YYYY';
const PAR_PER_ROUND = 72;
const HOLE_PER_COURSE = 18;
const FINISH_ALL_ROUNDS = 'F';
const EVENT_ZERO = 'E';
const LEADERBOARD_IMAGES = {
  'ẢNH BXH': 'ẢNH BXH',
  'Màu Eagle': 'Màu Eagle',
  'Màu Birdie': 'Màu Birdie',
  'Màu Bogey': 'Màu Bogey',
  'Màu Double Bogey +': 'Màu Double Bogey +',
  'Màu Eagle Mini': 'Màu Eagle Mini',
  'Màu Birdie Mini': 'Màu Birdie Mini',
  'Màu Double Bogey + Mini': 'Màu Double Bogey + Mini',
  'ẢNH THEO ĐIỂM SỐ Âm': 'ẢNH THEO ĐIỂM SỐ Âm',
  'ẢNH THEO ĐIỂM SỐ Dương': 'ẢNH THEO ĐIỂM SỐ Dương',
};
const PLAYER_STATUS = {
  NORMAL: 'Normal',
  OUT_CUT: 'Out cut',
  WITHDRAW: 'Withdraw',
  DISQUALIFIED: 'Disqualified',
  RETD: 'RETD',
};
const MAX_NUM_PUTT = 50;
const SCORE_CARD_IMAGES = {
  logo: 'Logo giải đấu',
  main: 'ẢNH MAIN',
  negative_score: 'Ảnh theo điểm số âm',
  positive_score: 'Ảnh theo điểm SỐ Dương',
  equal_score: 'Ảnh theo điểm số bằng',
  eagle_color: 'Màu Eagle',
  birdie_color: 'Màu Birdie',
  bogey_color: 'Màu Bogey',
  double_bogey_color: 'Màu Double Bogey +',
};
module.exports = {
  COURSE_TYPE,
  SCORE_TYPE,
  ROLE,
  PAR_PER_ROUND,
  DATE_FORMAT,
  HOLE_PER_COURSE,
  FINISH_ALL_ROUNDS,
  EVENT_ZERO,
  SCORE_CARD_IMAGES,
  PLAYER_STATUS,
  MAX_NUM_PUTT,
};
