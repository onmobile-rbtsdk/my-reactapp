/* eslint-disable */

export enum EventType {
  Input = "INPUT",
  Ping = "PING",
  Pause = "PAUSE",
  Resume = "RESUME",
  Leave = "LEAVE",
  Replay = "REPLAY",
  Score = "SCORE",
  FinalScore = "FINAL_SCORE",
  End = "END",
}

export enum WebsocketEventGroups {
  GamePause = "gamePause",
  GameStart = "gameStart",
  GameResume = "gameResume",
  GameReplay = "gameReplay",
  LeaveGame = "leaveGame",
  GameLoaded = "gameLoaded",
  EndGame = "endGame",
  GameSessionId = "gameSessionId",
  AvailablePage = "availablePage",
  ConfirmRunningPage = "confirmRunningPage",
  MouseEvent = "mouseEvent",
  MouseEvents = "mouseEvents",
  Score = "score",
  FinalScore = "finalScore",
  Join = "join",
  LeaveRoom = "leaveRoom",
  BrowserError = "browserError",
  ScreenResolution = "screenResolution",
}

export enum EventsToRegister {
  MouseMove = "mousemove",
  MouseUp = "mouseup",
  MouseDown = "mousedown",
  TouchMove = "touchmove",
  TouchStart = "touchstart",
  TouchEnd = "touchend",
}

export enum Version {
  version1 = "version_1",
  version2 = "version_2",
  version3 = "version_3",
  versionDataset = "version_dataset",
}

export const DELAY_TIME = 3000;

export const LATENCY_TIME = 200;
