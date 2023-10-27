import { createSlice } from "@reduxjs/toolkit";

const initialOrganizationsState = {
  ownedOrganizations: [],
  sharedOrganizations: [],
};
// Selected organizations
const organizationsSlice = createSlice({
  name: "organizations",
  initialState: initialOrganizationsState,
  reducers: {
    setOrganizationsState(state, action) {
      const ownedOrganizations = action.payload?.ownedOrganizations
        ? action.payload?.ownedOrganizations
        : [];
      const sharedOrganizations = action.payload?.sharedOrganizations
        ? action.payload?.sharedOrganizations
        : [];
      state.ownedOrganizations = [...ownedOrganizations];
      state.sharedOrganizations = [...sharedOrganizations];
    },
  },
});

export const organizationsActions = organizationsSlice.actions;
export default organizationsSlice.reducer;
