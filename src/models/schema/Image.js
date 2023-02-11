const { Base } = require('./Base');
const Sequelize = require('sequelize');
const { Course } = require('./Course');

class Image extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Image.belongsTo(models.Course, { foreignKey: 'course_id', sourceKey: 'course_id' });
  }
  static init(sequelize) {
    return super.init(
      {
        image_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        course_id: {
          type: Sequelize.INTEGER,
        },
        type: {
          type: Sequelize.STRING,
        },
        path: {
          type: Sequelize.STRING,
        },
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return process.env.APP_URL + '/static/images/' + this.path;
          },
        },
      },
      {
        sequelize,
        modelName: 'Image',
        freezeTableName: true,
        tableName: 'images',
        timestamps: true,
        indexes: [{ fields: ['course_id', 'type'] }],
      }
    );
  }
}
module.exports = {
  Image,
};
