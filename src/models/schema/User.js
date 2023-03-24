const { Base } = require('./Base');
const Sequelize = require('sequelize');
class User extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    User.hasMany(models.Order, {
      as: 'orders',
      foreignKey: 'userId',
      sourceKey: 'userId'
    })
    User.hasMany(models.Token, {
      as: 'tokens',
      foreignKey: 'userId',
      sourceKey: 'userId'
    })
    User.hasMany(models.Login, {
      as: 'logins',
      foreignKey: 'userId',
      sourceKey: 'userId'
    })
    User.hasMany(models.Thread, {
      as: 'threads',
      foreignKey: 'userId',
      sourceKey: 'userId'
    })
    User.hasMany(models.Order, {
      as: 'orders',
      foreignKey: 'userId',
      sourceKey: 'userId'
    })
    User.hasMany(models.Transaction, {
      as: 'transactions',
      foreignKey: 'userId',
      sourceKey: 'userId'
    })
    User.hasMany(models.Subscription, {
      as: 'subscriptions',
      foreignKey: 'userId',
      sourceKey: 'userId'
    })

  }
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false
        },
        username: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        role: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'user',
        },
        isSuper: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        }
      },
      {
        sequelize,
        modelName: 'User',
        freezeTableName: true,
        tableName: 'users',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  User,
};
