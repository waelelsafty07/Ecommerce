/* eslint-disable*/
import axios from 'axios';
// import { showAlert } from './alert';

const config = (method, url, data) => {
    const settings = {
        method: method,
        url: url,
        headers: {},
        data: data,
    };
    return settings;
};

export const loginBuyer = async(email, password) => {
    try {
        const settings = config('POST', '/api/users/login', {
            email: email,
            password: password,
        });

        const res = await axios(settings);
        if (res.data.status === 'Success') {
            // showAlert('success', 'Login successful');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        console.log( err.response.data.message);
        // showAlert('error', err.response.data.message);
    }
};

export const logOut = async() => {
    try {
        const settings = config('GET', '/api/v1/users/logout');
        const res = await axios(settings);
        location.reload(true);
    } catch (error) {
        showAlert('error', 'Error logging out! Try again');
    }
};

export const forgot = async(email) => {
  try {
      const settings = config('POST', '/api/v1/users/forgotPassword/', {
          email: email,
      });

      const res = await axios(settings);
      if (res.data.status === 'Success') {
          showAlert('success', 'Reset successful');
          window.setTimeout(() => {
              location.assign('/me');
          }, 1500);
      }
  } catch (err) {
      // console.log(err.response.data);
      showAlert('error', err.response.data.message);
  }
};
