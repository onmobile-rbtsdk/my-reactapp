type PaletteType = "light" | "dark";

interface CommonColors {
  black: string;
  white: string;
}

interface PaletteColor {
  light: string;
  main: string;
  dark: string;
  contrastText: string;
}

interface TypeText {
  primary: string;
  secondary: string;
  disabled: string;
  hint: string;
}

interface TypeBackground {
  default: string;
  paper: string;
}

interface Palette {
  common: CommonColors;
  type: PaletteType;
  primary: PaletteColor;
  secondary: PaletteColor;
  error: PaletteColor;
  warning: PaletteColor;
  info: PaletteColor;
  success: PaletteColor;
  text: TypeText;
  background: TypeBackground;
}

interface ZIndex {
  mobileStepper: number;
  speedDial: number;
  appBar: number;
  drawer: number;
  modal: number;
  snackbar: number;
  tooltip: number;
}

interface StyleButton {
  background: string;
}

interface Button {
  primary: StyleButton;
  secondary: StyleButton;
}

export interface ITheme {
  palette: Palette;
  name: string;
  privacyPolicy: string;
  termsAndConditions: string;
  termOfUse: string;
  faq: string;
  isShowLogout: boolean;
  appName: string;
  appLogo: string;
  languages: string[];
  spacing: number[];
  zIndex: ZIndex;
  fontFamily: string;
  button: Button;
}
