import { createUseStyles } from "react-jss";
import { ITheme } from "../../../types/theme";

export const useStyles = createUseStyles((theme: ITheme) => ({
  root: {
    margin: 0,
    fontFamily: theme.fontFamily,
  },
  body1: {
    fontSize: 15,
    letterSpacing: "-0.2px",
  },
  body2: {
    fontSize: 17,
    letterSpacing: "-0.2px",
  },
}));
