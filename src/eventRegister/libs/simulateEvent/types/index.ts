import { EventType } from "./enums";

export interface IDataSimulate {
  type: string;
  x: number;
  y: number;
}

export interface IRegisterEventsConstructor {
  onmoAPI: string;
  canvasId?: string;
  delayTime: number;
  onmoEnvironment: string | undefined;
  eventDataset?: IEventDataset;
  onRelay(isReplay: boolean): void;
  onFetchGameSession(gameSession: IBaseGameSession): void;
  onChangeScore(score: number): void;
}

export interface IEventDataset {
  gameSessionId: string;
  data: IEventSimulate[];
}

export interface IEventSimulate {
  time: number;
  type: EventType;
  data?: string;
}

export interface IMouseEvent {
  clientX: number;
  clientY: number;
  screenX: number;
  screenY: number;
  type: EventType;
}

export interface IGameStartEvent {
  time: number;
}

export interface IGamePauseEvent {
  type: EventType.Pause;
  time: number;
}

export interface IGameResumeEvent {
  type: EventType.Resume;
  time: number;
}

export interface ILeaveGameEvent {
  type: EventType.Leave;
  time: number;
}

export interface IEndGameEvent {
  type: EventType.End;
  time: number;
}

export interface IReplayEvent {
  type: EventType.Replay;
  time: number;
}

export interface IConfirmPageEvent {
  page: string;
  gameSessionId: string;
}

export interface IGameSessionIdEvent {
  gameSessionId: string;
}

export interface IEventPrescription {
  type: EventType;
  x: number;
  y: number;
}

export interface IMomentDataResponse {
  app: any;
  moment: any;
}

export interface IDataGameInfo {
  moment: any;
  app: any;
}

export interface IGetMomentDataPayload {
  gameMomentId?: string;
  gameId?: string;
  onmoEnvironment?: string;
}

export interface IDataGetGameSessionV2 {
  gameSessionId?: string;
  onmoEnvironment?: string;
}

export interface IBaseGame {
  id?: string;
  title: string;
  timesPlayed?: number;
  hasBattle?: boolean;
  description?: string;
  type: string;
  data: string;
  rotationMode: string;
  status: string;
}

export interface IBaseMoment {
  id: string;
  appId: string;
  snapshotId: string;
  title: string;
  unlockXp?: number;
  timesPlayed?: number;
  momentType: string;
  description: string;
  type: string;
  showTimer: boolean;
  time: number;
  rankOrder: string;
  app: IBaseGame;
  data: string;
  zoneId: string;
}

export interface IEndGameResult {
  score: number;
  time: number;
  gameSessionId: string;
  failureMessage?: string;
}

export interface IBaseGameSession {
  id: string;
  edgeNodeId: string;
  matchId: string | null;
  host: IUserBaseData;
  controller: string | null;
  incognito: string | null;
  isStreamReady: boolean | null;
  moment: IBaseMoment;
  sessionType: string;
  sessionResults: string | null;
}

export interface IUserBaseData extends IUserRequiredData {
  banner?: string;
  email?: string;
  phone?: string;
  facebookId?: string;
  googleId?: string;
  currency?: number;
  pushSubscription?: string;
  online?: boolean;
  hasWelcome?: boolean;
  username: string;
}

export interface IUserRequiredData {
  id: string;
  username: string;
  avatar?: string;
  xp?: number;
}
