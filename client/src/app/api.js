import axiosLib from 'axios';

const axios = axiosLib.create({
  baseURL: 'http://localhost:8081/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const signInAPI = (email, password) => {
  const data = {
    "email": email,
    "password": password,
  };
  const defaultData = {
    client_id: 'SeedClient',
    scope: 'user_identity'
  };
  return axios.post('/login', {
    ...data
  });
};