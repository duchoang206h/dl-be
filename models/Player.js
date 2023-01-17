const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Player.init(
    {
      player_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      course_id: DataTypes.INTEGER,
      fullname: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Player',
      freezeTableName: true,
      tableName: 'players',
      timestamps: true,
    }
  );
  return Player;
};
