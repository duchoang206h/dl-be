const XLSX = require('xlsx');
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
    const file = XLSX.read(data);
    const temp = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
    // validate input
    console.log(temp);
    for (const data of temp) {
      const validateError = validate(data, schema);
      if (validateError) return [null, new BadRequestError(validateError)];
    }
    return [temp, null];
  } catch (error) {
    console.log(error);
    return [null, new InternalServerError(error)];
  }
};
const writeToXlsx = async (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet);
  XLSX.writeFile(workbook, fileName);
};
module.exports = {
  getDataFromXlsx,
  writeToXlsx,
};
