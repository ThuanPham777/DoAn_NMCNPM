// src/redux/tournamentSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Khởi tạo state ban đầu
const initialState = {
  selectedTournament: null,
};

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState,
  reducers: {
    setSelectedTournament: (state, action) => {
      state.selectedTournament = action.payload;
    },
    resetSelectedTournament: (state) => {
      state.selectedTournament = null;
    },
  },
});

// Export actions và reducer
export const { setSelectedTournament, resetSelectedTournament } =
  tournamentSlice.actions;
export default tournamentSlice.reducer;
