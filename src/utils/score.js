const { SCORE_TYPE, COURSE_TYPE, HOLE_PER_COURSE } = require('../config/constant');

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
      console.log(image);
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
  console.log(imageUrl);
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
const getScoreTitle = (score, par) => {
  let title = '';
  const distance = score - par;
  if (distance <= -2) title = 'FOR EAGLE';
  else if (distance === -1) title = 'FOR BIRDIE';
  else if (distance === 0) title = 'FOR PAR';
  else if (distance === 1) title = 'FOR BOGEY';
  else if (distance >= 2) title = 'FOR DOUBLE BOGEY+';
  return title;
};
const getMatchPlayScore = (hostPlayers, guestPlayers, type, startHole = 1) => {
  const host = [];
  const guest = [];
  let score = 0;
  if (type === COURSE_TYPE.FOUR_BALL || type === COURSE_TYPE.FOURSOME) {
    for (let i = 0; i < hostPlayers[0]?.scores.length; i++) {
      const betterScoreHost =
        hostPlayers[0]?.scores[i]?.num_putt < hostPlayers[1]?.scores[i]?.num_putt
          ? hostPlayers[0]?.scores[i]?.num_putt
          : hostPlayers[1]?.scores[i]?.num_putt;
      const betterScoreGuest =
        guestPlayers[0]?.scores[i]?.num_putt < guestPlayers[1]?.scores[i]?.num_putt
          ? guestPlayers[0]?.scores[i]?.num_putt
          : guestPlayers[1]?.scores[i]?.num_putt;
      console.log({ betterScoreGuest, betterScoreHost });
      host.push(betterScoreHost);
      guest.push(betterScoreGuest);
    }
    for (let i = 0; i < hostPlayers[0]?.scores.length; i++) {
      if (host[i] !== null && guest[i] !== null) {
        if (host[i] < guest[i]) score += 1;
        if (host[i] > guest[i]) score -= 1;
      }
    }
  }
  if (type === COURSE_TYPE.SINGLE_MATCH) {
    for (let i = 0; i < hostPlayers[0]?.scores.length; i++) {
      if (hostPlayers[0]?.scores[i]?.num_putt !== null && guestPlayers[0]?.scores[i]?.num_putt !== null) {
        if (hostPlayers[0]?.scores[i]?.num_putt < guestPlayers[0]?.scores[i]?.num_putt) score += 1;
        if (hostPlayers[0]?.scores[i]?.num_putt > guestPlayers[0]?.scores[i]?.num_putt) score -= 1;
      }
    }
  }
  return score;
};
const getMatchPlayHostScore = (matches, type = 'host') => {
  let win = 0,
    draw = 0,
    score = 0,
    lose = 0;
  if (type === 'host') {
    matches.forEach((m) => {
      if (m.score > 0) {
        score += 1;
        win++;
      }
      if (m.score == 0) {
        score += 0.5;
        draw++;
      }
      if (m.score < 0) lose++;
    });
  }
  if (type === 'guest') {
    matches.forEach((m) => {
      if (m.score < 0) {
        score += 1;
        win++;
      }
      if (m.score === 0) {
        score += 0.5;
        draw++;
      }
      if (m.score > 0) lose++;
    });
  }
  return {
    draw,
    win,
    lose,
    score,
  };
};
const normalizePlayersMatchScore = (players, type) => {
  let scores = [];
  if (type === COURSE_TYPE.FOURSOME) {
    for (let i = 1; i <= 18; i++) {
      let score =
        players[0].scores.find((s) => s?.Hole?.hole_num === i) ?? players[1].scores.find((s) => s?.Hole?.hole_num === i);
      score = score ?? { num_putt: null, Hole: { hole_num: i } };
      if (score) {
        scores.push(score);
      }
    }
    players[0].scores = scores;
    players[1].scores = scores;
  }
  if (type === COURSE_TYPE.SINGLE_MATCH) {
    for (let i = 1; i <= 18; i++) {
      let score = players[0].scores.find((s) => s?.Hole?.hole_num === i) ?? { num_putt: null, Hole: { hole_num: i } };
      if (score) {
        scores.push(score);
      }
    }
    players[0].scores = scores;
  }
  if (type === COURSE_TYPE.FOUR_BALL) {
    let firstScores = [];
    let secondScores = [];
    for (let i = 1; i <= 18; i++) {
      let firstScore = players[0].scores.find((s) => s?.Hole?.hole_num === i);
      firstScore = firstScore ?? { num_putt: null, Hole: { hole_num: i } };
      firstScores.push(firstScore);
      let secondScore = players[1].scores.find((s) => s?.Hole?.hole_num === i);
      secondScore = secondScore ?? { num_putt: null, Hole: { hole_num: i } };
      secondScores.push(secondScore);
    }
    players[0].scores = firstScores;
    players[1].scores = secondScores;
  }
  return players;
};
const getLeaveHoles = (player) => {
  let leaveHoles = [];
  leaveHoles = player.scores.filter((s) => s?.num_putt === 0);
  leaveHoles = leaveHoles.map((s) => s?.Hole?.hole_num);
  return leaveHoles.sort((a, b) => a - b);
};
const getPreviousRoundNum = (r) => {
  const rounds = [];
  for (let i = 1; i <= r; i++) {
    rounds.push(i);
  }
  return rounds;
};
const formatMatchPlayScore = (score, leaveHoles) => {
  let scoreStr = '';
  if (score > 0) {
    if (leaveHoles > 0) scoreStr = `${score}&${leaveHoles}`;
    else scoreStr = `${score}UP`;
  } else scoreStr = 'AS';
  return scoreStr;
};
const isScoreMatchPlay = (host, guest) => {
  let isScore = true;
  let scores = [
    host[0]?.scores.filter((s) => s?.num_putt > 0).length,
    host[1]?.scores.filter((s) => s?.num_putt > 0).length,
    guest[0]?.scores.filter((s) => s?.num_putt > 0).length,
    guest[1]?.scores.filter((s) => s?.num_putt > 0).length,
  ];
  if (scores.includes(0)) isScore = false;
  return isScore;
};
module.exports = {
  getScoreType,
  calculateScoreAverage,
  getRank,
  getDefaultScore,
  getScoreImage,
  getTotalOverImage,
  getTop,
  getScoreTitle,
  getMatchPlayScore,
  getMatchPlayHostScore,
  normalizePlayersMatchScore,
  getLeaveHoles,
  getPreviousRoundNum,
  formatMatchPlayScore,
  isScoreMatchPlay,
};
