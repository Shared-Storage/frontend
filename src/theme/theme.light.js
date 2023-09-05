import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0070ac",
      light: "#1BA9FF",
      dark: "#0070ac",
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
      paper: "#efefef",
    },
  },
});

export default theme;
