import { createMuiTheme } from "@material-ui/core/styles";
import { deepOrange } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: deepOrange[400],
    },
    secondary: {
      main: deepOrange[500],
    },
    tertiary: {
      main: "#FFFFFF",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

export default theme;
