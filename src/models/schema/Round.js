const { Base } = require('./Base');
const Sequelize = require('sequelize');

class Round extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Round.hasMany(models.Score, { as: 'scores', foreignKey: 'round_id', sourceKey: 'round_id' });
    Round.belongsTo(models.Course, {
      foreignKey: 'course_id',
      targetKey: 'course_id',
    });
  }
  static init(sequelize) {
    return super.init(
      {
        round_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        course_id: Sequelize.INTEGER,
        round_num: Sequelize.INTEGER,
        finished: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'Round',
        freezeTableName: true,
        tableName: 'rounds',
        timestamps: true,
        indexes: [
          {
            fields: ['course_id', 'round_num'],
          },
        ],
      }
    );
  }
}
module.exports = {
  Round,
};
