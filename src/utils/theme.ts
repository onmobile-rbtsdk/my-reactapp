//import { ASSETS_ENDPOINT } from "../constants/endpoint";

const DEFAULT_THEME = {
  name: "ONMO",
  privacyPolicy: "https://www.onmo.com/privacy-policy/",
  termsAndConditions: "https://www.onmo.com/terms-conditions/",
  termOfUse: "https://www.onmo.com/",
  faq: "https://www.onmo.com/faqs/",
  isShowLogout: "true",
  appName: "ONMO",
  //appLogo: `${ASSETS_ENDPOINT}logo.png`,
  languages: ["en", "fr"],
  spacing: [0, 4, 6, 7, 8, 8.5, 9, 12, 15, 32, 64],
  palette: {
    common: {
      black: "#000",
      white: "#fff",
    },
    primary: {
      light: "#45A677",
      main: "#489F85",
      dark: "#33776b",
      contrastText: "#fff",
    },
    secondary: {
      light: "#a1a1a4",
      main: "#8A8A8E",
      dark: "#606063",
      contrastText: "#fff",
    },
    error: {
      light: "#ef5350",
      main: "#d32f2f",
      dark: "#c62828",
      contrastText: "#fff",
    },
    warning: {
      light: "#ff9800",
      main: "#ED6C02",
      dark: "#e65100",
      contrastText: "#fff",
    },
    info: {
      light: "#03a9f4",
      main: "#0288d1",
      dark: "#01579b",
      contrastText: "#fff",
    },
    success: {
      light: "#4caf50",
      main: "#237d32",
      dark: "#1b5e20",
      contrastText: "#fff",
    },
    grey: {},
    text: {
      primary: "#001D2E",
      secondary: "#8A8A8E",
      disabled: "rgba(0,0,0,0.12)",
    },
    background: {
      paper: "linear-gradient(115.51deg, #009177 25.71%, #56BE9F 80.48%)",
      default: "#fff",
    },
  },
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 110,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  fontFamily: "Roboto, sans-serif",
  button: {
    primary: { background: "linear-gradient(324.29deg, #489F85 10.69%, #63CBAC 95.4%)" },
    secondary: { background: "linear-gradient(324.29deg, #F0AD00 10.69%, #FFCF53 95.4%)" },
  },
};

export const getTheme = () => {
  const THEME = process.env.REACT_APP_THEME;
  if (THEME) {
    try {
      return JSON.parse(THEME);
    } catch (e) {
      console.log("Invalid theme. Default will be used");
      return DEFAULT_THEME;
    }
  } else {
    return DEFAULT_THEME;
  }
};

export const THEME_NAME = getTheme()?.name || "ONMO";
export const THEME_PHONE_PREFIX = getTheme()?.phonePrefix;
export const THEME_REGEX_PHONE_PREFIX = new RegExp(getTheme()?.regexPhonePrefix);
