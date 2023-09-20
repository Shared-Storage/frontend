import { Container, GlobalStyles } from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import * as authenticationServive from "../services/authentication";
import CssBaseline from "@mui/material/CssBaseline";
// import * as logger from "./../utils/logger";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import OrganizationHome from "../components/Organization/OrganizationHome";

const Dashboard = () => {
  const { t } = useTranslation(["common", "Dashboard"]);
  const paymentsData = useSelector((state) => {
    return state.payments;
  });
  const userSubscription = useSelector((state) => {
    return state.subscription;
  });

  return (
    <>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0 } }} />
      <CssBaseline />
      {/* <Container maxWidth="sm">
        <h2>{t("Dashboard:dashboard")}</h2>
        Subscription: {userSubscription.subscription==="Free" && <span>Freemium</span>}
        {userSubscription.subscription==="Basic" && <span>Basic</span>}
        {userSubscription.subscription==="Premium" && <span>Premium</span>}
        <br />
        {paymentsData?.billingDetails?.billingName}
      </Container> */}
      <OrganizationHome />
      <Outlet />
    </>
  );
};

export default Dashboard;
