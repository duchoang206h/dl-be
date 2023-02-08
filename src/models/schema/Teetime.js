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
    TeeTime.belongsTo(models.TeeTimeGroup, { foreignKey: 'teetime_group_id', sourceKey: 'teetime_group_id', as: 'groups' });
  }
  static init(sequelize) {
    return super.init(
      {
        course_id: Sequelize.INTEGER,
        round_id: Sequelize.INTEGER,
        teetime_group_id: Sequelize.INTEGER,
        tee: Sequelize.INTEGER,
        time: Sequelize.STRING,
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
