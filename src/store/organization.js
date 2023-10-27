import { createSlice } from "@reduxjs/toolkit";

const initialOrganizationState = {
  _id: undefined,
  title: undefined,
  description: undefined,
  img: undefined,
  owner: undefined,
  createdBy: undefined,
  createdOn: undefined,
  orgMembers: [],
  orgLocations: [],
};
// Selected organization
const organizationSlice = createSlice({
  name: "organization",
  initialState: initialOrganizationState,
  reducers: {
    setOrganizationState(state, action) {
      const organizationValues = action.payload;
      state._id = organizationValues?._id;
      state.title = organizationValues?.title;
      state.description = organizationValues?.description;
      state.createdBy = organizationValues?.createdBy;
      state.createdOn = organizationValues?.createdOn;
      state.orgMembers = organizationValues?.orgMembers;
      state.orgLocations = organizationValues?.orgLocations;
    },
  },
});

export const organizationAction = organizationSlice.actions;
export default organizationSlice.reducer;
