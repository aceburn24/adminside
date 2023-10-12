import React, { useState } from 'react';
import axios from 'axios';  // Make sure to install axios if you haven't

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const res = await axios.post('http://localhost:8000/api/login', { email, password }, config);
      
      console.log(res.data);  
    } catch (err) {
      console.error(err);  // Handle errors here
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
