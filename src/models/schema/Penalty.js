const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Penalty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Penalty.init(
    {
      course_id: DataTypes.INTEGER,
      player_id: DataTypes.INTEGER,
      round_id: DataTypes.INTEGER,
      hole_id: DataTypes.INTEGER,
      num_putt: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Penalty',
      freezeTableName: true,
      tableName: 'penalties',
      timestamps: true,
    }
  );
  return Penalty;
};
