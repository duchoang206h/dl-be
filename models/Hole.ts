const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Hole.init(
    {
      hole_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      course_id: DataTypes.INTEGER,
      hole_num: DataTypes.INTEGER,
      par: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Hole',
      freezeTableName: true,
      tableName: 'holes',
      timestamps: true,
    }
  );
  return Hole;
};
