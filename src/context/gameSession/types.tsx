import { IBaseGameSession } from "../../types/baseInterfaces";

export default interface IGameSessionsCtx {
  gameSession: IBaseGameSession | null;
  streamStatus: string;
  role: string;
  isMuted: boolean;
  speakerVolume: number;
  setStreamStatus: (status: string) => Promise<any>;
  setGameSession: (gameSession: IBaseGameSession, userId: string) => Promise<any>;
  setVolume: (speakerVolume: number) => Promise<any>;
  toggleMuted: () => Promise<any>;
  toggleIncognito: () => Promise<any>;
  playMoment: () => Promise<any>;
  toggleKickwatcher: (userId: string, message: string) => Promise<any>;
  toggleShowAlerts: (message: string) => Promise<any>;
  changeWatchers: (nbWatchers: number) => Promise<any>;
  setPeer: (p: any) => Promise<any>;
}
