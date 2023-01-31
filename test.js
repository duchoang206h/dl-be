const getRank = (total, scores) => {
  scores.sort((a, b) => a - b);
  const duplicates = {};
  for (const score of scores) {
    if (duplicates.hasOwnProperty(score)) duplicates[score]++;
    else duplicates[score] = 1;
  }
  const scoresShort = Object.keys(duplicates)
    .map((score) => +score)
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
  console.log({ sum });
  return sum + 1;
};
let players = [
  { total: 13, playerId: 20 },
  { total: 2, playerId: 29 },
  { total: 2, playerId: 25 },
  { total: 4, playerId: 24 },
  { total: 3, playerId: 23 },
  { total: 1, playerId: 21 },
];
const scores = players.map(({ total }) => total);
console.log(getRank(13, scores));
