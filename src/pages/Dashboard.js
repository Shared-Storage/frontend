import { GlobalStyles } from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";

import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0 } }} />
      <CssBaseline />
      <Outlet />
    </>
  );
};

export default Dashboard;
