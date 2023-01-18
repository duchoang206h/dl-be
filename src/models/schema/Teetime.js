const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TeeTime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TeeTime.init(
    {
      course_id: DataTypes.INTEGER,
      round_id: DataTypes.INTEGER,
      golf_course_id: DataTypes.INTEGER,
      tee: DataTypes.INTEGER,
      time: DataTypes.STRING,
      teetime_group_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'TeeTime',
      freezeTableName: true,
      tableName: 'teetimes',
      timestamps: true,
    }
  );
  return TeeTime;
};
