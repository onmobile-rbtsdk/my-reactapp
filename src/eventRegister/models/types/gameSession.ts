import { UserWalletType, MomentType } from "./enums";

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
  rotationMode: string;
  status: string;
  data: string;
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
  zoneId: string;
  data: string;
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

export type UserWallet = {
  type: UserWalletType;
  currency: string;
  balance: number;
};

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
