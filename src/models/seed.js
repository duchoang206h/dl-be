const { COUNTRY, PLAYER_LEVEL } = require('../config/constant');
const { writeToXlsx } = require('../services/xlsxService');
const { hashPassword } = require('../utils/hash');
const { getScoreType } = require('../utils/score');
const { Player, Hole, Score, Round, User, GolfCourse } = require('./schema');
const { faker } = require('@faker-js/faker');
const path = require('path');
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
  try {
    console.log('---------------start');
    /* await User.create({
      username: 'duchoang206h',
      password: hashPassword('123456'),
      is_super: true,
      role: 'admin',
    });
    await GolfCourse.create({
      name: 'San golf 1',
      address: 'Da Nang',
      total_hole: 18,
      total_par: 72,
      slope: 120,
    }); */
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
    const holes = await Hole.findAll({ where: { golf_course_id: 1 }, raw: true });
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
  } catch (error) {
    console.log(error);
  }
};
const exportTeetimeXlsx = async (courseId) => {
  const teetime = generateTeetime();
  const players = await Player.findAll({ where: { course_id: courseId }, attributes: ['fullname'], raw: true });
  const teetimes = players.map(({ fullname }) => {
    return {
      'name-golfer': fullname,
      flight: teetime.group(),
      tee: 1,
      time: teetime.time(),
    };
  });
  writeToXlsx(teetimes, __dirname + '/teetime.xlsx');
};
const exportPlayerXlsx = async (totalPlayer) => {
  let players = new Array(totalPlayer).fill(null);

  players = players.map(() => {
    return {
      'name-golfer': faker.name.fullName(),
      country: COUNTRY[Math.floor(Math.random() * (COUNTRY.length - 1 + 1))].code,
      age: faker.datatype.number({ max: 30, min: 20 }),
      sex: faker.datatype.number({ max: 1, min: 0 }),
      code: null, //Date.now().toString() + Math.floor(Math.random() * (10000 - 1 + 1)),
      club: null,
      group: null,
      avatar: null,
      status_day: null,
      note: null,
      birth: null,
      height: null,
      weight: null,
      driverev: null,
      putting: null,
      best: null,
      is_show: null,
      birthplace: null,
      level: [PLAYER_LEVEL.AMATEUR, PLAYER_LEVEL.PROFESSIONAL][faker.datatype.number({ max: 1, min: 0 })],
      vga: null,
    };
  });
  writeToXlsx(players, __dirname + '/player.xlsx');
};
const exportPlayerByCourseId = async (courseId) => {
  let players = await Player.findAll({
    where: { course_id: courseId },
    raw: true,
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  });
  players = players.map((player, i) => {
    return {
      stt: i + 1,
      'name-golfer': player.fullName,
      vga: player.vga,
    };
  });
  writeToXlsx(players, path.resolve(__dirname));
};
module.exports = { seed, exportPlayerXlsx, exportTeetimeXlsx, exportPlayerByCourseId };
