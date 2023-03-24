const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const { Content } = require('./Content');
const { Document } = require('./Document');
const { Login } = require('./Login');
const { Order } = require('./Order');
const { Plan } = require('./Plan');
const { Subscription } = require('./Subscription');
const { Thread } = require('./Thread');
const { Token } = require('./Token');
const { Transaction } = require('./Transaction');
const { User } = require('./User');
const db = {};
const models = {
  User,
  Token,
  Plan,
  Subscription,
  Thread,
  Transaction,
  Content,
  Login,
  Order,
  Document,

};
const sequelize = new Sequelize(process.env.DB_URL, { dialect: 'mysql', logging: false });
Object.keys(models).forEach((x) => {
  models[x].init(sequelize);
});
Object.keys(models).forEach((x) => {
  try {
    models[x].associate(models);
  } catch (error) {
    console.log(error);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
