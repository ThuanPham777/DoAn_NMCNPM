import { createSlice } from '@reduxjs/toolkit';

// Hàm lưu vào localStorage
const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('selectedTournament', serializedState);
  } catch (error) {
    console.error('Could not save tournament to localStorage', error);
  }
};

// Hàm xóa localStorage
const clearLocalStorage = () => {
  try {
    localStorage.removeItem('selectedTournament');
  } catch (error) {
    console.error('Could not clear localStorage', error);
  }
};

// Hàm lấy từ localStorage
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('selectedTournament');
    return serializedState ? JSON.parse(serializedState) : null;
  } catch (error) {
    console.error('Could not load tournament from localStorage', error);
    return null;
  }
};

// Khởi tạo state ban đầu
const initialState = {
  selectedTournament: loadFromLocalStorage(),
};

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState,
  reducers: {
    setSelectedTournament: (state, action) => {
      // Xóa thông tin cũ
      clearLocalStorage();
      state.selectedTournament = action.payload;
      saveToLocalStorage(action.payload); // Lưu thông tin mới
    },
    resetSelectedTournament: (state) => {
      state.selectedTournament = null;
      clearLocalStorage();
    },
  },
});

export const { setSelectedTournament, resetSelectedTournament } =
  tournamentSlice.actions;

export default tournamentSlice.reducer;
