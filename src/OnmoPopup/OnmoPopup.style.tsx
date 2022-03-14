import { createUseStyles } from "react-jss";
import { ITheme } from "../types/theme";

export const useStyles = createUseStyles((theme: ITheme) => ({
  dialog: {
    zIndex: 1901,
    borderRadius: 15,
  },
  readOnly: {
    pointerEvents: "none",
  },
  root: {
    width: 303,
    height: "fit-content",
    minHeight: 160,
    padding: "20px 20px 0",
    background: "#fff",
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
    justifyContent: "space-between",
    alignItems: "center",
    "@media(max-width: 335px)": {
      width: "calc(100vw - 64px)!important",
      padding: "16px 16px 0 !important",
    },
    "(max-height: 667px)": {
      width: 240,
      minHeight: 128,
      padding: "16px 16px 0",
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      width: 270,
      minHeight: 135,
      padding: "18px 18px 0",
    },
  },
  dialogHeader: {
    textAlign: "center",
    "& > img": {
      margin: "25px 0",
    },
    "&.overImage": {
      "& > img": {
        position: "absolute",
        top: -60,
        left: "33%",
        margin: 0,
        maxWidth: "40%",
      },
      "& > p": {
        paddingTop: "34%",
        "@media(max-height: 600px)": {
          paddingTop: "20%",
        },
      },
    },
    "& > p": {
      width: "100%",
      fontWeight: 500,
      fontSize: 17,
      textAlign: "center",
      color: "#222",
      marginBottom: 20,
      "@media(max-height: 667px)": {
        marginBottom: 16,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        marginBottom: 18,
      },
    },
  },
  dialogFooter: {
    width: "100%",
    marginTop: 6,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    "@media(max-height: 667px)": {
      marginTop: 4.8,
    },
    "@media (min-height: 668px) and (max-height: 736px)": {
      marginTop: 5.4,
    },
    "& > button": {
      width: "100%",
      padding: "0 16px",
      height: 48,
      minWidth: 128,
      fontSize: 16,
      marginBottom: 8,
      //color: theme.palette.primary.main,
      "&:nth-child(2)": {
        fontWeight: 400,
      },
      "@media(max-height: 600px)": {
        fontSize: 12.8,
      },
    },
  },
  redText: {
    "& > button": {
      "&:nth-child(1)": {
        fontWeight: 400,
        color: "#222",
      },
      "&:nth-child(2)": {
        fontWeight: 500,
        color: "#BF0E08",
      },
    },
  },
  isPriorityConfirm: {
    "& > button": {
      "&:nth-child(1)": {
        fontWeight: 400,
      },
      "&:nth-child(2)": {
        fontWeight: 500,
      },
    },
  },
  btnDisable: {
    color: "#898989 !important",
    pointerEvents: "none",
  },
  bold: {
    fontWeight: "bold",
  },
  btnAgree: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overTop: {
    overflow: "inherit",
  },
  closeIcon: {
    zIndex: 1,
    right: 15,
    position: "absolute",
  },
}));
