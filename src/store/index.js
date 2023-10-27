import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import userReducer from "./user";
import preferenceReducer from "./preferences";
import subscriptionReducer from "./subscription";
import paymentsReducer from "./payments";
import organizationReducer from "./organization";
import organizationsReducer from "./organizations";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    preferences: preferenceReducer,
    subscription: subscriptionReducer,
    payments: paymentsReducer,
    organization: organizationReducer,
    organizations: organizationsReducer
  },
});

export default store;
