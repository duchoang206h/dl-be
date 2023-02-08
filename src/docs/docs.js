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
    '/v1/livestream/holes/bottom.json': {
      get: getHoleBottom,
    },
    '/v1/livestream/leaderboard.json': {
      get: getLeaderboard,
    },
    '/v1/livestream/holes/top.json': {
      get: getHoleTop,
    },

    '/v1/livestream/flights-info.json': {
      get: getFlightInfo,
    },
    '/v1/livestream/golfers.json': {
      get: getGolferDetails,
    },
    '/v1/livestream/scorecard.json': {
      get: getScorecard,
    },
    '/v1/livestream/golfer-in-hole.json': {
      get: getGolferInHole,
    },
    '/v1/livestream/golfers/bottom.json': {
      get: getGolferBottom,
    },
    /* '/v1/livestream/leaderboard': {
      get: getLeaderboardMini,
    }, */
    '/v1/livestream/flights.json': {
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
