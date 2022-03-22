import { createUseStyles } from "react-jss";
import { ITheme } from "../types/theme";

export const useStyles = createUseStyles((theme: ITheme) => ({
  noBackground: {
    backgroundColor: `${theme.palette.background.default} !important`,
    zIndex: 20,
  },
  container: {
    position: "fixed",
    zIndex: 9999,
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "strech",
    justifyContent: "center",
    minHeight: "100vh",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  logo: {
    width: 56,
    height: 56,
    background: "#fff",
    "@media(max-height: 667px)": {
      width: 44.8,
      height: 44.8,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      width: 50.4,
      height: 50.4,
    },
  },
  spinner: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: `conic-gradient(from 5deg at 50% 50%, rgba(39, 174, 96, 0) 0deg, rgba(72, 159, 133, 0) 0.04deg, ${theme.palette.primary.light} 157.08deg, ${theme.palette.primary.main} 360deg)`,
    position: "relative",
    animation: "$spin 1.4s linear infinite",
    transform: "translateZ(0)",
    "&:after": {
      background: "#191414",
      width: "80%",
      height: "80%",
      borderRadius: "50%",
      content: `""`,
      margin: "auto",
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    "&:before": {
      content: `""`,
      background: theme.palette.primary.main,
      width: 6,
      height: 6,
      position: "absolute",
      borderRadius: "50%",
    },
  },
  "@keyframes spin": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& > img": {
      position: "absolute",
      height: 15,
      width: 39,
    },
  },
  spinnerDynamic: {
    "&:after": {
      background: theme.palette.background.default,
    },
  },
}));
