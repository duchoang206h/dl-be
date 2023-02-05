const getFlag = (country) => process.env.APP_URL + '/static/images/country_' + country.toLowerCase() + '.png';
module.exports = {
  getFlag,
};
