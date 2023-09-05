import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1f98d9",
      light: "#3cafec",
      dark: "#1f98d9",
      contrastText: "#fff",
    },
    secondary: {
      main: "#a4a4a4",
      light: "#a4a4a4",
      dark: "#a4a4a4",
      contrastText: "#000",
    },
  },
});

export default theme;
