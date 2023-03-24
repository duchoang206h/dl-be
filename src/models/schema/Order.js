const Sequelize = require('sequelize');
const { Base } = require('./Base');

class Order extends Base {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
        Order.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
            targetKey: 'userId'
        })
        Order.belongsTo(models.Plan, {
            as: 'plan',
            foreignKey: 'planId',
            targetKey: 'planId'
        })
        Order.hasMany(models.Transaction, {
            as: 'transactions',
            foreignKey: 'orderId'
        })
    }

    static init(sequelize) {
        return super.init(
            {
                orderId: {
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
                discount: {
                    type: Sequelize.FLOAT,
                    defaultValue: 0,
                },
                price: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                total: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                status: {
                    type: Sequelize.STRING,
                },
                error: {
                    type: Sequelize.STRING,
                },
            },
            {
                sequelize,
                modelName: 'Order',
                freezeTableName: true,
                tableName: 'orders',
                timestamps: true,
            }
        );
    }
}
module.exports = {
    Order,
};
