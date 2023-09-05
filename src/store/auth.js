import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = { isAuthenticated: undefined };

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const authenticationAction = authSlice.actions;
export default authSlice.reducer;
