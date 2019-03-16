import axiosLib from 'axios';

const axios = axiosLib.create({
  baseURL: 'https://staging-api.district-tech.com/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const signInAPI = (email, password) => {
  const data = {
    "username": email,
    "password": password,
    "grant_type": "password",
  };
  const defaultData = {
    client_id: 'SeedClient',
    scope: 'user_identity'
  };
  return axios.post('/oauth/v2/token', {
    ...data,
    ...defaultData
  });
};