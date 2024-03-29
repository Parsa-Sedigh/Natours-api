/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      // url: 'http://127.0.0.1:3000/api/v1/users/login',
      url: '/api/v1/users/login',
      data: { email, password },
      withCredentials: true
    });
    // console.log(res);

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully.');

      // this will get called after user closes the alert:
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
   console.log('error is: ', err.response?.data);
   showAlert('error', err.response?.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
      credentials: 'include'
    });
    if (res.data.status === 'success') window.location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
