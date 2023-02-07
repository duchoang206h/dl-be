const {
  getHoleBottom,
  getHoleTop,
  getFlightInfo,
  getGolferDetails,
  getScorecard,
  getLeaderboard,
  getGolferInHoleStatistic,
  getGolferInHole,
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
  },
};
module.exports = { swaggerDocument };
