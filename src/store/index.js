import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import userReducer from "./user";
import preferenceReducer from "./preferences";
import subscriptionReducer from "./subscription";
import paymentsReducer from "./payments";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    preferences: preferenceReducer,
    subscription: subscriptionReducer,
    payments: paymentsReducer,
  },
});

export default store;
