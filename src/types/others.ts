import { UserWalletType } from "./enums";

export interface IMatchResult {
  winner: any;
  status: string;
}
export interface IAPIOptions {
  forceCall: Boolean;
}

export interface ISessionResults {
  results: {
    time: number;
    score: number;
    failureMessage: string | null;
    bestScore: number;
    currentScorePercentile: number;
    targetScore: number;
  };
}

export interface IUrlParams {
  gameId: string;
  momentId: string;
}

export type UserWallet = {
  type: UserWalletType;
  currency: string;
  balance: number;
};
