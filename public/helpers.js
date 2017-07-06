const moment = require('moment');

const dateFormat = 'YYYY-MM-DD';

module.exports = {
  formatToday: function formatToday() {
    return moment().format(dateFormat);
  },
  formatDate: function formatDate(date) {
    return moment(date).format(dateFormat);
  },
};
