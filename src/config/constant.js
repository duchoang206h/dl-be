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
  birdie_color: {
    name: 'Màu Birdie',
    type: 'LEADERBOARD_IMAGES.birdie_color',
  },
  bogey_color: {
    name: 'Màu Bogey',
    type: 'LEADERBOARD_IMAGES.bogey_color',
  },
  double_bogey_color: {
    name: 'Màu Double Bogey +',
    type: 'LEADERBOARD_IMAGES.double_bogey_color',
  },
  eagle_color: {
    name: 'Màu Eagle',
    type: 'LEADERBOARD_IMAGES.eagle_color',
  },
  birdie_mini_color: {
    name: 'Màu Birdie Mini',
    type: 'LEADERBOARD_IMAGES.birdie_mini_color',
  },
  bogey_mini_color: {
    name: 'Màu Bogey Mini',
    type: 'LEADERBOARD_IMAGES.bogey_mini_color',
  },
  double_bogey_mini_color: {
    name: 'Màu Double Bogey + Mini',
    type: 'LEADERBOARD_IMAGES.double_bogey_mini_color',
  },
  eagle_mini_color: {
    name: 'Màu Eagle Mini',
    type: 'LEADERBOARD_IMAGES.eagle_mini_color',
  },
};
const LEADERBOARD_MINI_IMAGES = {
  main: {
    name: 'ẢNH BXH',
    type: 'LEADERBOARD_MINI_IMAGES.main',
  },
  negative_score: {
    name: 'Ảnh theo điểm số âm',
    type: 'LEADERBOARD_MINI_IMAGES.negative_score',
  },
  positive_score: {
    name: 'Ảnh theo điểm số dương',
    type: 'LEADERBOARD_MINI_IMAGES.positive_score',
  },
  equal_score: {
    name: 'Ảnh theo điểm số bằng',
    type: 'LEADERBOARD_MINI_IMAGES.equal_score',
  },
  negative_score_mini: {
    name: 'Ảnh theo điểm số âm',
    type: 'LEADERBOARD_MINI_IMAGES.negative_score_mini',
  },
  positive_score_mini: {
    name: 'Ảnh theo điểm số dương',
    type: 'LEADERBOARD_MINI_IMAGES.positive_score_mini',
  },
  equal_score_mini: {
    name: 'Ảnh theo điểm số bằng',
    type: 'LEADERBOARD_MINI_IMAGES.equal_score_mini',
  },
  birdie_color: {
    name: 'Màu Birdie',
    type: 'LEADERBOARD_IMAGES.birdie_color',
  },
  bogey_color: {
    name: 'Màu Bogey',
    type: 'LEADERBOARD_MINI_IMAGES.bogey_color',
  },
  double_bogey_color: {
    name: 'Màu Double Bogey +',
    type: 'LEADERBOARD_MINI_IMAGES.double_bogey_color',
  },
  eagle_color: {
    name: 'Màu Eagle',
    type: 'LEADERBOARD_MINI_IMAGES.eagle_color',
  },
  birdie_mini_color: {
    name: 'Màu Birdie Mini',
    type: 'LEADERBOARD_MINI_IMAGES.birdie_mini_color',
  },
  bogey_mini_color: {
    name: 'Màu Bogey Mini',
    type: 'LEADERBOARD_IMAGES.bogey_mini_color',
  },
  double_bogey_mini_color: {
    name: 'Màu Double Bogey + Mini',
    type: 'LEADERBOARD_IMAGES.double_bogey_mini_color',
  },
  eagle_mini_color: {
    name: 'Màu Eagle Mini',
    type: 'LEADERBOARD_MINI_IMAGES.eagle_mini_color',
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
  logo: {
    name: 'Logo giải đấu',
    type: 'SCORECARD_IMAGES.logo',
  },
  main: {
    name: 'Ảnh main',
    type: 'SCORECARD_IMAGES.main',
  },
  negative_score: {
    name: 'Ảnh theo điểm số âm',
    type: 'SCORECARD_IMAGES.negative_score',
  },
  positive_score: { name: 'Ảnh theo điểm số dương', type: 'SCORECARD_IMAGES.positive_score' },
  equal_score: { name: 'Ảnh theo điểm số bằng', type: 'SCORECARD_IMAGES.equal_score' },
  eagle_color: { name: 'Màu Eagle', type: 'SCORECARD_IMAGES.eagle_color' },

  par_color: { name: 'Màu Par', type: 'SCORECARD_IMAGES.par_color' },

  birdie_color: { name: 'Màu Birdie', type: 'SCORECARD_IMAGES.birdie_color' },
  bogey_color: { name: 'Màu Bogey', type: 'SCORECARD_IMAGES.bogey_color' },
  double_bogey_color: { name: 'Màu Double Bogey +', type: 'SCORECARD_IMAGES.double_bogey_color' },
};
const HOLE_TOP_IMAGES = {
  main: {
    name: 'Ảnh main',
    type: 'HOLE_TOP_IMAGES.main',
  },
};
const HOLE_BOTTOM_IMAGES = {
  main: {
    name: 'Ảnh main',
    type: 'HOLE_BOTTOM_IMAGES.main',
  },
};
const GOLFER_INFO_IMAGES = {
  main: {
    name: 'Ảnh main',
    type: 'GOLFER_INFO_IMAGES.main',
  },
  logo: {
    name: 'Logo giải đấu',
    type: 'GOLFER_INFO_IMAGES.logo',
  },
};
const FLIGHT_INFOR_IMAGES = {
  main: {
    name: 'Ảnh main',
    type: 'FLIGHT_INFOR_IMAGES.logo',
  },
  logo: {
    name: 'Logo giải đấu',
    type: 'FLIGHT_INFOR_IMAGES.logo',
  },
};
const GROUP_RANK_IMAGES = {
  main: {
    name: 'ẢNH BXH',
    type: 'GROUP_RANK_IMAGES.main',
  },
  negative_score: {
    name: 'Ảnh theo điểm số âm',
    type: 'GROUP_RANK_IMAGES.negative_score',
  },
  positive_score: {
    name: 'Ảnh theo điểm số dương',
    type: 'GROUP_RANK_IMAGES.positive_score',
  },
  equal_score: {
    name: 'Ảnh theo điểm số bằng',
    type: 'GROUP_RANK_IMAGES.equal_score',
  },
  birdie_color: {
    name: 'Màu Birdie',
    type: 'GROUP_RANK_IMAGES.birdie_color',
  },
  bogey_color: {
    name: 'Màu Bogey',
    type: 'GROUP_RANK_IMAGES.bogey_color',
  },
  double_bogey_color: {
    name: 'Màu Double Bogey +',
    type: 'GROUP_RANK_IMAGES.double_bogey_color',
  },
  eagle_color: {
    name: 'Màu Eagle',
    type: 'GROUP_RANK_IMAGES.eagle_color',
  },
};
const GOLFER_IN_HOLE_IMAGES = {
  main: {
    name: 'ẢNH BXH',
    type: 'GOLFER_IN_HOLE_IMAGES.main',
  },
  negative_score: {
    name: 'Ảnh theo điểm số âm',
    type: 'GOLFER_IN_HOLE_IMAGES.negative_score',
  },
  positive_score: {
    name: 'Ảnh theo điểm số dương',
    type: 'GOLFER_IN_HOLE_IMAGES.positive_score',
  },
  equal_score: {
    name: 'Ảnh theo điểm số bằng',
    type: 'GOLFER_IN_HOLE_IMAGES.equal_score',
  },
  birdie_color: {
    name: 'Màu Birdie',
    type: 'GOLFER_IN_HOLE_IMAGES.birdie_color',
  },
  bogey_color: {
    name: 'Màu Bogey',
    type: 'GOLFER_IN_HOLE_IMAGES.bogey_color',
  },
  double_bogey_color: {
    name: 'Màu Double Bogey +',
    type: 'GOLFER_IN_HOLE_IMAGES.double_bogey_color',
  },
  eagle_color: {
    name: 'Màu Eagle',
    type: 'GOLFER_IN_HOLE_IMAGES.eagle_color',
  },
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
  FLIGHT_INFOR_IMAGES,
  GOLFER_INFO_IMAGES,
  GROUP_RANK_IMAGES,
  HOLE_BOTTOM_IMAGES,
  HOLE_TOP_IMAGES,
  GOLFER_IN_HOLE_IMAGES,
  LEADERBOARD_MINI_IMAGES,
};
