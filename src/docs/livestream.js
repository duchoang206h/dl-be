const getHoleBottom = {
  tags: ['HoleBottom'],
  parameters: [
    {
      in: 'query',
      name: 'courseId',
      schema: { type: 'number' },
      required: true,
      description: 'Id của cuộc thi golf',
      example: 1,
    },
    {
      in: 'query',
      name: 'hole',
      schema: { type: 'number' },
      required: true,
      description: 'Số lỗ',
      example: 1,
    },
    {
      in: 'query',
      name: 'round',
      schema: { type: 'number' },
      required: true,
      description: 'Round hiện tại',
      example: 1,
    },
  ],
  description: 'Get hole bottom',
  operationId: 'getHoleBottom',
  responses: {
    200: {
      description: 'Get hole bottom successfully.',
      content: {
        'application/json': {},
      },
    },
  },
};
const getHoleTop = {
  tags: ['HoleTop'],
  parameters: [
    {
      in: 'query',
      name: 'courseId',
      schema: { type: 'number' },
      required: true,
      description: 'Id của cuộc thi golf',
      example: 1,
    },
    {
      in: 'query',
      name: 'hole',
      schema: { type: 'string' },
      required: true,
      description: 'Số lỗ',
      example: 1,
    },
    {
      in: 'query',
      name: 'round',
      schema: { type: 'number' },
      required: true,
      description: 'Round hiện tại',
      example: 1,
    },
  ],
  description: 'Get hole top',
  operationId: 'getHoleTop',
  responses: {
    200: {
      description: 'Get hole top successfully.',
      content: {
        'application/json': {},
      },
    },
  },
};
const getFlightInfo = {
  tags: ['FlightInfo'],
  parameters: [
    {
      in: 'query',
      name: 'courseId',
      schema: { type: 'number' },
      required: true,
      description: 'Id của cuộc thi golf',
      example: 1,
    },
    {
      in: 'query',
      name: 'flight',
      schema: { type: 'number' },
      required: true,
      description: 'flight ',
      example: 1,
    },
    {
      in: 'query',
      name: 'round',
      schema: { type: 'number' },
      required: true,
      description: 'Round hiện tại',
      example: 1,
    },
  ],
  description: 'Flight info',
  operationId: 'getFlightInfo',
  responses: {
    200: {
      description: 'Get flight info successfully.',
      content: {
        'application/json': {},
      },
    },
  },
};
const getGolferDetails = {
  tags: ['FlightInfo'],
  parameters: [
    {
      in: 'query',
      name: 'courseId',
      schema: { type: 'number' },
      required: true,
      description: 'Id của cuộc thi golf',
      example: 1,
    },
    {
      in: 'query',
      name: 'code',
      schema: { type: 'number' },
      required: true,
      description: 'Mã vhandicap của golfer ',
      example: 1,
    },
  ],
  description: 'Golfer detail',
  operationId: 'getGolferDetail',
  responses: {
    200: {
      description: 'Get golfer detail successfully.',
      content: {
        'application/json': {},
      },
    },
  },
};
const getScorecard = {
  tags: ['Scorecard'],
  parameters: [
    {
      in: 'query',
      name: 'courseId',
      schema: { type: 'number' },
      required: true,
      description: 'Id của cuộc thi golf',
      example: 1,
    },
    {
      in: 'query',
      name: 'flight',
      schema: { type: 'number' },
      required: true,
      description: 'flight ',
      example: 1,
    },
    {
      in: 'query',
      name: 'round',
      schema: { type: 'number' },
      required: true,
      description: 'Round hiện tại',
      example: 1,
    },
  ],
  description: 'Scorecard',
  operationId: 'getScorecard',
  responses: {
    200: {
      description: 'Get scorecard successfully.',
      content: {
        'application/json': {},
      },
    },
  },
};
const getGolferInHole = {
  tags: ['GolferInHole'],
  parameters: [
    {
      in: 'query',
      name: 'courseId',
      schema: { type: 'number' },
      required: true,
      description: 'Id của cuộc thi golf',
      example: 1,
    },
    {
      in: 'query',
      name: 'code',
      schema: { type: 'number' },
      required: true,
      description: 'Mã vhandicap của golfer',
      example: 1,
    },
  ],
  description: 'Golfer in hole',
  operationId: 'getGolferInHole',
  responses: {
    200: {
      description: 'Get golfer in hole successfully.',
      content: {
        'application/json': {},
      },
    },
  },
};
const getFlightRank = {
  tags: ['FlightRank'],
  parameters: [
    {
      in: 'query',
      name: 'courseId',
      schema: { type: 'number' },
      required: true,
      description: 'Id của cuộc thi golf',
      example: 1,
    },
    {
      in: 'query',
      name: 'round',
      schema: { type: 'number' },
      required: true,
      description: 'Vòng hiện tại',
      example: 1,
    },
    {
      in: 'query',
      name: 'flight',
      schema: { type: 'number' },
      required: true,
      description: 'flight',
      example: 1,
    },
  ],
  description: 'Flight rank',
  operationId: 'getFlightRank',
  responses: {
    200: {
      description: 'Get flight rank successfully.',
      content: {
        'application/json': {},
      },
    },
  },
};
const getLeaderboardMini = {
  tags: ['LeaderboardMini'],
  parameters: [
    {
      in: 'query',
      name: 'courseId',
      schema: { type: 'number' },
      required: true,
      description: 'Id của cuộc thi golf',
      example: 1,
    },
    {
      in: 'query',
      name: 'round',
      schema: { type: 'number' },
      required: true,
      description: 'Round hiện tại',
      example: 1,
    },
    {
      in: 'query',
      name: 'type',
      schema: { type: 'string' },
      required: true,
      description: 'mini',
      example: 'mini',
    },
  ],
  description: 'Leaderboard min',
  operationId: 'getLeaderboardMini',
  responses: {
    200: {
      description: 'Get leaderboardMini successfully.',
      content: {
        'application/json': {},
      },
    },
  },
};
const getLeaderboard = {
  tags: ['Leaderboard'],
  parameters: [
    {
      in: 'query',
      name: 'courseId',
      schema: { type: 'number' },
      required: true,
      description: 'Id của cuộc thi golf',
      example: 1,
    },
    {
      in: 'query',
      name: 'round',
      schema: { type: 'number' },
      required: true,
      description: 'Round hiện tại',
      example: 1,
    },
    {
      in: 'query',
      name: 'type',
      schema: { type: 'string' },
      required: false,
      description: 'type=mini for leaderboard mini',
      example: 'mini',
    },
  ],
  description: 'Leaderboard',
  operationId: 'getLeaderboard',
  responses: {
    200: {
      description: 'Get leaderboard successfully.',
      content: {
        'application/json': {},
      },
    },
  },
};
const getGolferBottom = {
  tags: ['GolferBottom'],
  parameters: [
    {
      in: 'query',
      name: 'courseId',
      schema: { type: 'number' },
      required: true,
      description: 'Id của cuộc thi golf',
      example: 1,
    },
    {
      in: 'query',
      name: 'code',
      schema: { type: 'number' },
      required: true,
      description: 'Mã vhandicap của golfer',
      example: 1,
    },
  ],
  description: 'Golfer bottom',
  operationId: 'getGolferBottom',
  responses: {
    200: {
      description: 'Get golfer bottom successfully.',
      content: {
        'application/json': {},
      },
    },
  },
};
module.exports = {
  getFlightInfo,
  getGolferDetails,
  getGolferInHole,
  getHoleBottom,
  getHoleTop,
  getLeaderboard,
  getScorecard,
  getFlightRank,
  getLeaderboardMini,
  getGolferBottom,
};
