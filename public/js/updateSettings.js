/* eslint-disable */
import { showAlert } from './alerts';


// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  console.log('Updating...');
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    let options = {
      method: 'PATCH',
      credentials: 'include' // If cookies are involved
    };



    if (type === 'data') {
      // FormData case: do not set Content-Type (browser handles it)
      options.body = data;
    } else {
      // JSON body for password update
      options.headers = {
        'Content-Type': 'application/json'
      };
      options.body = JSON.stringify(data);
    }

    const res = await fetch(url, options);
    const resData = await res.json();

    if (res.ok && resData.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    } else {
      throw new Error(resData.message || 'Update failed');
    }
  } catch (err) {
    showAlert('error', err.message || 'Something went wrong');
  }
};
