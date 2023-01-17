const reader = require('xlsx');
const { validate } = require('../utils/validate');
const { BadRequestError, InternalServerError } = require('../utils/ApiError');

// Printing data
/**
 *
 * @param {Buffer} data
 * @param { Object } schema
 */
const getDataFromXlsx = async (data, schema, readAllSheet = false) => {
  try {
    const file = reader.read(data);
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
    // validate input
    console.log(temp);
    for (const data of temp) {
      const validateError = validate(data, schema);
      if (validateError) return [null, new BadRequestError(validateError)];
    }
    return [temp, null];
  } catch (error) {
    return [null, new InternalServerError(error)];
  }
};
module.exports = {
  getDataFromXlsx,
};
