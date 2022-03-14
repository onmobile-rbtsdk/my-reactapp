import { createUseStyles } from "react-jss";
import { ITheme } from "../../types/theme";

export const useStyles = createUseStyles((theme: ITheme) => ({
  iconBack: {
    "@media (orientation: landscape)": {
      width: 12,
      height: 12,
      "@media(max-height: 667px)": {
        width: 9.6,
        height: 9.6,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        width: 10.8,
        height: 10.8,
      },
    },
  },
  wrapper: {
    width: "100%",
    height: 80,
    minHeight: 80,
    background: "#222323",
    padding: "0px 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    zIndex: 90,
    "@media(max-height: 667px)": {
      height: 64,
      minHeight: 64,
      padding: "0px 12px",
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      height: 72,
      minHeight: 72,
      padding: "0px 13.5px",
    },
  },
  wrapperMoblie: {
    width: "100%",
    height: 80,
    background: "#222323",
    padding: "0px 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    zIndex: 90,
    minHeight: 80,
    "@media(max-height: 667px)": {
      height: 64,
      padding: "0px 12px",
      minHeight: 64,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      height: 7.2,
      padding: "0px 13.5px",
      minHeight: 72,
    },
    "@media (orientation: landscape)": {
      left: "unset !important",
      width: "100px !important",
      position: "absolute",
      right: 0,
      top: 0,
      height: "100%",
      background: "#222223",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-evenly",
      zIndex: 90,
      "@media(max-height: 667px)": {
        width: "80px !important",
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        width: "90px !important",
      },
    },
    "@media (orientation: portrait)": {
      width: "100% !important",
    },
  },
  mainClock: {
    background: "#080808",
    width: 120,
    height: 36,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    "@media(max-height: 667px)": {
      width: 96,
      height: 28.8,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      width: 108,
      height: 32.4,
    },
  },
  mainClockMobile: {
    background: "#080808",
    width: 120,
    height: 36,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    "@media(max-height: 667px)": {
      width: 96,
      height: 28.8,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      width: 108,
      height: 32.4,
    },
    "@media (orientation: landscape)": {
      background: "#080808",
      width: 63,
      height: 92,
      borderRadius: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
      flexDirection: "column",
      "@media(max-height: 667px)": {
        width: 63,
        height: 92,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        width: 56.7,
        height: 82.6,
      },
    },
  },
  mainBlockMobile: {
    background: "#080808",
    width: 120,
    height: 36,
    borderRadius: 20,
    display: "flex",
    "@media(max-height: 667px)": {
      width: 96,
      height: 28.8,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      width: 108,
      height: 32.4,
    },
    "@media (orientation: landscape)": {
      background: "#080808",
      width: 59,
      height: 73,
      borderRadius: 15,
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      "@media(max-height: 667px)": {
        width: 47.2,
        height: 58.4,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        width: 53.1,
        height: 65.7,
      },
    },
  },
  mainBlock: {
    background: "#080808",
    width: 120,
    height: 36,
    borderRadius: 20,
    display: "flex",
    "@media(max-height: 667px)": {
      width: 96,
      height: 28.8,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      width: 108,
      height: 32.4,
    },
  },
  countTimeMobile: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: 700,
    color: "#fff",
    "@media(max-height: 667px)": {
      marginLeft: 8,
      fontSize: 16,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      marginLeft: 9,
      fontSize: 18,
    },
    "@media (orientation: landscape)": {
      fontSize: 20,
      fontWeight: 500,
      color: "#fff",
      marginLeft: 0,
      "@media(max-height: 667px)": {
        fontSize: 17,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        fontSize: 18,
      },
    },
  },
  countTime: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 500,
    color: "#fff",
    "@media(max-height: 667px)": {
      marginLeft: 8,
      fontSize: 16,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      marginLeft: 9,
      fontSize: 18,
    },
  },
  blockCustom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    "@media(max-height: 667px)": {
      fontSize: 20,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      fontSize: 18,
    },
    "& > span": {
      color: "#fff",
    },
    "@media (orientation: landscape)": {
      "& > span:first-child": {
        fontSize: 12,
      },
    },
    "& > span:last-child": {
      fontWeight: 700,
    },
  },
  marginBottom: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marginBottomMobile: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "@media (orientation: landscape)": {
      margin: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
      flexDirection: "column",
    },
  },
  backButton: {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "@media(max-height: 667px)": {
      width: 24,
      height: 24,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      width: 27,
      height: 27,
    },
  },
}));
