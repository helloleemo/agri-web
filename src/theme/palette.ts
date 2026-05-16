import type { PaletteOptions } from "@mui/material/styles";

const palette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#0e7490",
    light: "#ecfeff",
    dark: "#155e75",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#FF7A59",
    light: "#FF9D85",
    dark: "#D65E41",
    contrastText: "#FFFFFF",
  },
  grey: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
  background: {
    default: "#F4F7F5",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#1E2A28",
    secondary: "#4B5E5B",
  },
  success: {
    main: "#2E7D32",
  },
  warning: {
    main: "#ED6C02",
  },
  error: {
    main: "#D32F2F",
  },
  info: {
    main: "#0288D1",
  },
};

export default palette;
