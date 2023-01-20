const { Base } = require('./Base');
const Sequelize = require('sequelize');

class Course extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Course.hasMany(models.Score, { as: 'scores', foreignKey: 'course_id', sourceKey: 'course_id' });
    Course.hasMany(models.Round, { as: 'rounds', foreignKey: 'course_id', sourceKey: 'course_id' });
    Course.hasMany(models.Player, { as: 'players', foreignKey: 'course_id', sourceKey: 'course_id' });

    Course.hasMany(models.Hole, { as: 'holes', foreignKey: 'course_id', sourceKey: 'course_id' });
  }
  static init(sequelize) {
    return super.init(
      {
        course_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        type: Sequelize.STRING,
        event_date: Sequelize.STRING,
        total_prize: Sequelize.FLOAT,
        description: Sequelize.STRING,
        total_round: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        total_hole: {
          type: Sequelize.INTEGER,
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
  }
}
module.exports = {
  Course,
};
