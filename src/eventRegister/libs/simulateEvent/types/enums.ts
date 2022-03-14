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
  AvailablePage = "availablePage",
  ConfirmRunningPage = "confirmRunningPage",
  MouseEvent = "mouseEvent",
  Score = "score",
  FinalScore = "finalScore",
  Join = "join",
  GameSessionId = "gameSessionId",
  KillDocker = "killDocker",
  LeaveRoom = "leaveRoom",
}
