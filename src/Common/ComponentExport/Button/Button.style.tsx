import { createUseStyles } from "react-jss";
import { ITheme } from "../../../types/theme";

export const useStyles = createUseStyles((theme: ITheme) => ({
  root: {
    fontSize: 14,
    border: "none",
    padding: "6px 16px",
    lineHeight: 1.5,
    color: theme.palette?.text.primary,
    fontFamily: theme.fontFamily,
    background: "none",
    borderRadius: 4,
  },
  fullWidth: {
    width: "100%",
  },
  contained: {
    background: "#e0e0e0",
    color: "rgba(0, 0, 0, 0.87)",
  },
  outlined: {
    border: "1px solid rgba(0, 0, 0, 0.23)",
  },
  text: {},
  startIcon: {
    display: "inherit",
    alignItems: "inherit",
    justifyContent: "inherit",
    "& > img": {
      marginLeft: -4,
      marginRight: 8,
    },
    "& > svg": {
      marginLeft: -4,
      marginRight: 8,
    },
  },
  endIcon: {
    display: "inherit",
    alignItems: "inherit",
    justifyContent: "inherit",
    "& > img:last-child": {
      marginRight: -4,
      marginLeft: 8,
    },
    "& > svg:last-child": {
      marginRight: -4,
      marginLeft: 8,
    },
  },
  disabled: {
    color: "rgba(0, 0, 0, 0.26) !important",
    cursor: "default",
    pointerEvents: "none",
  },
}));
