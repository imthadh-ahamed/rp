import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    userData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { userData } = userSlice.actions;

export default userSlice.reducer;
