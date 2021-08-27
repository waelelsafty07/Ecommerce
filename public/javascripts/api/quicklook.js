/* eslint-disable*/
import axios from 'axios';

const config = (method, url) => {
  const settings = {
      method: method,
      url: url,
  };
  return settings;
};

export const Quicklook= async (id) => {
  try {
    const url = `/api/products/${id}`;

    const settings = config('get', url );
    console.log(settings);
    const res = await axios(settings);
    if (res.data.status === 'Success') {
      console.log(res.data.data);
        return res.data.data
        // console.log(res);
        // showAlert('success', 'added successful');
    }
} catch (err) {
    console.log(err);
    // showAlert('error', err.response.data.message);
}
};
