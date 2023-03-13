const { PLAYER_STATUS, PLAYER_LEVEL } = require('../../config/constant');
const { getFlag } = require('../../utils/country');
const { Base } = require('./Base');
const Sequelize = require('sequelize');

class MatchPlayTeam extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    MatchPlayTeam.belongsTo(models.MatchPlayClub, {
      as: 'club',
      foreignKey: 'matchplay_club_id',
      targetKey: 'matchplay_club_id',
    });
    MatchPlayTeam.hasMany(models.MatchPlayTeamPlayer, {
      foreignKey: 'matchplay_team_id',
      sourceKey: 'matchplay_team_id',
      as: 'team_players',
    });
    MatchPlayTeam.belongsTo(models.MatchPlayVersus, {
      as: 'host',
      foreignKey: 'matchplay_team_id',
      targetKey: 'host',
    });
    MatchPlayTeam.belongsTo(models.MatchPlayVersus, {
      as: 'guest',
      foreignKey: 'matchplay_team_id',
      targetKey: 'guest',
    });
  }
  static init(sequelize) {
    return super.init(
      {
        matchplay_team_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        matchplay_club_id: Sequelize.INTEGER,
        match_num: Sequelize.INTEGER,
        round_num: Sequelize.INTEGER,
        course_id: Sequelize.INTEGER,
        type: Sequelize.STRING,
        total_player: Sequelize.INTEGER,
      },
      {
        sequelize,
        modelName: 'MatchPlayTeam',
        freezeTableName: true,
        tableName: 'matchplayteams',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  MatchPlayTeam,
};
