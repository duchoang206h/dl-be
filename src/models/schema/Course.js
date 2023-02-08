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
    Course.hasMany(models.Score, { as: 'images', foreignKey: 'course_id', sourceKey: 'course_id' });
    Course.belongsTo(models.GolfCourse, { as: 'golf_course', foreignKey: 'golf_course_id', targetKey: 'golf_course_id' });
  }
  static init(sequelize) {
    return super.init(
      {
        course_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        golf_course_id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        type: Sequelize.STRING,
        total_prize: Sequelize.FLOAT,
        description: Sequelize.STRING,
        total_round: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        event_date: Sequelize.STRING,
        start_date: Sequelize.DATEONLY,
        end_date: Sequelize.DATEONLY,
        logo: Sequelize.STRING,
        logo_url: {
          type: Sequelize.VIRTUAL,
          get() {
            return process.env.APP_URL + '/static/images/' + this.logo;
          },
        },
        address: Sequelize.STRING,
        main_photo: Sequelize.STRING,
        main_photo_url: {
          type: Sequelize.VIRTUAL,
          get() {
            return process.env.APP_URL + '/static/images/' + this.main_photo;
          },
        },
        color: Sequelize.STRING,
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
