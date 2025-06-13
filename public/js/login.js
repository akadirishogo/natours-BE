/* eslint-disable */
import { showAlert } from './alerts';

export const login = async (email, password) => {
  console.log('logging in...')
  try {
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    console.log(res)
    const data = await res.json();

    if (res.ok && data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (err) {
    showAlert('error', err);
  }
};

export const logout = async () => {
  try {
    const res = await fetch('/api/v1/users/logout', {
      method: 'GET',
      credentials: 'include' // Important if you're using cookies for auth
    });

    const data = await res.json();

    if (res.ok && data.status === 'success') {
      location.reload(true);
    } else {
      throw new Error(data.message || 'Logout failed');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error logging out! Try again.');
  }
};
