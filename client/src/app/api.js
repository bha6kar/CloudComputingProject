import axiosLib from 'axios';
var querystring = require('querystring');

const axios = axiosLib.create({
  baseURL: 'http://localhost:8081/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

export const signInAPI = (email, password) => {
  const data = {
    "email": email,
    "password": password,
  };

  return axios.post('/login', querystring.stringify(data));
};