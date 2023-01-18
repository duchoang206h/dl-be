const validate = (object, schema) => {
  const { error } = schema.validate(object);
  if (error) return error;
  return null;
};
module.exports = {
  validate,
};
