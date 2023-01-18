const { Model } = require('sequelize');
class Base extends Model {
  static getAllWithPaging({
    page,
    limit,
    where = {},
    include = [],
    attributes,
    distinct = 'id',
    order = [['createdAt', 'ASC']],
  }) {
    const options = {
      order,
      where,
      include,
      attributes,
      distinct,
      raw: true,
    };

    if (limit && page) {
      options.limit = +limit;
      options.offset = (page - 1) * limit;
    }
    return this.findAndCountAll(options);
  }
}
module.exports = { Base };
