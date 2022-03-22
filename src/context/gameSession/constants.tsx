export const STREAM_STATUS = {
  CONNECTING: "CONNECTING",
  READY: "READY",
  VIDEO_CANNOT_PLAY: "VIDEO_CANNOT_PLAY",
  REQUIRE_INTERACTION: "REQUIRE_INTERACTION",
  OUT_OF_CAPACITY: "OUT_OF_CAPACITY",
  PAUSED: "PAUSED",
  RESUMED: "RESUMED",
  WAITING: "WAITING",
  DISCONNECTED: "DISCONNECTED",
  VIDEO_CAN_PLAY: "VIDEO_CAN_PLAY",
  UNREACHABLE: "UNREACHABLE",
  EDGE_NODE_CRASHED: "EDGE_NODE_CRASHED",
  EXPIRED: "EXPIRED",
  HAS_FINAL_SCORE: "HAS_FINAL_SCORE",
  CONFIRM_TO_LEAVE: "CONFIRM_TO_LEAVE",
  DONE: "DONE",
  SHOW_END_SCREEN: "SHOW_END_SCREEN",
};

export const ROLE = {
  HOST: "HOST",
  WATCHER: "WATCHER",
};

export const INITIAL_STATE = {
  role: ROLE.HOST,
  gameSession: null,
  streamStatus: STREAM_STATUS.CONNECTING,
  isMuted: true,
  speakerVolume: 1,
  setStreamStatus: () => {
    return new Promise<void>(function (resolve, reject) {
      reject();
    });
  },
  setGameSession: () => {
    return new Promise<void>(function (resolve, reject) {
      reject();
    });
  },
};
