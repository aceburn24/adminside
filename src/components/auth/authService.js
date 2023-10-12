import axios from 'axios';

export const login = async (email, password) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('http://localhost:8000/api/login', body, config);
    if (res.data) {
      localStorage.setItem('token', res.data.token); // Assuming the token is in res.data.token
      return res.data;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const logout = () => {
  // Call your API to invalidate the token here
  localStorage.removeItem('token');
};
