const moment = require('moment');
const dateWithTimezone = (date = null, format = 'MM/DD/YYYY', timezone = 'Asia/Ho_Chi_Minh') => {
  if (date) return moment(date, format).tz(timezone).format(format);
  else return moment().tz(timezone).format(format);
};

module.exports = {
  dateWithTimezone,
};
