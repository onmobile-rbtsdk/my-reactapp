import {
  GameStatus,
  GameType,
  MatchState,
  MomentType,
  NotificationState,
  PlayState,
  RankingOrder,
  RotationMode,
  TRANSACTION_ACTION_TYPE,
  TRANSACTION_CATEGORY,
  Transaction_Types,
  TRANSACTION_WORKFLOW,
  USEREVENT_NOTIFICATION_TYPE,
  UserWalletType,
} from "./enums";
import { UserWallet } from "./others";

export interface IUserRequiredData {
  id: string;
  username: string;
  avatar: string;
}

export interface IUserBaseData extends IUserRequiredData {
  xp: number;
  banner: string;
  email: string;
  phone: string;
  phoneNotification: string;
  facebookId: string;
  googleId: string;
  currency: number;
  pushSubscription: string;
  online: boolean;
  hasWelcome: boolean;
  smsNotification: boolean;
  virtualCoins: number;
  winningsCash: number;
  depositCash: number;
  bonusCash: number;
  totalCash: number;
  billingName?: string;
  billingPhone?: string;
  billingEmail?: string;
  billingCurrency?: string;
  disabled?: null | boolean;
  language?: string;
  currencyLocked?: boolean;
}

interface IWhileAway {
  eventType: string;
  momentType: string;
  gameId: string;
  matchId: string;
  tournamentId: number;
  title: string;
  amount: number;
  playerScore: number;
  opponentScore: number;
  currency: string;
  avatar: string;
  username: string;
}
export interface IUserData extends IUserBaseData {
  nbNotificationsUnread: number;
  nbFriendRequestUnaccepted: number;
  nbBattlesPending: number;
  initialDepositBonus: boolean;
  whileAway?: [IWhileAway];
  user?: IUserBaseData;
  canUseCash?: boolean;
  subscription?: {
    status: string;
    umrid: string;
  };
}

export interface IUserAppStats {
  id: string;
  appId: string;
  totalTimePlayed: number;
  numberOfTimesPlayed: number;
  app: IBaseGame;
}

export interface IUserMomentStats {
  id: string;
  appId: string;
  momentId: string;
  totalTimePlayed: number;
  numberOfTimesPlayed: number;
  moment: IBaseMoment;
}

export interface IBaseActivity {
  gameId: string;
  matchId: string;
  tournamentId: string;
  eventType: USEREVENT_NOTIFICATION_TYPE;
  momentType: MomentType;
  playerScore: number;
  playerRank: number;
  opponentId: string;
  opponentScore: number;
  avatar: string;
  username: string;
  title: string;
  amount: number;
  winAmount: number;
  currency: string;
  startedAt: string;
  expiredAt: string;
  sentReminderAt: string;
  tournamentType: string;
  prizePool: string;
  timeline: {
    type: string;
    title: string;
  };
}

export interface LikedGameStatus {
  gameId: string;
  status: boolean;
  likedCount: number;
}

export interface IBaseListBeatIt {
  tournament: IBaseDailyTournament;
  tournamentInfo: IBaseDailyTournament;
}

export interface IBaseTournamentIdScore {
  id: string;
  username: string;
  avatar: string;
  banner?: string;
  xp?: number;
  tournamentId: string;
  score: number;
}

export interface IUserProfile {
  user: IUserBaseData;
  nbMomentsPlayed: number;
  nbMatchesWon: number;
  nbFriends: number;
  nbTournamentsWon: number;
  winningPercent: number;
  userAppStats: IUserAppStats[];
  userMomentStats: IUserMomentStats[];
  userActivity: IBaseActivity[];
  nbUserPlayedBeatItTournaments?: number;
}

export interface IBaseGame {
  id: string;
  title: string;
  company: string;
  description: string;
  category: string;
  timesPlayed: number;
  rotationMode: RotationMode;
  status: GameStatus;
  type: GameType;
  battleCost: IBattleCost[];
  canUseCash: boolean;
  isLike: boolean;
  likeCount: number;
  totalCompleted: number;
  countMoments: number;
  hasBattle: boolean;
  hasSolo: boolean;
  hasTournament: boolean;
  moment: IBaseMoment[];
  data: string;
  predictedExperience?: number;
  tournaments?: IBaseDailyTournament[];
  isCashBattle?: boolean;
  network?: number;
}

export interface IBaseMomentsList {
  allMoments: IBaseMoment[];
  momentsTutorial: IBaseMoment[];
  momentsNotTutorial: IBaseMoment[];
  momentsBattle: IBaseMoment[];
  haveZoneIdCasualMoments: IBaseMoment[];
}

export interface IBaseMoment {
  id: string;
  appId: string;
  title: string;
  description: string;
  type: string;
  time: number;
  playCost: number;
  unlockXp: number;
  unlockCost: number;
  timesPlayed: number;
  showTimer: boolean;
  momentType: MomentType;
  rankOrder: RankingOrder;
  status: GameStatus;
  isCompleted: boolean;
  app: IBaseGame;
  createdAt: string;
  updatedAt: string;
  zoneId: string;
  snapshotId: string;
  data: string;
}

export interface IBaseGameSession {
  id: string;
  edgeNodeId: string;
  matchId: string;
  host: IUserBaseData;
  controller: string;
  incognito: string;
  isStreamReady: boolean;
  moment: IBaseMoment;
  sessionType: string;
  sessionResults: string;
  title?: string;
  tournamentId?: string;
  tournamentPlayerId?: string;
}

export interface IBaseLeaderboardLeader {
  userId: string;
  score: number;
  rank: number;
  username: string;
  avatar: string;
}

export interface IBaseLeaderboard {
  leaders: IBaseLeaderboardLeader[];
  moment: IBaseMoment;
  error: any;
}

export interface IBaseTournamentPlayers {
  id: string;
  userId: string;
  tournamentId: string;
  user: IUserRequiredData;
  score: number;
  startedAt: string;
  endedAt: string;
  status: string;
}

export interface IBaseChallenge {
  id: string;
  score: number;
  user: IUserBaseData;
  moment: IBaseMoment;
  created_at: string;
}

export interface IBaseBattlePlayer {
  userId: string;
  playState: PlayState;
  score: number;
  self?: boolean;
  user: IUserBaseData;
  id?: string;
}

export interface IBaseMatch {
  fullBattleInfo: any;
  matchId: string;
  hostUserId: string;
  gameSessionId?: string;
  edgeNodeId?: string;
  gameId: string;
  momentId: string;
  expiryTime: string;
  joinedPlayers: number;
  noOfPlayers: number;
  matchState: MatchState;
  inviteCode?: string;
  battleInfo: {
    chargeType: string;
    currency: string;
    costPerUser: number;
    entryFee: number;
    prizePool: number;
    cost: number;
    gameId: string;
  };
  moment: IBaseMoment;
  players: IBaseBattlePlayer[];
  winners: {
    rank: number;
    userId: string;
  };
  endTime: string;
  winAmount?: string;
}

export interface IBaseMatchList {
  count: number;
  matchList: [IBaseMatch] | [];
}

export interface IBaseTransaction {
  type: Transaction_Types;
  walletType: UserWalletType;
  amount: number;
  category: TRANSACTION_CATEGORY;
  transactionType: TRANSACTION_ACTION_TYPE;
  workflow: TRANSACTION_WORKFLOW;
  currency: string;
  gameId: string | null;
  createdAt: number;
  status: string;
  gameTitle: string | null;
  runningBalance: number;
  timeline: string;
  reference: string;
}

export interface IBaseFriendRequest {
  id: string;
  senderId?: string;
  receiverId?: string;
  accepted?: boolean;
  sender?: IUserRequiredData;
  receiver?: IUserRequiredData;
}

export interface IBaseFriend {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  friendUpdateAt: string;
}

export interface IBaseHotBattle {
  matchId: string;
  entryFee: number;
  currency: string;
  costPerUser: number;
  matchState: MatchState;
  host: IUserRequiredData;
  game: IBaseGame;
}

export interface IBaseStoreItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  store_item_category_id: string;
  currency: number;
  definition: string;
  available_at: string;
  expired_at: string;
  created_at: string;
  updated_at: string;
}
export interface IUserDevice {
  info: string;
  screen_size?: string;
}
export interface IBaseStoreItemCategory {
  id: string;
  name: string;
  description: string;
  store_items: IBaseStoreItem[];
}

export interface IBaseNotification {
  id: string;
  userId: string;
  type: string;
  data: string;
  state: NotificationState;
  createdAt: string;
  updatedAt: string;
  timeline: {
    title: string;
    type: string;
  };
}

interface IBattleCost {
  fee: number;
  currency: string;
  cost: number;
}

export interface IBaseGameBattle {
  id: string;
  title: string;
  company: string;
  description: string;
  category: string;
  data: string | null;
  timesPlayed: number | null;
  rotationMode: string;
  status: string;
  type: string;
  hasBattle: boolean | null;
  createdAt: string;
  updatedAt: string;
  moments?: IBaseMoment[];
  likeCount: number;
  isLike: boolean;
  totalCompleted: number;
  battleCost: IBattleCost[];
  tournamentInfo?: IBaseDailyTournament[];
}

export interface IBaseGameForYou {
  id: string;
  title: string;
  company: string;
  description: string;
  category: string;
  data: string | null;
  timesPlayed: number | null;
  rotationMode: string;
  status: string;
  type: string;
  hasBattle: boolean | null;
  battleCost: IBattleCost[];
  canUseCash: boolean;
}

export interface IBaseDailyTournament {
  id: string;
  gameId: string;
  momentId: string;
  momentType: MomentType;
  startedAt: string;
  expiredAt: string;
  status: string;
  currency: string;
  costPerUser: number;
  fee: number;
  playerCount: number;
  rankingOrder: string;
  myRank: number;
  highestScore: number; // old
  leaderboards: IBaseTournamentPlayers[];
  moment: IBaseMoment;
  tournamentType: string;
  avatar?: string;
  username?: string;
  topScore: number;
  totalPrize: number;
  prizePool: string;
  maxPlayers?: number;
  userId?: string;
  calculatedPrizePool: number[];
  __typename?: string;
}

export interface IBaseDiscovery {
  whatsOn: IBaseActivity[];
  pastActivities: IBaseActivity[];
  battlesWon: number;
  tournamentsWon: number;
  gamesForYou: IBaseGame[];
  battlesForYou: IBaseHotBattle[];
  dailyTournaments: IBaseDailyTournament[];
  soloGamesForFun: IBaseGame[];
  moreTournaments: IBaseDailyTournament[];
}

export interface IBaseGetUserArena {
  whatsOn: IBaseActivity[];
  pastActivities: IBaseActivity[];
  cashGain: number;
  coinGain: number;
  battlesWon?: number;
  tournamentsWon?: number;
}

export interface IParamsGetTournament {
  id: string;
  tournamentPlayerId?: string;
  limit?: number;
}

export interface IParamsPlayTournament {
  tournamentId: string;
  device:
    | {
        info: string;
        screen_size?: string;
      }
    | {};
}

export interface IBaseListGames {
  id: string;
  title: string;
  company: string;
  description: string;
  category: string;
  data: string | null;
  timesPlayed: number | null;
  rotationMode: string;
  status: string;
  type: string;
  moment: IBaseMoment;
  battleCost: IBattleCost[];
  canUseCash: boolean;
  isLike: boolean;
  likeCount: number;
  totalCompleted: number;
  countMoments: number;
  tournaments: any;
  hasBattle: boolean | null;
  hasSolo: boolean;
  hasTournament: boolean;
}

export interface IBaseWithdrawal {
  date: string;
  status: string;
  transactionId: string;
}
