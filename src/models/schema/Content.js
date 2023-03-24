const Sequelize = require('sequelize');
const { Base } = require('./Base');

class Content extends Base {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
        Content.belongsTo(models.Document, {
            as: "document",
            foreignKey: 'documentId',
            targetKey: 'documentId'
        })
    }

    static init(sequelize) {
        return super.init(
            {
                contentId: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                },
                documentId: {
                    type: Sequelize.BIGINT,
                },
                url: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                status: {
                    type: Sequelize.STRING,
                },
                location: {
                    type: Sequelize.STRING
                },
                type: {
                    type: Sequelize.STRING
                },
                resource: {
                    type: Sequelize.STRING
                }
            },
            {
                sequelize,
                modelName: 'Content',
                freezeTableName: true,
                tableName: 'contents',
                timestamps: true,
            }
        );
    }
}
module.exports = {
    Content,
};
