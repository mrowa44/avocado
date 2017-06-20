const moment = require('moment');

const dateFormat = 'YYYY-MM-DD';

module.exports = {
  formatToday() {
    return moment().format(dateFormat);
  },
  formatDate(date) {
    return moment(date).format(dateFormat);
  },
};
