const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Course.init(
    {
      course_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      event_date: DataTypes.STRING,
      total_prize: DataTypes.FLOAT,
      description: DataTypes.STRING,
      total_round: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_hole: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Course',
      freezeTableName: true,
      tableName: 'courses',
      timestamps: true,
    }
  );
  return Course;
};
