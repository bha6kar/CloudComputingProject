import axiosLib from 'axios';
var querystring = require('querystring');

const axios = axiosLib.create({
  baseURL: 'http://0.0.0.0:4000/',
  timeout: 10000,
  headers: {
    "content-type": "application/json",
  },
});


export const signInAPI = (email, password) => {
  const data = {
    "email": email,
    "password": password,
  };

  return axios.post('/auth', JSON.stringify({ data }));
};

export const auth = (email, password) => {

  return fetch('http://0.0.0.0:4000/auth', {
    headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then(result => result.json())
    .then(data => {
      if (data.ok) {
        localStorage.setItem('todo-app-user', data.data);
        return data.data;
      }
    });
};