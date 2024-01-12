import { useEffect, useState, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import PageNotFound from "./pages/PageNotFound";
import Dashboard from "./pages/Dashboard";
import VerifyForgotPassword from "./pages/VerifyForgotPassword";
import AppBar from "./components/AppBar";
import lightTheme from "./theme/theme.light";
import darkTheme from "./theme/theme.dark";
import "./App.css";
import * as logger from "./utils/logger";
import { authenticationAction } from "./store/auth";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "./store/user";
import ProtectedRoute from "./utils/ProtectedRoute";
import UnprotectedRoute from "./utils/UnprotectedRoute";
import ProtectedEmailVerifyRoute from "./utils/ProtectedEmailVerifyRoute";
import * as userService from "./services/user";
import VerifyEmail from "./pages/VerifyEmail";
import UserAccount from "./pages/UserAccount";
import EmailNotVerified from "./pages/EmailNotVerified";
import Support from "./pages/Support";
import Membership from "./pages/Membership";
import UserPreferences from "./pages/UserPreferences";
import Checkout from "./pages/Checkout";
import PaymentFormStripe from "./components/checkout/PaymentFormStripe";
import { preferenceAction } from "./store/preferences";
import { paymentsAction } from "./store/payments";
import { subscriptionAction } from "./store/subscription";
import { extractPlanFromSubscriptions } from "./services/payments";
import i18next from "i18next";
import OrganizationHome from "./components/Organization/OrganizationHome";
import OrganizationWorkSpace from "./components/Organization/OrganizationWorkSpace";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let [theme, setTheme] = useState(lightTheme);

  const userPreferences = useSelector((state) => {
    return state.preferences;
  });

  useEffect(() => {
    // Read access token
    const storageToken = localStorage.getItem("token");
    if (storageToken) {
      // Set authentication state
      dispatch(authenticationAction.login());
      // Get user Data from API using token and set user state
      setUserState(userService.getUserData());
    } else {
      dispatch(authenticationAction.logout());
    }
  }, []);

  useEffect(() => {
    if (userPreferences.theme !== undefined) {
      setThemeMethod(userPreferences.theme);
    }
    if (userPreferences.language !== undefined) {
      i18next.changeLanguage(userPreferences.language);
    }
  }, [userPreferences, userPreferences.language, userPreferences.theme]);

  const setUserState = async (something) => {
    try {
      const resp = await something;
      dispatch(userAction.setUser(resp.data));
      if (resp.data?.preferences) {
        dispatch(preferenceAction.setUserPreference(resp.data?.preferences));
      }
      // Set billing state
      if (resp.data?.subscriptions) {
        const subscriptionDetails = await extractPlanFromSubscriptions(
          resp.data?.subscriptions
        );

        dispatch(subscriptionAction.setSubscription(subscriptionDetails));
      }

      if (resp.data?.payments)
        dispatch(paymentsAction.setBillingDetails(resp.data?.payments));
    } catch (err) {
      if (err.message === "JWT EXPIRED ERROR") {
        localStorage.removeItem("token");
        navigate("/");
      }
      logger.error(err);
    }
  };

  const setThemeMethod = (value) => {
    switch (value) {
      case "light":
        setTheme(lightTheme);
        break;
      case "dark":
        setTheme(darkTheme);
        break;
      default:
        setTheme(lightTheme);
    }
  };
  return (
    <Suspense fallback={"Loading..."}>
      <ThemeProvider theme={theme}>
        <div className="App">
          <AppBar />
          <Routes>
            <Route
              path="/"
              element={
                <UnprotectedRoute>
                  <SignIn />
                </UnprotectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <UnprotectedRoute>
                  <SignUp />
                </UnprotectedRoute>
              }
            />
            <Route path="/support" element={<Support />} />
            <Route
              path="/forgot-password"
              element={
                <UnprotectedRoute>
                  <ForgotPassword />
                </UnprotectedRoute>
              }
            />
            <Route
              path="/verify-forgot-password/:token"
              element={<VerifyForgotPassword />}
            />
            <Route
              path="/verify-email/:tokenToBeVerified"
              element={<VerifyEmail />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ProtectedEmailVerifyRoute>
                    <Dashboard />
                  </ProtectedEmailVerifyRoute>
                </ProtectedRoute>
              }
            >
              {/* Nested routes within Dashboard */}
              <Route path="" element={<OrganizationHome />} />
              <Route
                path="organization/:organizationId"
                element={<OrganizationWorkSpace />}
              />
            </Route>
            <Route
              path="/email-not-verified"
              element={
                <ProtectedRoute>
                  <EmailNotVerified />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-account"
              element={
                <ProtectedRoute>
                  <ProtectedEmailVerifyRoute>
                    <UserAccount />
                  </ProtectedEmailVerifyRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/preferences"
              element={
                <ProtectedRoute>
                  <ProtectedEmailVerifyRoute>
                    <UserPreferences />
                  </ProtectedEmailVerifyRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/membership"
              element={
                <ProtectedRoute>
                  <ProtectedEmailVerifyRoute>
                    <Membership />
                  </ProtectedEmailVerifyRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <ProtectedEmailVerifyRoute>
                    <Checkout />
                  </ProtectedEmailVerifyRoute>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
