import { createUseStyles } from "react-jss";
import { ITheme } from "../../types/theme";

export const useStyles = createUseStyles((theme: ITheme) => ({
  unselectable: {
    "-webkit-user-select": "none",
    "-webkit-touch-callout": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
  },
  container: {
    background: "black",
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
  },
  top0: {
    top: "0 !important",
  },
  textAlignCenter: {
    textAlign: "center",
  },
  root: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 80,
    "& > div:first-child": {
      //IP 11 full screen
      height: "calc(100vh - 80px) !important",
    },
    "@media(min-height: 620px) and (max-height: 630px)": {
      top: 80,
      "& > div:first-child": {
        height: "calc(100vh - 150px) !important",
      },
    },
    "@media(max-height: 667px)": {
      top: 80,
      "& > div:first-child": {
        height: `calc(${window.innerHeight}px - 80px) !important`,
      },
    },
    "@media(height: 628px)": {
      //IP7 Full screen
      top: 80,
      "& > div:first-child": {
        height: `calc(100vh - 80px) !important`,
      },
    },
    "@media (min-height: 848px)": {
      top: 80,
      "& > div:first-child": {
        height: `calc(${window.innerHeight}px - 80px) !important`,
      },
    },
    "@media(min-height: 450px) and (max-height: 570px)": {
      //IP 7
      top: 80,
      "& > div:first-child": {
        height: `calc(${window.innerHeight}px - 80px) !important`,
      },
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      //IP 11
      top: 72,
      "& > div:first-child": {
        height: `calc(${window.innerHeight}px - 72px) !important`,
      },
    },
    "@media (min-height: 697px) and (max-height: 711px)": {
      //IP 7+
      top: 72,
      "& > div:first-child": {
        height: `calc(100vh - 72px) !important`,
      },
    },
    "@media (height: 762px)": {
      //IP 12 mini
      top: 80,
      "& > div:first-child": {
        height: `calc(${window.innerHeight}px - 80px) !important`,
      },
    },
    "& > p": {
      display: "none",
    },
    "@media (orientation: landscape)": {
      position: "absolute",
      bottom: 0,
      top: 0,
      left: 0,
      right: 80,
      "& > div:first-child": {
        height: "100vh !important",
        width: "calc(100vw - 80px)  !important",
      },
    },
  },
  streamNotReady: {
    "& > div:nth-child(1)": {
      position: "absolute",
    },
  },
  btnRect: {
    position: "fixed",
    bottom: "4%",
    right: "5%",
    width: "fit-content",
    display: "flex",
    zIndex: 910,
  },
  btnMute: {
    marginRight: 15,
    Width: "50px",
    "& span > svg": {
      width: "calc(100vh * 0.07)",
      height: "calc(100vh * 0.07)",
    },
  },
  btnSpeaker: {
    Width: "50px",
    "& span > svg": {
      width: "calc(100vh * 0.07)",
      height: "calc(100vh * 0.07)",
    },
  },
  btnDisable: {
    width: "calc(100vh * 0.062) !important",
    height: "calc(100vh * 0.062) !important",
    "& > path:nth-child(1)": {
      fill: "#898989",
    },
  },
  askPermissionButton: {
    marginBottom: 6,
    height: 48,
    width: 263,
    borderRadius: 50,
    fontWeight: 500,
    fontSize: 16,
    "@media(max-height: 667px)": {
      marginBottom: 4.8,
      height: 38.4,
      width: 208,
      fontSize: 12.8,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      marginBottom: 5.4,
      height: 43.2,
      width: 234,
      fontSize: 14.4,
    },
  },
  autoFocus: {
    border: "1px solid #33776B",
   // color: theme.palette.primary.main,
  },
  iconMic: {
    position: "absolute",
    left: 25,
    "@media(max-height: 667px)": {
      left: 20,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      left: 22.5,
    },
  },
  resumeStream: {
    marginBottom: "35px !important",
//    color: theme.palette.primary.contrastText,
   // background: theme.button.primary.background,
    height: 48,
    width: 263,
    borderRadius: 50,
    fontWeight: 500,
    fontSize: 16,
    "@media(max-height: 667px)": {
      marginBottom: "28px !important",
      height: 38.4,
      width: 208,
      fontSize: 12.8,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      marginBottom: "31.5px !important",
      height: 43.2,
      width: 234,
      fontSize: 14.4,
    },
  },
  continuesBox: {
    display: "flex",
    flexDirection: "column",
    "& > p": {
      width: "100%",
      fontSize: 16,
      color: "#222",
      textAlign: "center",
      "@media(max-height: 667px)": {
        fontSize: 12.8,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        fontSize: 14.4,
      },
    },
    "& > button": {
      marginTop: 25,
      marginBottom: 20,
      // color: theme.palette.primary.contrastText,
      // background: theme.button.primary.background,
      height: 48,
      width: 263,
      borderRadius: 50,
      fontWeight: 500,
      fontSize: 16,
      "@media(max-height: 667px)": {
        marginTop: 20,
        marginBottom: 16,
        height: 38.4,
        width: 208,
        fontSize: 12.8,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        marginTop: 22.5,
        marginBottom: 18,
        height: 43.2,
        width: 234,
        fontSize: 14.4,
      },
    },
  },
  interactionBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > p": {
      width: "100%",
      fontSize: 16,
      color: "#222",
      textAlign: "center",
      "@media(max-height: 667px)": {
        fontSize: 12.8,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        fontSize: 14.4,
      },
    },
    "& > div": {
      background: "#3EA9FE",
      border: "2px solid #DAF2FF",
      height: 56,
      width: 56,
      margin: "16px 0",
      "@media(max-height: 667px)": {
        height: 44.8,
        width: 44.8,
        margin: "12.8px 0",
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        height: 50.4,
        width: 50.4,
        margin: "14.4px 0",
      },
      "& > svg": {
        height: 28,
        width: 28,
        "@media(max-height: 667px)": {
          height: 22.4,
          width: 22.4,
        },
        "@media (min-height: 668px) and (max-height: 736px)": {
          height: 25.2,
          width: 25.2,
        },
      },
    },
  },
  rotateWarning: {
    "@media (orientation: portrait)": {
      width: "100%",
      height: "100%",
      background: "#000000",
      margin: "auto",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: 0,
      right: 0,
    },
    "@media (orientation: landscape)": {
      width: "100%",
      height: "100%",
      background: "#000000",
      margin: "auto",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: 0,
      right: 0,
    },
    height: "fit-content",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > img": {
      width: 39,
    },
    "& > p": {
      fontSize: 17,
      lineHeight: "20px",
      textAlign: "center",
      letterSpacing: -0.2,
      color: "#FFFFFF",
      marginTop: 17.26,
      maxWidth: "100%",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
    },
  },
}));
