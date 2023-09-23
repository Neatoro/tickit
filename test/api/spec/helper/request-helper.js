const axios = require('axios');

const baseUrl = 'http://localhost:5000';

module.exports = function request({ method, url, data = {} }) {
  return axios({
    method,
    url: `${baseUrl}${url}`,
    data,
    validateStatus: false
  });
};
