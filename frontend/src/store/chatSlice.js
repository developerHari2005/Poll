import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
  },
  reducers: {
    setInitialMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setInitialMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;