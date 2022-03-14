import { createUseStyles } from "react-jss";
import { ITheme } from "../../../types/theme";

export const useStyles = createUseStyles((theme: ITheme) => ({
  root: {
    border: 0,
    margin: 0,
    display: "inline-flex",
    padding: 0,
    position: "relative",
    minWidth: 0,
    flexDirection: "column",
    verticalAlign: "top",
  },
  adornmentRoot: {
    height: "0.01em",
    display: "flex",
    maxHeight: "2em",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
  startAdornment: {
    marginRight: 8,
  },
  endAdornment: {
    marginLeft: 8,
    marginRight: 14,
  },
  inputRoot: {
    color: "#001D2E",
    cursor: "text",
    display: "inline-flex",
    position: "relative",
    fontSize: 15,
    boxSizing: "border-box",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    fontWeight: 400,
    lineHeight: "1.1876em",
    letterSpacing: -0.2,
  },
  inputBase: {
    outline: "unset",
    font: "inherit",
    color: "currentColor",
    width: "100%",
    border: 0,
    height: "1.1876em",
    margin: 0,
    display: "block",
    padding: "6px 0 7px",
    minWidth: 0,
    background: "none",
    boxSizing: "content-box",
    letterSpacing: "inherit",
    "-webkit-tap-highlight-color": "transparent",
  },
  disableUnderline: {
    textDecoration: "unset",
  },
  fullWidth: {
    width: "100%",
    height: 50,
  },
  textTransform: {
    "&.lowercase": {
      textTransform: "lowercase",
    },
    "&.uppercase": {
      textTransform: "uppercase",
    },
  },
  variant: {
    "&.outlined": {
      position: "relative",
      borderRadius: 8,
      border: "1px solid #ddd",
      "& > input": {
        padding: "18.5px 14px",
      },
    },
    "&.filled": {
      padding: "10px 12px",
    },
  },
}));
