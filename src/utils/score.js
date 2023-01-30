const { SCORE_TYPE } = require('../config/constant');

const getScoreType = (score, par) => {
  let scoreType;
  switch (score - par) {
    case 0:
      scoreType = SCORE_TYPE.PAR;
      break;
    case -1:
      scoreType = SCORE_TYPE.BIRDIE;
      break;
    case -2:
      scoreType = SCORE_TYPE.EAGLE;
      break;
    case -3:
      scoreType = SCORE_TYPE.EAGLE;
      break;
    case -4:
      scoreType = SCORE_TYPE.EAGLE;
      break;
    case -5:
      scoreType = SCORE_TYPE.EAGLE;
      break;
    case 1:
      scoreType = SCORE_TYPE.BOGEY;
      break;
    case 2:
      scoreType = SCORE_TYPE.D_BOGEY;
      break;
    default:
      scoreType = SCORE_TYPE.D_BOGEY;
      break;
  }
  return scoreType;
};
const calculateScoreAverage = (holePar, statisticObject, totalPlayer) => {
  let sumScore = 0;
  for (const [key, value] of Object.entries(statisticObject)) {
    switch (key) {
      case SCORE_TYPE.PAR:
        sumScore += holePar * value;
        break;
      case SCORE_TYPE.BIRDIE:
        sumScore += (holePar - 1) * value;
        break;
      case SCORE_TYPE.EAGLE:
        sumScore += (holePar - 2) * value;

        break;
      case SCORE_TYPE.BOGEY:
        sumScore += (holePar + 1) * value;
        break;
      case SCORE_TYPE.D_BOGEY:
        sumScore += (holePar + 2) * value;
        break;
      default:
        sumScore += (holePar + 2) * value;
        break;
    }
  }
  return +(sumScore / totalPlayer).toFixed(2);
};
module.exports = {
  getScoreType,
  calculateScoreAverage,
};
