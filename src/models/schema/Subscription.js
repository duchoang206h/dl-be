const { Base } = require('./Base');
const Sequelize = require('sequelize');
class Subscription extends Base {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
        Subscription.belongsTo(models.User, {
            as: "user",
            foreignKey: "userId",
            targetKey: "userId"
        })
        Subscription.belongsTo(models.Plan, {
            as: 'plan',
            foreignKey: 'planId',
            targetKey: 'planId'
        })
        Subscription.belongsTo(models.Order, {
            as: 'order',
            foreignKey: 'orderId',
            targetKey: 'orderId'
        })
        Subscription.belongsTo(models.Transaction, {
            as: 'transaction',
            foreignKey: 'transactionId',
            targetKey: 'transactionId'
        })

    }
    static init(sequelize) {
        return super.init(
            {
                subscriptionId: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                },
                userId: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                },
                planId: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                },
                orderId: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                },
                transactionId: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                },
                startDate: {
                    type: Sequelize.FLOAT,
                },
                endDate: {
                    type: Sequelize.FLOAT,
                },
                status: {
                    type: Sequelize.STRING
                }
            },
            {
                sequelize,
                modelName: 'Subscription',
                freezeTableName: true,
                tableName: 'subscriptions',
                timestamps: true,
            }
        );
    }
}
module.exports = {
    Subscription,
};
