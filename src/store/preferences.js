import { createSlice } from "@reduxjs/toolkit";

const initialPreferenceState = {
  theme: undefined,
  language: undefined,
};

const preferenceSlice = createSlice({
  name: "preferences",
  initialState: initialPreferenceState,
  reducers: {
    setUserPreference(state, action) {
      if (state.theme === undefined) state.theme = action.payload.theme;
      if (state.language === undefined)
        state.language = action.payload.language;
    },
    updatePreferences(state, action) {
      state.theme = action.payload.theme;
      state.language = action.payload.language;
    },
    updateLanguage(state, action) {
      state.language = action.payload;
    },
  },
});

export const preferenceAction = preferenceSlice.actions;
export default preferenceSlice.reducer;
