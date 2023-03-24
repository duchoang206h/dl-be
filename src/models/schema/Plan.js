const { Base } = require('./Base');
const Sequelize = require('sequelize');
class Plan extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Plan.hasMany(models.Order, {
      as: 'orders',
      foreignKey: 'plainId',
      sourceKey: 'planId'
    })
    Plan.hasMany(models.Order, {
      as: 'orders',
      foreignKey: 'planId',
      sourceKey: 'planId'
    })
    Plan.hasMany(models.Subscription, {
      as: 'subscriptions',
      foreignKey: 'planId',
      sourceKey: 'planId'
    })

  }
  static init(sequelize) {
    return super.init(
      {
        planId: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
        },
        priceMonth: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        priceYear: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        discountMonth: {
          type: Sequelize.FLOAT,
        },
        discountYear: {
          type: Sequelize.FLOAT,
        },
        description: {
          type: Sequelize.STRING
        }
      },
      {
        sequelize,
        modelName: 'Plan',
        freezeTableName: true,
        tableName: 'plans',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  Plan,
};
