const Sequelize = require('sequelize');
const { Base } = require('./Base');
const { yardToMeter } = require('../../utils/convert');

class Hole extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Hole.hasMany(models.Score, { as: 'scores', foreignKey: 'hole_id', sourceKey: 'hole_id' });
  }

  static init(sequelize) {
    return super.init(
      {
        hole_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        course_id: Sequelize.INTEGER,
        hole_num: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        par: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        yards: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        meters: {
          type: Sequelize.VIRTUAL,
          get() {
            return yardToMeter(this.yards);
          },
        },
      },
      {
        sequelize,
        modelName: 'Hole',
        freezeTableName: true,
        tableName: 'holes',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  Hole,
};
