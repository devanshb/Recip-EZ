import React, { useState } from 'react';
import axios from 'axios';

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/signup/', {
        username,
        password,
      });
      console.log(response.data);
      window.location.href = '/login';

    } catch (error) {
      console.error('Signup error:', error);
   
    }
  };

  return (
    <div className="signup-container">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Signup</button>
        </form>
    </div>

  );
};
