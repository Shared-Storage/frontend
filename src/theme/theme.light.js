import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#004971",
      light: "#004e78",
      dark: "#002e46",
      contrastText: "#fff",
    },
    secondary: {
      main: "#2f3e46",
      light: "#2f3e46",
      dark: "#2f3e46",
      contrastText: "#fff",
    },
    background: {
      default: "#efefef",
      paper: "#ffffff",
    },
  },
});

export default theme;
