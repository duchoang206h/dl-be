const { Base } = require('./Base');
const Sequelize = require('sequelize');

class Token extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Token.hasMany(models.Login, {
      as: 'token_logins',
      foreignKey: 'tokenId',
      sourceKey: 'tokenId'
    })
    Token.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'userId'
    })
  }
  static init(sequelize) {
    return super.init(
      {
        tokenId: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.BIGINT,
        },
        type: Sequelize.STRING,
        whitelist: Sequelize.BOOLEAN,
        token: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'Token',
        freezeTableName: true,
        tableName: 'tokens',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  Token,
};
