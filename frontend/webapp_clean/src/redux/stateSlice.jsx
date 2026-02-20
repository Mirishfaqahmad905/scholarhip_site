// redux/adminSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage
const isLoggedInFromStorage = localStorage.getItem('isAdminLoggedIn') === 'true';

const initialState = {
  isAdminLoggedIn: isLoggedInFromStorage,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loginAdmin: (state) => {
      state.isAdminLoggedIn = true;
      localStorage.setItem('isAdminLoggedIn', 'true');
    },
    logoutAdmin: (state) => {
      state.isAdminLoggedIn = false;
      localStorage.removeItem('isAdminLoggedIn');
    },
  },
});

export const { loginAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
