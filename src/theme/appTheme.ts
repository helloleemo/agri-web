import { createTheme } from "@mui/material/styles";
import palette from "./palette";
import typography from "./typography";

const appTheme = createTheme({
  palette,
  shape: {
    borderRadius: 12,
  },
  typography,
  components: {
    // MuiCssBaseline: {
      // styleOverrides: {
      //   body: {
      //     background:
      //       "radial-gradient(circle at 8% 10%, #E7F4F1 0%, #F4F7F5 35%, #F4F7F5 100%)",
      //   },
      // },
    // },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid #E7EFEC",
          boxShadow: "0 10px 30px rgba(11, 74, 66, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },
  },
});

export default appTheme;
