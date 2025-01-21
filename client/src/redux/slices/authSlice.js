import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Hàm để lấy token từ localStorage hoặc một vị trí lưu trữ khác
const getToken = () => localStorage.getItem('token');

export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:3000/api/auth/user-info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const data = await response.json();
      console.log(data);
      return data; // Server trả về `data.user` đã được xử lý
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLogout = createAsyncThunk(
  'user/fetchLogout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      const data = await response.json();
      // Xóa thông tin người dùng khỏi localStorage
      localStorage.removeItem('selectedTournament');
      localStorage.removeItem('token');
      return data.message || 'Logged out successfully';
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
