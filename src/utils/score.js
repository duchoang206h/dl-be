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
  let sumPutt = 0;
  for (const [key, value] of Object.entries(statisticObject)) {
    sumPutt += value;
  }
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
  return sumPutt == 0 ? 0 : +(sumScore / sumPutt).toFixed(2);
};
const getScoreImage = (images, scoreType) => {
  let imageUrl = null;
  console.log({ scoreType });
  switch (scoreType) {
    case SCORE_TYPE.EAGLE: {
      const image = images.find((img) => {
        let type = img.type;
        if (type.includes('eagle_color')) return true;
        return false;
      });
      imageUrl = image?.url;
      break;
    }
    case SCORE_TYPE.BIRDIE: {
      const image = images.find((img) => {
        let type = img.type;
        if (type.includes('birdie_color')) return true;
        return false;
      });
      imageUrl = image?.url;
      break;
    }
    case SCORE_TYPE.BIRDIE: {
      const image = images.find((img) => {
        let type = img.type;
        if (type.includes('birdie_color')) return true;
        return false;
      });
      imageUrl = image?.url;
      break;
    }
    case SCORE_TYPE.PAR: {
      const image = images.find((img) => {
        let type = img.type;
        if (type.includes('par_color')) return true;
        return false;
      });
      imageUrl = image?.url;
      break;
    }
    case SCORE_TYPE.BOGEY: {
      const image = images.find((img) => {
        let type = img.type;
        if (type.includes('bogey_color')) return true;
        return false;
      });
      imageUrl = image?.url;
      break;
    }
    case SCORE_TYPE.D_BOGEY: {
      const image = images.find((img) => {
        let type = img.type;
        if (type.includes('double_bogey_color')) return true;
        return false;
      });
      imageUrl = image?.url;
      break;
    }
  }
  return imageUrl;
};
const getTotalOverImage = (images, totalOver) => {
  let imageUrl = null;
  if (totalOver == 0) {
    const image = images.find((img) => img.type.includes('equal_score'));
    imageUrl = image?.url;
  } else if (totalOver > 0) {
    const image = images.find((img) => img.type.includes('positive_score'));
    imageUrl = image?.url;
  } else {
    const image = images.find((img) => img.type.includes('negative_score'));
    imageUrl = image?.url;
  }
  return imageUrl;
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
//1 1
//2 2
//2 3
//2/4
//2 4
//5
// ranks  { 1: 1, 2: 2, 3: 2 }
// [2,2,1]
const getTop = (pos, ranking, ranks) => {
  if (ranks.length === 3) {
    if (ranking) return ranking;
    if (!ranking) {
      const index = ranks.findIndex((r) => r == pos);
      if (index < 0) return pos;
      return ranks.length + 1;
    }
  }
  return pos;
};
const previousRankCount = (i, duplicates, scoresShort) => {
  let sum = 0;
  for (let j = 0; j < i; j++) {
    sum += duplicates[scoresShort[j]];
  }
  return sum + 1;
};
/// [1,2,3,4] 6
const getDefaultScore = (scores) => {
  let cloneScores = [...scores];
  cloneScores.sort((a, b) => a.Hole.hole_num - b.Hole.hole_num);
  const scoreReach = cloneScores.length;
  if (scoreReach < 18) {
    for (let i = cloneScores.length + 1; i <= 18; i++) {
      cloneScores.push({
        Hole: {
          hole_num: i,
        },
        num_putt: 0,
        score_type: null,
      });
    }
    return cloneScores;
  }
  return cloneScores;
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
  getDefaultScore,
  getScoreImage,
  getTotalOverImage,
  getTop,
};