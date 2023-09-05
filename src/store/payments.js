import { createSlice } from "@reduxjs/toolkit";

const initialPaymentsState = {
  billingDetails: {
    billingName: undefined,
    billingPhone: undefined,
    billingAddress: undefined,
  },
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState: initialPaymentsState,
  reducers: {
    setBillingDetails(state, action) {
      state.billingDetails = action.payload.billingDetails;
    },
    updateBillingName(state, action) {
      state.billingDetails.billingName = action.payload;
    },
    updateBillingPhone(state, action) {
      state.billingDetails.billingPhone = action.payload;
    },
    updateBillingAddress(state, action) {
      state.billingDetails.billingAddress = action.payload;
    },
  },
});

export const paymentsAction = paymentsSlice.actions;
export default paymentsSlice.reducer;
