const { Base } = require('./Base');
const Sequelize = require('sequelize');

class TeeTimeGroup extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    TeeTimeGroup.belongsTo(models.TeeTime, { foreignKey: 'teetime_group_id', targetKey: 'teetime_group_id' });
    // define association here
    TeeTimeGroup.belongsToMany(models.Player, {
      as: 'players',
      through: { model: models.TeeTimeGroupPlayer },
      foreignKey: 'teetime_group_id',
      otherKey: 'teetime_group_id',
    });
  }
  static init(sequelize) {
    return super.init(
      {
        teetime_group_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        course_id: Sequelize.INTEGER,
        round_id: Sequelize.INTEGER,
        group_num: Sequelize.INTEGER,
      },
      {
        sequelize,
        modelName: 'TeeTimeGroup',
        freezeTableName: true,
        tableName: 'teetimegroups',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  TeeTimeGroup,
};
