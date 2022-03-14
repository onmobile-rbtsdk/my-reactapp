import { EventType, Version } from "./enums";

export interface IGameSessionEventsCreatePayload {
  gameSessionId: string;
  events: string;
}

export interface IGameSessionEventsUpdatePayload {
  gameSessionId: string;
  events: string;
}

export interface IGameSessionEventsFetchPayload {
  gameSessionId: string;
}

export interface IGameSessionEvent {
  type: string;
  time?: number;
  data?: string;
}

export interface IRegisterEventsConstructor {
  onmoAPI: string | undefined;
  gameSessionId: string;
  gameSeed: number;
  websocket: any;
  version: Version;
  onChangeScore(score: number): void;
  onChangeFinalScore(finalScore: number): void;
  onLoadedDocker(isLoaded: boolean): void;
  onGetEventDataSet?(eventDataset: IEventDataset): void;
}

export interface IGameSessionEventsData {
  gameSessionId: string;
  events: string;
}

export interface IEventSimulate {
  time: number;
  type: string;
  data?: any;
}

export interface IEventDataset {
  [Version.version1]: IEventSimulate[];
  [Version.version2]: IEventSimulate[];
  [Version.version3]: IEventSimulate[];
}

export interface ITouchEvent extends TouchEvent {
  travelledDistance?: number;
  nbMoves?: number;
  time?: number;
}

export interface IMouseEvent extends MouseEvent {
  travelledDistance?: number;
  nbMoves?: number;
  time?: number;
}

export interface IEventData {
  type: EventType;
  data: {
    type: string;
    screenX: number;
    screenY: number;
    clientX: number;
    clientY: number;
  };
  time: number;
  travelledDistance?: number;
  nbMoves?: number;
}

export interface IEventsRegister {
  socketEvents: any;
  onmoAPI: string | undefined;
  gameSessionId: string;
  websocket: any;
  startTime: number | undefined;
  pingIntervalId: any;
  isPausedGame: boolean;
  isResumedGame: boolean;
  currentScore: number;
  finalScore: number | undefined;
  isGameLoaded: boolean;
  mouseMoveEvents: MouseEvent[];
  touchMoveEvents: TouchEvent[];
  version: Version;
  onChangeScore(score: number): void;
  onChangeFinalScore(finalScore: number): void;
  onLoadedDocker(isLoaded: boolean): void;
  initialize(): void;
  sendPing(): void;
  lostInternetMock(): void;
  reconnectInternet(): void;
  setDefault(): void;
  sendEvent: (event: string) => void;
  onGameStart(): void;
  sendGamePause(): void;
  sendGameResume(): void;
  sendLeftGame(): void;
  sendEndGame(): void;
  fetchScore(): void;
  fetchFinalScore(): void;
  register(): void;
  saveMouseEvent(event: MouseEvent, version: Version): void;
  saveTouchEvent(event: TouchEvent, version: Version): void;
  onGetEventDataSet?(eventDataset: IEventDataset): void;
}
