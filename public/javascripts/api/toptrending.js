/* eslint-disable*/
import axios from 'axios';

const config = (method, url) => {
  const settings = {
      method: method,
      url: url,
  };
  return settings;
};

export const GetTrend = async () => {
  try {
    const url = `/api/products/best-products`;

    const settings = config('get', url );
    // console.log(settings);
    const res = await axios(settings);
    if (res.data.status === 'Success') {
        return res.data;
        // showAlert('success', 'added successful');
    }
} catch (err) {
    // console.log(err.response.data);
    // showAlert('error', err.response.data.message);
}
};
