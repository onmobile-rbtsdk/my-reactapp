import { createUseStyles } from "react-jss";
import { ITheme } from "../../../types/theme";

export const useStyles = createUseStyles((theme: ITheme) => ({
  root: {
    borderRadius: "50%",
    "-webkit-animation": `$spin 2s linear infinite`,
    animation: `$spin 5s linear infinite`,
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "12.5%": {
      transform: "rotate(180deg)",
      animationTimingFunction: "linear",
    },
    "25%": {
      transform: "rotate(630deg)",
    },
    "37.5%": {
      transform: "rotate(810deg)",
      animationTimingFunction: "linear",
    },
    "50%": {
      transform: "rotate(1260deg)",
    },
    "62.5%": {
      transform: "rotate(1440deg)",
      animationTimingFunction: "linear",
    },
    "75%": {
      transform: "rotate(1890deg)",
    },
    "87.5%": {
      transform: "rotate(2070deg)",
      animationTimingFunction: "linear",
    },
    "100%": {
      transform: "rotate(2520deg)",
    },
  },
}));
