import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    zIndex: 1901,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    "-webkit-tap-highlight-color": "transparent",
  },
  root: {
    position: "fixed",
    top: "50%",
    right: "50%",
    transform: "translate(50%, -50%)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(100% - 64px)",
    overflowY: "auto",
    borderRadius: 4,
    boxShadow:
      "0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)",
    background: "#fff",
    zIndex: 1901,
  },
  fullScreen: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    minWidth: "100vw",
    minHeight: "100vh",
    top: 0,
    right: 0,
    transform: "translate(0, 0)",
  },
  fullWidth: {
    width: "calc(100% - 64px)",
  },
  maxWidth: {
    margin: "auto",
    "&.sm": {
      maxWidth: 600,
    },
    "&.md": {
      maxWidth: 960,
    },
    "&.lg": {
      maxWidth: 1280,
    },
  },
  stickBottom: {
    margin: 0,
    position: "fixed",
    bottom: 0,
    left: 0,
    top: "unset",
    right: "unset",
    transform: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  content: {},
});
