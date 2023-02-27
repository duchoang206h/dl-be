const {
  Course,
  User,
  Player,
  Round,
  TeeTimeGroup,
  sequelize,
  TeeTime,
  TeeTimeGroupPlayer,
  MatchPlayTeam,
  MatchPlayClub,
  MatchPlayVersus,
  MatchPlayTeamPlayer,
} = require('../models/schema');
const _ = require('lodash');
const { ApiError, BadRequestError, InternalServerError } = require('../utils/ApiError');
const logger = require('../config/logger');
const { PLAYER_NOT_FOUND, COURSE_TYPE_NOT_FOUND } = require('../utils/errorMessage');
const { PLAYER_STATUS, COURSE_TYPE } = require('../config/constant');
const { Op } = require('sequelize');
const createManyTeetime = async (teetimes, { courseId, roundNum, courseType }) => {
  const t = await sequelize.transaction();
  try {
    if (courseId === COURSE_TYPE.STOKE_PLAY) {
      let groups = [];
      const round = await Round.findOne({ where: { course_id: courseId, round_num: roundNum }, raw: true });
      if (!round) return [false, new BadRequestError()];
      for (const teetime of teetimes) {
        const existGroupIndex = groups.findIndex((group) => group.group_num == teetime.group);
        const player = await Player.findOne({
          where: { fullname: teetime['name-golfer'], course_id: courseId },
          raw: true,
          attributes: ['player_id'],
        });
        if (!player) {
          return [true, new BadRequestError(PLAYER_NOT_FOUND(teetime['name-golfer']))];
        }
        if (existGroupIndex >= 0) {
          groups[existGroupIndex]['group_players'].push({ player_id: player.player_id });
        } else {
          groups.push({
            group_num: teetime.group,
            course_id: courseId,
            round_id: round.round_id,
            group_players: [{ player_id: player.player_id }],
          });
        }
      }
      let _groups = await TeeTimeGroup.bulkCreate(groups, {
        transaction: t,
        include: [{ model: TeeTimeGroupPlayer, as: 'group_players' }],
      });
      let _teetimes = [];
      for (let i = 0; i < teetimes.length; i++) {
        const existGroupIndex = _teetimes.findIndex((teetime) => {
          if (teetime && teetime.group_num == teetimes[i].group) return true;
          return false;
        });
        if (existGroupIndex >= 0) continue;
        let group = _groups.find((group) => {
          return group.group_num == teetimes[i].group;
        });
        //group = group.toJSON();
        _teetimes.push({
          tee: teetimes[i]['tee'],
          time: teetimes[i]['time'],
          course_id: courseId,
          round_id: round.round_id,
          group_num: teetimes[i].group,
          teetime_group_id: group.teetime_group_id,
        });
      }
      await TeeTime.bulkCreate(_teetimes, { transaction: t });
    } else if (courseType === COURSE_TYPE.MATCH_PLAY) {
      const teamVersus = [];
      const matches = _.map(_.uniqBy(teetimes, 'match_num'), 'match_num');
      let clubs = _.map(_.uniqBy(teetimes, 'club'), 'club');
      clubs = await Promise.all(
        clubs.map((c) => MatchPlayClub.findOne({ where: { course_id: courseId, name: c }, raw: true }))
      );
      const clubNameToId = {};
      clubs.forEach((c) => (clubNameToId[c.name] = c.matchplay_club_id));
      teetimes = teetimes.map((t) => ({ ...t, matchplay_club_id: clubNameToId[t.club] }));
      for (let i = 0; i < matches.length; i++) {
        let teams = [];
        for (let j = 0; j < teetimes.length; j++) {
          if (teetimes[j]['match_num'] === matches[i]) teams.push(teetimes[j]);
        }
        let hostTeam = teams.find((t) => clubs.find((c) => c.type === 'host')?.matchplay_club_id === t?.matchplay_club_id);
        const guestTeam = teams.filter((t) => t.club !== hostTeam.club);
        hostTeam = teams.filter((t) => t.club == hostTeam.club);
        console.log({ hostTeam });
        teamVersus.push([hostTeam, guestTeam]);
      }
      await Promise.all(
        teamVersus.map(async (teams) => {
          const createdTeams = await Promise.all(
            teams.map(async (team) => {
              // await MatchPlayTeamPlayer.bulkCreate();
              console.log({ team });
              const players = await Player.findAll({
                where: {
                  course_id: courseId,
                  fullname: {
                    [Op.in]: team.map((t) => t['name-golfer']),
                  },
                },
                attributes: ['player_id'],
                raw: true,
              });
              console.log({ players });
              return MatchPlayTeam.create(
                {
                  matchplay_club_id: team[0]?.matchplay_club_id,
                  match_num: team[0]?.match_num,
                  round_num: roundNum,
                  course_id: courseId,
                  type: team[0]?.type,
                  team_players: players.map((p) => ({ player_id: p.player_id })),
                },

                { transaction: t, include: [{ model: MatchPlayTeamPlayer, as: 'team_players' }], raw: true }
              );
            })
          );
          await MatchPlayVersus.create(
            {
              course_id: courseId,
              round_num: roundNum,
              match_num: teams[0][0]?.match_num,
              type: teams[0][0]?.type,
              tee: teams[0][0]?.tee,
              time: teams[0][0]?.type,
              host: createdTeams[0].dataValues['matchplay_team_id'],
              guest: createdTeams[1].dataValues['matchplay_team_id'],
            },
            { transaction: t }
          );
        })
      );
    } else {
      return [false, new BadRequestError(COURSE_TYPE_NOT_FOUND)];
    }
    await await t.commit();
    return [true, null];
  } catch (error) {
    console.log(error);
    await t.rollback();
    return [false, new InternalServerError()];
  }
};
const getTeetimeByCourseAndRound = async (courseId, roundNum) => {
  const [course, round] = await Promise.all([
    Course.findByPk(courseId),
    Round.findOne({
      where: {
        course_id: courseId,
        round_num: roundNum,
      },

      raw: true,
    }),
  ]);
  if (!course || !round) throw new BadRequestError();
  let teetimes = await TeeTime.findAll({
    where: {
      course_id: courseId,
      round_id: round.round_id,
    },
    include: [
      {
        model: TeeTimeGroup,
        as: 'groups',
        attributes: { exclude: ['createdAt', 'updatedAt'] },

        include: [
          {
            model: TeeTimeGroupPlayer,
            as: 'group_players',
            attributes: { exclude: ['createdAt', 'updatedAt', 'course_id', 'round_id'] },
            include: [
              {
                model: Player,
                as: 'players',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: { status: PLAYER_STATUS.NORMAL },
              },
            ],
          },
        ],
      },
    ],
  });
  teetimes = teetimes.map((teetime) => {
    teetime.toJSON();
    return {
      teetime_group_id: teetime.teetime_group_id,
      tee: teetime.tee,
      time: teetime.time,
      group_num: teetime.groups.group_num,
      players: teetime.groups.group_players.map((player) => player.players),
    };
  });
  return teetimes;
};
module.exports = {
  createManyTeetime,
  getTeetimeByCourseAndRound,
};
