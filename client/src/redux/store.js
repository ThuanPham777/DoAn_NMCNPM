// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import tournamentReducer from './slices/tournamentSlice';

const store = configureStore({
  reducer: {
    tournament: tournamentReducer,
  },
});

export default store;
