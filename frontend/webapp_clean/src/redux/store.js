// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './stateSlice';

const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
});

export default store;
