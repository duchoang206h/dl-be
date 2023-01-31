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
const getRank = (total, scores) => {
  scores.sort((a, b) => a - b);
  const duplicates = {};
  for (const score of scores) {
    if (duplicates.hasOwnProperty(score)) duplicates[score]++;
    else duplicates[score] = 1;
  }
  const scoresShort = Object.keys(duplicates)
    .map((score) => Number(score))
    .sort((a, b) => a - b);
  const ranks = {};
  for (let i = 0; i < scoresShort.length; i++) {
    ranks[scoresShort[i]] = i == 0 ? 1 : previousRankCount(i, duplicates, scoresShort);
  }
  return ranks[total];
};
const previousRankCount = (i, duplicates, scoresShort) => {
  let sum = 0;
  for (let j = 0; j < i; j++) {
    sum += duplicates[scoresShort[j]];
  }
  return sum + 1;
};
//[1, 2, 3, 6, 3, 4, 3, 2];
// [1,2,2,3,3,3,4,6]
// { 1:1, 2:2, 3:3, 4;1, 6:1 }
// 1->1
// 2->2 2
//3->4 4 4 4
// 4-> 8
// 6->9
module.exports = {
  getScoreType,
  calculateScoreAverage,
  getRank,
};
