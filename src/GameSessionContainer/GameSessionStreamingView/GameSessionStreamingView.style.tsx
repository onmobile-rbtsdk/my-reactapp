import { createUseStyles } from "react-jss";
import { ITheme } from "../../types/theme";

export const useStyles = createUseStyles((theme: ITheme) => ({
  mainLoading: {
    width: "100%",
  },
  calculatingBackground: {
    position: "absolute",
    zIndex: 999,
    top: -80,
    left: 0,
    width: "100vw",
    height: "calc(100vh + 80px)",
    background: "linear-gradient(170.88deg, #489F85 -1.64%, #227E6E 99.1%)",
    overflow: "scroll",
  },
  messageOverlay: {
    pointerEvents: "none",
    touchAction: "none",
    position: "absolute",
    zIndex: 9000,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& > img": {
      width: 327,
      height: 71.74,
    },
  },
  calculating: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 84,
    "@media(max-height: 667px)": {
      paddingBottom: 67.2,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      paddingBottom: 75.6,
    },
    "& > p": {
      height: 80,
      textAlign: "center",
      color: "#fff",
      fontWeight: "bold",
      fontSize: 30,
      lineHeight: "40px",
      letterSpacing: -0.2,
      "@media(max-height: 667px)": {
        height: 64,
        fontSize: 19.2,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        height: 72,
        fontSize: 21.6,
      },
    },
    "& > img": {
      marginTop: -40,
      marginRight: 4.95,
      "@media(max-height: 667px)": {
        marginTop: -32,
        marginRight: 4,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        marginTop: -36,
        marginRight: 4.5,
      },
    },
  },
}));
