const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TeeTimeGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TeeTimeGroup.init(
    {
      teetime_group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      course_id: DataTypes.INTEGER,
      round_id: DataTypes.INTEGER,
      group_num: DataTypes.INTEGER,
      tee: DataTypes.INTEGER,
      player_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'TeeTimeGroup',
      freezeTableName: true,
      tableName: 'teetimegroups',
      timestamps: true,
    }
  );
  return TeeTimeGroup;
};
