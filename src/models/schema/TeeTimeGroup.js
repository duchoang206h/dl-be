const { Base } = require('./Base');
const Sequelize = require('sequelize');

class TeeTimeGroup extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
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
        tee: Sequelize.INTEGER,
        player_id: Sequelize.STRING,
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
