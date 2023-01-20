const { getScoreType } = require('../utils/score');
const { Player, Hole, Score, Round } = require('./schema');
const { faker } = require('@faker-js/faker');
const putts = [3, 4, 5];
const randomPutt = () => {
  const index = Math.floor(Math.random() * 3);
  return putts[index];
};
const seed = async () => {
  console.log('---------------start');
  let arr = new Array(40).fill(null);
  const players = await Promise.all(
    arr.map(() =>
      Player.create(
        {
          course_id: 1,
          fullname: faker.name.fullName(),
          country: 'VIE',
        },
        { raw: true }
      )
    )
  );
  const holes = await Hole.findAll({ where: { course_id: 1 }, raw: true });
  const rounds = await Round.findAll({ where: { course_id: 1 }, raw: true });
  const promises = [];
  for (const p of players) {
    for (const r of rounds) {
      for (const h of holes) {
        const numputt = randomPutt();
        promises.push(
          Score.create({
            course_id: 1,
            hole_id: h.hole_id,
            round_id: r.round_id,
            num_putt: numputt,
            score_type: getScoreType(numputt, h.par),
            player_id: p.player_id,
          })
        );
      }
    }
  }
  await Promise.all(promises);
  console.log('---------------end');
};
module.exports = { seed };
