import axios from 'axios';
import React, { useState } from 'react';
import Api_url from '../constant/constant.jsx'; // Adjust path if needed
import { href, useNavigate } from 'react-router-dom';
import Admin_dashboard from './Admin_dashboar.jsx';   // Adjust path if needed
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { loginAdmin } from '../redux/stateSlice.jsx';
const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');
   const dispatch=useDispatch();
   
  const isAdminLoggedIn = useSelector(state => state.admin.isAdminLoggedIn);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted({ username, password });
    setError('');
    setSuccess('');
    axios.post(`${Api_url.BACKEND_URI}/api/admin/login`, { username, password })
      .then(response => {
        setSuccess('Login successful!');
         navigate('/admin/admin_dashboard')
        setError('');
        if (response.status === 200) {
          alert("Login successfully");
           // Redirect to admin dashboard
          //  direct to home page after successful login
          if (response.data.token) {
            localStorage.setItem('token', response.data.token); // Save token if provided
          }
        }
         dispatch(loginAdmin());;
        console.log('Login successful:', response.data);
      })
      .catch(error => {
        setError('Login failed: ' + (error.response?.data?.message || error.message));
        setSuccess('');
        console.error('Login failed:', error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    
      <div className="bg-white rounded shadow p-8 w-full max-w-sm">
        <h3 className="text-xl font-bold mb-6 text-center">Login As Admin</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Admin</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              placeholder="Enter UserName"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Login
          </button>
        </form>
        {success && (
          <div className="mt-4 bg-green-100 border border-green-300 rounded p-2 text-sm text-green-800">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-300 rounded p-2 text-sm text-red-800">
            {error}
          </div>
        )}
        {submitted && (
          <div className="mt-4 bg-gray-100 border border-gray-300 rounded p-2 text-sm">
            <div><strong>Username:</strong> {submitted.username}</div>
            <div><strong>Password:</strong> {submitted.password}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;