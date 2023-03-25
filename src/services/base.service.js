const { Model } = require("sequelize");
const { getLimitRecordReturn } = require("../utils/common");
class BaseService {
    /**
     *
     * @param {Model} model
     */
    constructor(model) {
        this.model = model;
    }
    create = async (data, transaction = null) =>
        this.model.create(data, transaction);
    update = async (where, data, transaction = null) =>
        this.model.update(data, { where, transaction });
    delete = async (where) => this.model.destroy({ where });
    findOne = async (where, attributes = undefined, include = []) =>
        this.model.findOne({
            where,
            attributes,
            include,
        });
    findAll = async (
        where,
        options = {},
        attributes = undefined,
        include = []
    ) => {
        const { offset = 0, limit, order = [["createdAt", "ASC"]] } = options;
        return this.model.findAll({
            where,
            attributes,
            include,
            offset: offset,
            limit: getLimitRecordReturn(limit),
            order: [...order],
        });
    };
    findAndCountAll = async (
        where = null,
        options = {},
        attributes = undefined,
        include = [],
        { nest, raw, plain } = { nest: undefined, raw: undefined, plain: undefined }
    ) => {
        const { offset = 0, limit, order = [["createdAt", "ASC"]] } = options;
        const data = await this.model.findAndCountAll({
            where,
            offset,
            limit: getLimitRecordReturn(limit),
            //order: [...order],
            attributes,
            include,
            nest,
            raw,
            plain,
        });
        return {
            result: data?.rows || [],
            total: data?.count || 0,
            count: data?.rows?.length || 0,
            offset,
        };
    };
}
module.exports = { BaseService }