const Joi = require('joi');

const playerSchema = Joi.object({
  Country: Joi.string().required(),
  'Full name': Joi.string().required(),
  Order: Joi.number().required(),
});
module.exports = {
  playerSchema,
};
