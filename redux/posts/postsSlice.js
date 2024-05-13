import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPosts(state, action) {
      return [...state, action.payload];
    },
  },
});


export const { addPosts } = postsSlice.actions;
export default postsSlice.reducer;