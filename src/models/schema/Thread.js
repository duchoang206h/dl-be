const { Base } = require('./Base');
const Sequelize = require('sequelize');
class Thread extends Base {
  /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  static associate(models) {
    // define association here
    Thread.belongsTo(models.User, {
      as: "user",
      foreignKey: 'userId',
      targetKey: 'userId'
    })
    Thread.belongsTo(models.Document, {
      as: 'document',
      foreignKey: 'documentId',
      targetKey: 'documentId',
    })
  }
  static init(sequelize) {
    return super.init(
      {
        threadId: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.BIGINT,
        },
        documentId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING,
        },
      },
      {
        sequelize,
        modelName: 'Thread',
        freezeTableName: true,
        tableName: 'threads',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  Thread,
};
