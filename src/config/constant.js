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
  EAGLE: 'Eagle or Better',
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
  main: {
    name: 'ẢNH BXH',
    type: 'LEADERBOARD_IMAGES.main',
  },
  negative_score: {
    name: 'Ảnh theo điểm số âm',
    type: 'LEADERBOARD_IMAGES.negative_score',
  },
  positive_score: {
    name: 'Ảnh theo điểm số dương',
    type: 'LEADERBOARD_IMAGES.positive_score',
  },
  equal_score: {
    name: 'Ảnh theo điểm số bằng',
    type: 'LEADERBOARD_IMAGES.equal_score',
  },
  negative_score_mini: {
    name: 'Ảnh theo điểm số âm',
    type: 'LEADERBOARD_IMAGES.negative_score_mini',
  },
  positive_score_mini: {
    name: 'Ảnh theo điểm số dương',
    type: 'LEADERBOARD_IMAGES.positive_score_mini',
  },
  equal_score_mini: {
    name: 'Ảnh theo điểm số bằng',
    type: 'LEADERBOARD_IMAGES.equal_score_mini',
  },
};
const PLAYER_STATUS = {
  NORMAL: 'Normal',
  OUT_CUT: 'Out cut',
  WITHDRAW: 'Withdraw',
  DISQUALIFIED: 'Disqualified',
  RETD: 'RETD',
};
const MAX_NUM_PUTT = 50;
const SCORECARD_IMAGES = {
  logo: 'Logo giải đấu',
  main: 'ẢNH MAIN',
  negative_score: 'Ảnh theo điểm số âm',
  positive_score: 'Ảnh theo điểm số dương',
  equal_score: 'Ảnh theo điểm số bằng',
  eagle_color: 'Màu Eagle',
  birdie_color: 'Màu Birdie',
  bogey_color: 'Màu Bogey',
};
const DEFAULT_SCORES = [
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 1,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 2,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 4,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 3,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 5,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 6,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 7,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 8,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 9,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 10,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 11,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 12,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 13,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 14,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 15,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 16,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 17,
    },
  },
  {
    num_putt: 0,
    score_type: null,
    Hole: {
      hole_num: 18,
    },
  },
];
module.exports = {
  COURSE_TYPE,
  SCORE_TYPE,
  ROLE,
  PAR_PER_ROUND,
  DATE_FORMAT,
  HOLE_PER_COURSE,
  FINISH_ALL_ROUNDS,
  EVENT_ZERO,
  SCORECARD_IMAGES,
  PLAYER_STATUS,
  MAX_NUM_PUTT,
  DEFAULT_SCORES,
  LEADERBOARD_IMAGES,
};
