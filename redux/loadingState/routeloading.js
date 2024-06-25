import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const routeSlice = createSlice({
  name: "routeloading",
  initialState,
  reducers: {
    setrouteLoading(state, action) {
      return action.payload;
    }
  },
});

export const {setrouteLoading} = routeSlice.actions;
export default routeSlice.reducer;