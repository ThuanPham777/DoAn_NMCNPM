// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import tournamentReducer from './slices/tournamentSlice';
import userReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    tournament: tournamentReducer,
    user: userReducer,
  },
});

export default store;
