const {
  getHoleBottom,
  getHoleTop,
  getFlightInfo,
  getGolferDetails,
  getScorecard,
  getLeaderboard,
  getFlightRank,
  getGolferBottom,
  getGolferInHole,
  getLeaderboardMini,
} = require('./livestream');
const swaggerDocument = {
  openapi: '3.0.1',

  info: {
    version: '1.0.0',
    title: 'Livestream api',
    description: 'Livestream api',
  },
  tags: [
    {
      name: 'HoleBottom',
    },
    {
      name: 'FlightInfo',
    },
    {
      name: 'Scorecard',
    },
    {
      name: 'Leaderboard',
    },
    {
      name: 'GolferInHole',
    },
  ],
  paths: {
    /** Aws */
    '/v1/livestream/holes/bottom': {
      get: getHoleBottom,
    },
    '/v1/livestream/leaderboard': {
      get: getLeaderboard,
    },
    '/v1/livestream/holes/top': {
      get: getHoleTop,
    },

    '/v1/livestream/flights-info': {
      get: getFlightInfo,
    },
    '/v1/livestream/golfers': {
      get: getGolferDetails,
    },
    '/v1/livestream/scorecard': {
      get: getScorecard,
    },
    '/v1/livestream/golfer-in-hole': {
      get: getGolferInHole,
    },
    '/v1/livestream/golfers/bottom': {
      get: getGolferBottom,
    },
    /* '/v1/livestream/leaderboard': {
      get: getLeaderboardMini,
    }, */
    '/v1/livestream/flights': {
      get: getFlightRank,
    },
  },
  servers: [
    /*  {
      url: 'https://',
      description: 'PROD Env',
    }, */
    {
      url: 'http://42.96.41.96/:3000',
      description: 'DEV Env',
    },
    {
      url: 'http://localhost:3000/',
      description: 'LCL Env',
    },
  ],
};
module.exports = { swaggerDocument };
