import { createSlice } from "@reduxjs/toolkit";
import * as logger from "../utils/logger";

const initialUserState = {
  id: undefined,
  email: undefined,
  firstName: undefined,
  lastName: undefined,
  imageUrl: undefined,
  bio: undefined,
  emailVerified: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.imageUrl = action.payload.imageUrl;
      state.bio = action.payload.bio;
      state.emailVerified = action.payload.emailVerified;
    },
    updateUser(state, action) {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.imageUrl = action.payload.imageUrl;
      state.bio = action.payload.bio;
    },
    verifyEmail(state) {
      logger.log("Implementing reducer method verifyEmail");
      state.emailVerified = true;
    },
  },
});

export const userAction = userSlice.actions;
export default userSlice.reducer;
