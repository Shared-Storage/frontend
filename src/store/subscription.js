import { createSlice } from "@reduxjs/toolkit";
import * as logger from "./../utils/logger";

// Free, Basic, Premium
const initialSubscriptionState = {
  customer: undefined,
  subscription: "Free",
  subscriptionId: undefined,
  subscriptionItemId: undefined,
  default_payment_method: null,
  cancel_at: null,
  cancel_at_period_end: false,
  canceled_at: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: initialSubscriptionState,
  reducers: {
    setSubscription(state, action) {
      logger.log("subscription store");
      logger.log("action.payload");
      logger.log(action.payload);
      if (action.payload) {
        state.customer = action.payload.customer;
        state.subscription = action.payload.subscriptionPlan;
        state.subscriptionId = action.payload.subscriptionId;
        state.subscriptionItemId = action.payload.subscriptionItemId;
        state.default_payment_method = action.payload.default_payment_method;
        state.cancel_at = action.payload.cancel_at;
        state.cancel_at_period_end = action.payload.cancel_at_period_end;
        state.canceled_at = action.payload.canceled_at;
      } else {
        state.customer = undefined;
        state.subscription = "Free";
        state.subscriptionId = undefined;
        state.subscriptionItemId = undefined;
        state.default_payment_method = null;
        state.cancel_at = null;
        state.cancel_at_period_end = false;
        state.canceled_at = null;
      }
    },
    resetSubscription(state, action) {
      state.subscriptionId = action.payload?.id;
      state.cancel_at = action.payload?.cancel_at;
      state.cancel_at_period_end = action.payload?.cancel_at_period_end;
      state.canceled_at = action.payload?.canceled_at;
    },
    updateDefaultPaymentMethod(state, action) {
      state.default_payment_method = action.payload;
      
    },
  },
});

export const subscriptionAction = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
