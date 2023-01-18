const { Base } = require('./Base');
const Sequelize = require('sequelize');

class TeeTime extends Base {
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
        course_id: Sequelize.INTEGER,
        round_id: Sequelize.INTEGER,
        golf_course_id: Sequelize.INTEGER,
        tee: Sequelize.INTEGER,
        time: Sequelize.STRING,
        teetime_group_id: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'TeeTime',
        freezeTableName: true,
        tableName: 'teetimes',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  TeeTime,
};
