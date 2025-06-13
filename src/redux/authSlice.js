import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  userdata: null,
  sessions: [], // Store multiple WhatsApp sessions
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    storetoken: (state, action) => {
      state.token = action.payload;
    },
    storeuserdata: (state, action) => {
      state.userdata = action.payload;
    },
    storeSessions: (state, action) => {
      state.sessions = action.payload;
    },
  },
});

export const { storetoken, storeuserdata, storeSessions } = authSlice.actions;
export default authSlice.reducer;
