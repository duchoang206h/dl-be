const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Round extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Round.init(
    {
      round_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      course_id: DataTypes.INTEGER,
      round_num: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Round',
      freezeTableName: true,
      tableName: 'rounds',
      timestamps: true,
    }
  );
  return Round;
};
