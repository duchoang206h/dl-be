const Sequelize = require('sequelize');
const { Base } = require('./Base');

class Document extends Base {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
        Document.hasMany(models.Content, {
            as: "contents",
            foreignKey: 'documentId',
            sourceKey: 'documentId'
        })
        Document.hasOne(models.Thread, {
            as: "thread",
            foreignKey: 'documentId',
            sourceKey: 'documentId'
        })
    }

    static init(sequelize) {
        return super.init(
            {
                documentId: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                },
                url: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },

            },
            {
                sequelize,
                modelName: 'Document',
                freezeTableName: true,
                tableName: 'documents',
                timestamps: true,
            }
        );
    }
}
module.exports = {
    Document,
};
