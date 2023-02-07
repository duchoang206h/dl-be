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
const DATE_FORMAT = 'DD/MM/YYYY';
const PAR_PER_ROUND = 72;
const HOLE_PER_COURSE = 18;
const FINISH_ALL_ROUNDS = 'F';
const EVENT_ZERO = 'E';
const LEADERBOARD_IMAGES = {
  main: {
    name: 'ẢNH BXH',
    type: 'LEADERBOARD_IMAGES.main',
  },
  main1: {
    name: 'ẢNH BXH 1',
    type: 'LEADERBOARD_MINI_IMAGES.main1',
    url: null,
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
    url: null,
  },
  main1: {
    name: 'ẢNH BXH 1',
    type: 'LEADERBOARD_MINI_IMAGES.main1',
    url: null,
  },
  negative_score: {
    name: 'Ảnh theo điểm số âm',
    type: 'LEADERBOARD_MINI_IMAGES.negative_score',
    url: null,
  },
  positive_score: {
    name: 'Ảnh theo điểm số dương',
    type: 'LEADERBOARD_MINI_IMAGES.positive_score',
    url: null,
  },
  equal_score: {
    name: 'Ảnh theo điểm số bằng',
    type: 'LEADERBOARD_MINI_IMAGES.equal_score',
    url: null,
  },
  negative_score_mini: {
    name: 'Ảnh theo điểm số âm min',
    type: 'LEADERBOARD_MINI_IMAGES.negative_score_mini',
    url: null,
  },
  positive_score_mini: {
    name: 'Ảnh theo điểm số dương min',
    type: 'LEADERBOARD_MINI_IMAGES.positive_score_mini',
    url: null,
  },
  equal_score_mini: {
    name: 'Ảnh theo điểm số bằng min',
    type: 'LEADERBOARD_MINI_IMAGES.equal_score_mini',
    url: null,
  },
  birdie_color: {
    name: 'Màu Birdie',
    type: 'LEADERBOARD_IMAGES.birdie_color',
    url: null,
  },
  bogey_color: {
    name: 'Màu Bogey',
    type: 'LEADERBOARD_MINI_IMAGES.bogey_color',
    url: null,
  },
  double_bogey_color: {
    name: 'Màu Double Bogey +',
    type: 'LEADERBOARD_MINI_IMAGES.double_bogey_color',
    url: null,
  },
  eagle_color: {
    name: 'Màu Eagle',
    type: 'LEADERBOARD_MINI_IMAGES.eagle_color',
    url: null,
  },
  birdie_mini_color: {
    name: 'Màu Birdie Mini',
    type: 'LEADERBOARD_MINI_IMAGES.birdie_mini_color',
    url: null,
  },
  bogey_mini_color: {
    name: 'Màu Bogey Mini',
    type: 'LEADERBOARD_MINI_IMAGES.bogey_mini_color',
    url: null,
  },
  double_bogey_mini_color: {
    name: 'Màu Double Bogey + Mini',
    type: 'LEADERBOARD_MINI_IMAGES.double_bogey_mini_color',
    url: null,
  },
  eagle_mini_color: {
    name: 'Màu Eagle Mini',
    type: 'LEADERBOARD_MINI_IMAGES.eagle_mini_color',
    url: null,
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
  main: {
    name: 'Ảnh main',
    type: 'SCORECARD_IMAGES.main',
    url: null,
  },
  negative_score: {
    name: 'Ảnh theo điểm số âm',
    type: 'SCORECARD_IMAGES.negative_score',
    url: null,
  },

  positive_score: { name: 'Ảnh theo điểm số dương', type: 'SCORECARD_IMAGES.positive_score', url: null },
  equal_score: { name: 'Ảnh theo điểm số bằng', type: 'SCORECARD_IMAGES.equal_score', url: null },
  eagle_color: { name: 'Màu Eagle', type: 'SCORECARD_IMAGES.eagle_color', url: null },

  par_color: { name: 'Màu Par', type: 'SCORECARD_IMAGES.par_color', url: null },

  birdie_color: { name: 'Màu Birdie', type: 'SCORECARD_IMAGES.birdie_color', url: null },
  bogey_color: { name: 'Màu Bogey', type: 'SCORECARD_IMAGES.bogey_color', url: null },
  double_bogey_color: { name: 'Màu Double Bogey +', type: 'SCORECARD_IMAGES.double_bogey_color', url: null },
};
const GOLFER_BOTTOM_IMAGES = {
  main: {
    name: 'Ảnh main',
    type: 'GOLFER_BOTTOM_IMAGES.main',
    url: null,
  },
  negative_score: {
    name: 'Ảnh theo điểm số âm',
    type: 'GOLFER_BOTTOM_IMAGES.negative_score',
    url: null,
  },
  positive_score: { name: 'Ảnh theo điểm số dương', type: 'GOLFER_BOTTOM_IMAGES.positive_score', url: null },
  equal_score: { name: 'Ảnh theo điểm số bằng', type: 'GOLFER_BOTTOM_IMAGES.equal_score', url: null },
};
const HOLE_TOP_IMAGES = {
  main: {
    name: 'Ảnh main',
    type: 'HOLE_TOP_IMAGES.main',
    url: null,
  },
};
const HOLE_BOTTOM_IMAGES = {
  main: {
    name: 'Ảnh main',
    type: 'HOLE_BOTTOM_IMAGES.main',
    url: null,
  },
};
const GOLFER_INFO_IMAGES = {
  main: {
    name: 'Ảnh main',
    type: 'GOLFER_INFO_IMAGES.main',
    url: null,
  },
};
const FLIGHT_INFOR_IMAGES = {
  main: {
    name: 'Ảnh main',
    type: 'FLIGHT_INFOR_IMAGES.logo',
    url: null,
  },
};
const GROUP_RANK_IMAGES = {
  main: {
    name: 'ẢNH MAIN',
    type: 'GROUP_RANK_IMAGES.main',
    url: null,
  },
  main1: {
    name: 'ẢNH MAIN 1',
    type: 'GROUP_RANK_IMAGES.main1',
    url: null,
  },
  negative_score: {
    name: 'Ảnh theo điểm số âm',
    type: 'GROUP_RANK_IMAGES.negative_score',
    url: null,
  },
  positive_score: {
    name: 'Ảnh theo điểm số dương',
    type: 'GROUP_RANK_IMAGES.positive_score',
    url: null,
  },
  equal_score: {
    name: 'Ảnh theo điểm số bằng',
    type: 'GROUP_RANK_IMAGES.equal_score',
    url: null,
  },
  birdie_color: {
    name: 'Màu Birdie',
    type: 'GROUP_RANK_IMAGES.birdie_color',
    url: null,
  },
  bogey_color: {
    name: 'Màu Bogey',
    type: 'GROUP_RANK_IMAGES.bogey_color',
    url: null,
  },
  double_bogey_color: {
    name: 'Màu Double Bogey +',
    type: 'GROUP_RANK_IMAGES.double_bogey_color',
    url: null,
  },
  eagle_color: {
    name: 'Màu Eagle',
    type: 'GROUP_RANK_IMAGES.eagle_color',
    url: null,
  },
};
const GOLFER_IN_HOLE_IMAGES = {
  main: {
    name: 'ẢNH MAIN',
    type: 'GOLFER_IN_HOLE_IMAGES.main',
    url: null,
  },
  main1: {
    name: 'ẢNH MAIN1',
    type: 'GOLFER_IN_HOLE_IMAGES.main1',
    url: null,
  },
  negative_score: {
    name: 'Ảnh theo điểm số âm',
    type: 'GOLFER_IN_HOLE_IMAGES.negative_score',
    url: null,
  },
  positive_score: {
    name: 'Ảnh theo điểm số dương',
    type: 'GOLFER_IN_HOLE_IMAGES.positive_score',
    url: null,
  },
  equal_score: {
    name: 'Ảnh theo điểm số bằng',
    type: 'GOLFER_IN_HOLE_IMAGES.equal_score',
    url: null,
  },
  birdie_color: {
    name: 'Màu Birdie',
    type: 'GOLFER_IN_HOLE_IMAGES.birdie_color',
    url: null,
  },
  bogey_color: {
    name: 'Màu Bogey',
    type: 'GOLFER_IN_HOLE_IMAGES.bogey_color',
    url: null,
  },
  double_bogey_color: {
    name: 'Màu Double Bogey +',
    type: 'GOLFER_IN_HOLE_IMAGES.double_bogey_color',
    url: null,
  },
  eagle_color: {
    name: 'Màu Eagle',
    type: 'GOLFER_IN_HOLE_IMAGES.eagle_color',
    url: null,
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
const COUNTRY = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'land Islands', code: 'AX' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'American Samoa', code: 'AS' },
  { name: 'AndorrA', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Anguilla', code: 'AI' },
  { name: 'Antarctica', code: 'AQ' },
  { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Aruba', code: 'AW' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bermuda', code: 'BM' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Bouvet Island', code: 'BV' },
  { name: 'Brazil', code: 'BR' },
  { name: 'British Indian Ocean Territory', code: 'IO' },
  { name: 'Brunei Darussalam', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA' },
  { name: 'Cape Verde', code: 'CV' },
  { name: 'Cayman Islands', code: 'KY' },
  { name: 'Central African Republic', code: 'CF' },
  { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Christmas Island', code: 'CX' },
  { name: 'Cocos (Keeling) Islands', code: 'CC' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Comoros', code: 'KM' },
  { name: 'Congo', code: 'CG' },
  { name: 'Congo, The Democratic Republic of the', code: 'CD' },
  { name: 'Cook Islands', code: 'CK' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Cote D"Ivoire', code: 'CI' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Falkland Islands (Malvinas)', code: 'FK' },
  { name: 'Faroe Islands', code: 'FO' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'French Guiana', code: 'GF' },
  { name: 'French Polynesia', code: 'PF' },
  { name: 'French Southern Territories', code: 'TF' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Gibraltar', code: 'GI' },
  { name: 'Greece', code: 'GR' },
  { name: 'Greenland', code: 'GL' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guadeloupe', code: 'GP' },
  { name: 'Guam', code: 'GU' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guernsey', code: 'GG' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
  { name: 'Holy See (Vatican City State)', code: 'VA' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran, Islamic Republic Of', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Isle of Man', code: 'IM' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jersey', code: 'JE' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Korea, Democratic People"S Republic of', code: 'KP' },
  { name: 'Korea, Republic of', code: 'KR' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Lao People"S Democratic Republic', code: 'LA' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libyan Arab Jamahiriya', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Macao', code: 'MO' },
  { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Martinique', code: 'MQ' },
  { name: 'Mauritania', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mayotte', code: 'YT' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Micronesia, Federated States of', code: 'FM' },
  { name: 'Moldova, Republic of', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Montenegro', code: 'ME' },
  { name: 'Montserrat', code: 'MS' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Netherlands Antilles', code: 'AN' },
  { name: 'New Caledonia', code: 'NC' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Niue', code: 'NU' },
  { name: 'Norfolk Island', code: 'NF' },
  { name: 'Northern Mariana Islands', code: 'MP' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Palestinian Territory, Occupied', code: 'PS' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Pitcairn', code: 'PN' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Puerto Rico', code: 'PR' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Reunion', code: 'RE' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russian Federation', code: 'RU' },
  { name: 'RWANDA', code: 'RW' },
  { name: 'Saint Helena', code: 'SH' },
  { name: 'Saint Kitts and Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Pierre and Miquelon', code: 'PM' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'Sao Tome and Principe', code: 'ST' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia', code: 'RS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'Solomon Islands', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Svalbard and Jan Mayen', code: 'SJ' },
  { name: 'Swaziland', code: 'SZ' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syrian Arab Republic', code: 'SY' },
  { name: 'Taiwan, Province of China', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania, United Republic of', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Timor-Leste', code: 'TL' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tokelau', code: 'TK' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Turks and Caicos Islands', code: 'TC' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'United States Minor Outlying Islands', code: 'UM' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Viet Nam', code: 'VN' },
  { name: 'Virgin Islands, British', code: 'VG' },
  { name: 'Virgin Islands, U.S.', code: 'VI' },
  { name: 'Wallis and Futuna', code: 'WF' },
  { name: 'Western Sahara', code: 'EH' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
];
const PLAYER_LEVEL = {
  AMATEUR: 'Amateur',
  PROFESSIONAL: 'Professional',
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
  GOLFER_BOTTOM_IMAGES,
  COUNTRY,
  PLAYER_LEVEL,
};
