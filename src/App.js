// App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [token, setToken] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [formType, setFormType] = useState('signup');

  const handleSignup = async () => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);

      if (profileImage) {
        formData.append('file', profileImage);
      }

      const response = await axios.post('http://localhost:3000/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setToken(response.data.token);
      await handleFetchProfile();
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };


  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      setToken(response.data.token);
      console.log(response)
      handleFetchProfile();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  const handleFetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/', {
        headers: { Authorization: token },
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  return (
    <div className="container">
      <h1>Authentication and Profile Management</h1>
      <div className="forms">
        {formType === 'signup' ? (
          <div>
            <h2>Signup</h2>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <input type="file" accept="image/*" onChange={handleUpload} />
            <button onClick={handleSignup}>Sign Up</button>
            <p>Already have an account? <span onClick={() => setFormType('login')}>Login</span></p>
          </div>
        ) : (
          <div>
            <h2>Login</h2>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <p>Don't have an account? <span onClick={() => setFormType('signup')}>Sign Up</span></p>
          </div>
        )}
      </div>
      {token && (
        <div className="user-profile">
          <h2>User Profile</h2>
          <button onClick={handleFetchProfile}>Fetch Profile</button>
          {userProfile && (
            <div>
              <p>Username: {userProfile.username}</p>
              <p>Email: {userProfile.email}</p>
              {userProfile.profileImage && <img src={userProfile.profileImage} alt="Profile" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
