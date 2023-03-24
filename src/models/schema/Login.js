const Sequelize = require('sequelize');
const { Base } = require('./Base');

class Login extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Login.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'userId',
    });
    Login.belongsTo(models.Token, {
      as: 'token',
      foreignKey: 'tokenId',
      targetKey: 'tokenId',
    });
  }

  static init(sequelize) {
    return super.init(
      {
        loginId: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.BIGINT,
        },
        tokenId: {
          type: Sequelize.BIGINT,
        },
        ip: Sequelize.STRING,
        location: Sequelize.STRING,
        device: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'Login',
        freezeTableName: true,
        tableName: 'logins',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  Login,
};
