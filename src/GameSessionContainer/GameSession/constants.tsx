export const PAGE_CSS_STYLES = {
  html: {
    position: "fixed",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  body: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    padding: 0,
    backgroundColor: "black",
    overflow: "hidden",
    overscrollBehaviorY: "none",
    overscrollBehaviorX: "none",
    width: "100vw",
    height: "100vh",
  },
};

export const ROLE = {
  HOST: "HOST",
  WATCHER: "WATCHER",
};

export const PLAY_STATUS = {
  PENDING: "PENDING",
  CONNECTED: "CONNECTED",
  PLAYING: "PLAYING",
  FINISHED: "FINISHED",
};
