
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  FileAttach: [],
};

const FileAttachSlice = createSlice({
  name: 'FileAttach',
  initialState,
  reducers: {
    storeFiles: (state, action) => {
      state.FileAttach = action.payload;
    },
  },
});

export const { storeFiles } = FileAttachSlice.actions;
export default FileAttachSlice.reducer;
