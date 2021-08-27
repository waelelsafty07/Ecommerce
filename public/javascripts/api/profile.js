/* eslint-disable*/
import axios from 'axios';

const config = (method, url, data) => {
  const settings = {
      method: method,
      url: url,
      headers: {},
      data: data,
  };
  return settings;
};

export const editeProfile = async(data) => {
  try {
      const url = `/api/users/updateMyData`;
          
      const settings = config('patch', url, data);
      // console.log(settings);
      const res = await axios(settings);
      if (res.data.status === 'Success') {
          // showAlert('success', 'added successful');
          console.log('done');
        }
  } catch (err) {
      console.log(err.response.data);
      //  showAlert('error', err.response.data);
      // showAlert('error', err.response.data.message);
      //console.log(err.response.data.message + "ssss");
  }
};

