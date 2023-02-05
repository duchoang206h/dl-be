const getFlag = (country) => process.env.APP_URL + '/static/images/' + country.toLowerCase() + '.png';
module.exports = {
  getFlag,
};
