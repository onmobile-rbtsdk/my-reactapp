import { createUseStyles } from "react-jss";
import { ITheme } from "../../../../types/theme";

export const useStyles = createUseStyles((theme: ITheme) => ({
  root: {
    height: "100vh",
  },
  buttonGroupInner: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 4,
    position: "relative",
  },
  buttonGroupWrapper: {
    position: "absolute",
    zIndex: 11111111111,
    background: "#cecece",
    height: "auto",
    width: "100%",
    left: 0,
    top: 0,
    "@media screen and (max-width: 413px)": {
      height: "auto",
      width: "100%",
      left: 0,
    },
  },
  score: {
    color: "#fff",
    fontWeight: 500,
    fontSize: 30,
    background: "#000",
    textAlign: "center",
    marginBottom: 6,
    "@media screen and (max-width: 413px)": {
      fontSize: 10,
      marginBottom: 2,
    },
  },
  loadingIcon: {
    marginRight: 4,
  },
  form: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItem: "center",
    padding: 8,
  },
  textField: {
    marginBottom: 6,
  },
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
  },
  button: {
    marginBottom: 6,
    background: theme.button.primary.background,
    color: theme.palette.primary.contrastText,
    "@media screen and (max-width: 413px)": {
      fontSize: 10,
      width: "auto",
      left: 0,
      marginBottom: 2,
      lineHeight: 0,
      height: 30,
    },
  },
}));
