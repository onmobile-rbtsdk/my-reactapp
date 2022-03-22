import { createUseStyles } from "react-jss";

const STREAM_RATIO_LANDSCAPE = 64 / 36;

export const useStyles = createUseStyles(() => ({
  root: {
    pointerEvents: "none",
    touchAction: "none",
    maxWidth: "100vw",
    maxHeight: "100vh",
    position: "absolute",
    background: "rgba(255,0,0,0)",
    "@media (max-aspect-ratio: 1/2)": {
      left: `0px !important`,
      right: `0px !important`,
      top: `calc((100vh - (100vw * ${STREAM_RATIO_LANDSCAPE}) - 80px) / 2) !important`,
      bottom: `calc((100vh - (100vw * ${STREAM_RATIO_LANDSCAPE}) - 80px) / 2) !important`,
      "@media(max-height: 667px)": {
        top: `calc((100vh - (100vw * ${STREAM_RATIO_LANDSCAPE}) - 64px) / 2) !important`,
        bottom: `calc((100vh - (100vw * ${STREAM_RATIO_LANDSCAPE}) - 64px) / 2) !important`,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        top: `calc((100vh - (100vw * ${STREAM_RATIO_LANDSCAPE}) - 72px) / 2) !important`,
        bottom: `calc((100vh - (100vw * ${STREAM_RATIO_LANDSCAPE}) - 72px) / 2) !important`,
      },
      "@media (min-height: 848px)": {
        top: `calc((${window.innerHeight}px - (100vw * ${STREAM_RATIO_LANDSCAPE}) - 80px) / 2) !important`,
        bottom: `calc((${window.innerHeight}px - (100vw * ${STREAM_RATIO_LANDSCAPE}) - 80px) / 2) !important`,
      },
      "@media (height: 762px)": {
        //IP 12 mini
        top: `calc((${window.innerHeight}px - (100vw * ${STREAM_RATIO_LANDSCAPE}) - 80px) / 2) !important`,
        bottom: `calc((${window.innerHeight}px - (100vw * ${STREAM_RATIO_LANDSCAPE}) - 80px) / 2) !important`,
      },
    },

    "@media (orientation: landscape)": {
      left: `calc((100vw - 80px - (100vh / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      right: `calc((100vw - 80px - (100vh / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      top: 0,
      bottom: 0,
    },
    "@media (orientation: portrait)": {
      left: `calc((100vw - ((100vh - 80px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      right: `calc((100vw - ((100vh - 80px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      top: 0,
      bottom: 0,
      "@media(max-height: 667px)": {
        top: 0,
        bottom: 0,
        left: `calc((100vw - ((${window.innerHeight}px - 64px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
        right: `calc((100vw - ((${window.innerHeight}px - 64px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      },
      "@media(height: 628px)": {
        //IP7 Full screen
        top: 0,
        bottom: 0,
        left: `calc((100vw - ((100vh - 64px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
        right: `calc((100vw - ((100vh - 64px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      },
      "@media(min-height: 450px) and (max-height: 570px)": {
        //IPhone 7
        top: 0,
        bottom: 0,
        left: `calc((100vw - ((${window.innerHeight}px - 64px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
        right: `calc((100vw - ((${window.innerHeight}px - 64px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        top: 0,
        bottom: 0,
        left: `calc((100vw - ((${window.innerHeight}px - 72px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
        right: `calc((100vw - ((${window.innerHeight}px - 72px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      },
      "@media (min-height: 697px) and (max-height: 711px)": {
        //Iphone 7+
        top: 0,
        bottom: 0,
        left: `calc((100vw - ((100vh - 72px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
        right: `calc((100vw - ((100vh - 72px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      },
    },
  },
  rootLandscape: {
    pointerEvents: "none",
    touchAction: "none",
    maxWidth: "100vw",
    maxHeight: "100vh",
    position: "absolute",
    background: "rgba(255,0,0,0)",
    "@media (orientation: portrait)": {
      left: 0,
      right: 0,
      top: `calc((100vh - 80px - ((100vw) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      bottom: `calc((100vh - 80px - ((100vw) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      "@media(max-height: 667px)": {
        top: `calc((100vh - 64px - ((100vw) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
        bottom: `calc((100vh - 64px - ((100vw) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      },
      "@media (min-height: 668px) and (max-height: 736px)": {
        top: `calc((100vh - 72px - ((100vw) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
        bottom: `calc((100vh - 72px - ((100vw) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      },
    },
    "@media (orientation: landscape)": {
      // left: 0,
      // right: 0,
      // top: `calc((100vh - ((100vw - 80px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      // bottom: `calc((100vh - ((100vw - 80px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      "@media (min-aspect-ratio: 64/36)": {
        left: `calc((100vw - 80px - (100vh * ${STREAM_RATIO_LANDSCAPE})) / 2) !important`,
        right: `calc((100vw - 80px - (100vh * ${STREAM_RATIO_LANDSCAPE})) / 2) !important`,
        top: 0,
        bottom: 0,
      },
      "@media (max-aspect-ratio: 64/36)": {
        left: 0,
        right: 0,
        top: `calc((100vh - ((100vw - 80px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
        bottom: `calc((100vh - ((100vw - 80px) / ${STREAM_RATIO_LANDSCAPE})) / 2)`,
      },
    },
  },
  innerRoot: {
    pointerEvents: "none",
    touchAction: "none",
    position: "relative",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  mask: {
    pointerEvents: "auto",
    touchAction: "auto",
    background: "rgba(0,255,0,0)",
    zIndex: 89,
    position: "absolute",
  },
  greenBackground: {
    background: "green !important",
  },
  notiClickedMask: {
    left: "50%",
    color: "#FFFFFF",
    width: 330,
    height: 44,
    position: "absolute",
    transform: "translate(-50%, 0px)",
    textAlign: "center",
    borderRadius: 20,
    top: "2%",
    background: "rgba(43, 43, 43, 0.8)",
  },
  notiMask: {
    justifyContent: "center",
    display: "flex",
    marginTop: 2,
  },
  warningIcon: {
    marginTop: 6,
    marginRight: 5,
  },
  textNoti: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: 400,
    fontFamily: "Roboto",
  },
}));
