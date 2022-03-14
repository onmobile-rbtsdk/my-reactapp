import { createUseStyles } from "react-jss";
import { ITheme } from "../../../../types/theme";

export const useStyles = createUseStyles((theme: ITheme) => ({
  root: {
    height: "fit-content",
    maxHeight: "100vh",
    width: "100vw",
    display: "flex",
    background: "transparent",
  },
  posAbs: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    boxSizing: "border-box",
  },
  hideHeader: {
    transform: "translate(0px, -100%)",
    transition: "all ease-in-out 1s",
  },
  lastFrame: {
    position: "absolute",
    zIndex: 90,
    width: "100%",
    height: "auto",
    top: 80,
    left: 0,
    filter: "blur(5px)",
  },
  textAlignCenter: {
    textAlign: "center",
  },
  resumeStream: {
    marginBottom: "35px !important",
    color: "#fff",
    background: theme.palette.primary.main,
    height: 48,
    width: "100%",
    maxWidth: 263,
    borderRadius: 50,
    fontWeight: 500,
    fontSize: 16,
  },
}));
