
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  Message: [],
  ScheduleMessage: []
};

const MessageSlice = createSlice({
  name: 'Message',
  initialState,
  reducers: {
    storeMessage: (state, action) => {
      state.Message = action.payload;
    },
    storeScheduleMessage: (state, action) => {
      state.ScheduleMessage = action.payload
    }
  },
});

export const { storeMessage, storeScheduleMessage } = MessageSlice.actions;
export default MessageSlice.reducer;
