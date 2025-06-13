
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  whatsappNumber: [],
};

const whatsappSlice = createSlice({
  name: 'whatsapp',
  initialState,
  reducers: {
    storeWhatsappNumber: (state, action) => {
      state.whatsappNumber = action.payload;
    },
  },
});

export const { storeWhatsappNumber } = whatsappSlice.actions;
export default whatsappSlice.reducer;
