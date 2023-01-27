const { writeToXlsx } = require('../services/xlsxService');
const { getScoreType } = require('../utils/score');
const { Player, Hole, Score, Round } = require('./schema');
const { faker } = require('@faker-js/faker');
const putts = [3, 4, 5];
const randomPutt = () => {
  const index = Math.floor(Math.random() * 3);
  return putts[index];
};
const generateTeetime = () => {
  let hours = 7;
  let minutes = 10;
  let group = 1;
  let member = -1;
  let prevGroup = 1;
  return {
    time() {
      if (prevGroup === group) {
        if (minutes < 10) {
          return hours < 10 ? `0${hours}:0${minutes}` : `${hours}:0${minutes}`;
        } else {
          return hours < 10 ? `0${hours}:${minutes}` : `${hours}:${minutes}`;
        }
      } else {
        if (minutes <= 48) {
          minutes = minutes + 11;
          return hours < 10 ? `0${hours}:${minutes}` : `${hours}:${minutes}`;
        } else if (minutes < 59) {
          hours++;
          minutes = minutes + 11 - 60;
          return hours < 10 ? `0${hours}:0${minutes}` : `${hours}:0${minutes}`;
        } else {
          hours++;
          minutes = minutes + 11 - 60;
          return hours < 10 ? `0${hours}:${minutes}` : `${hours}:${minutes}`;
        }
      }
    },
    group() {
      if (member < 2) {
        prevGroup = group;
        member++;
        return group;
      } else {
        group++;
        member = 0;
        return group;
      }
    },
  };
};
const seed = async () => {
  console.log('---------------start');
  let arr = new Array(40).fill(null);
  const players = await Promise.all(
    arr.map(() =>
      Player.create(
        {
          course_id: 4,
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
  /* for (const p of players) {
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
  } */
  await Promise.all(promises);
  console.log('---------------end');
};
const exportXlsx = async () => {
  const teetime = generateTeetime();
  const players = await Player.findAll({ where: { course_id: 1 }, attributes: ['fullname'], raw: true });
  const teetimes = players.map(({ fullname }) => {
    return {
      'name-golfer': fullname,
      group: teetime.group(),
      tee: 1,
      time: teetime.time(),
    };
  });
  writeToXlsx(teetimes, __dirname + '/teetime_round_1.xlsx');
};
module.exports = { seed, exportXlsx };
