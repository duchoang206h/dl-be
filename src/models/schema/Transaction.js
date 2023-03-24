const { Base } = require('./Base');
const Sequelize = require('sequelize');
class Transaction extends Base {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
        Transaction.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
            targetKey: 'userId'
        })
        Transaction.belongsTo(models.Order, {
            as: 'order',
            foreignKey: 'orderId',
            targetKey: 'orderId'
        })
    }
    static init(sequelize) {
        return super.init(
            {
                transactionId: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                },
                userId: {
                    type: Sequelize.STRING,
                },
                orderId: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                fee: {
                    type: Sequelize.FLOAT,
                    defaultValue: 0
                },
                total: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                status: {
                    type: Sequelize.STRING
                },
                error: {
                    type: Sequelize.STRING
                }
            },
            {
                sequelize,
                modelName: 'Transaction',
                freezeTableName: true,
                tableName: 'transactions',
                timestamps: true,
            }
        );
    }
}
module.exports = {
    Transaction,
};
