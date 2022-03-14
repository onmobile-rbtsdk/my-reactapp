export enum NotificationState {
  NEW = "NEW",
  SEEN = "SEEN",
  READ = "READ",
}

export enum MATCH_RESULT_STATUS {
  WAITING = "WAITING",
  TIE = "TIE",
  WIN = "WIN",
  LOST = "LOST",
}

export enum GameStatus {
  DRAFT = "DRAFT",
  UPCOMING = "UPCOMING",
  LIVE = "LIVE",
  DISABLED = "DISABLED",
}

export enum GameType {
  STREAM = "STREAM",
  HTML = "HTML",
}

export enum CHALLENGE_RESULT {
  TIE = "TIE",
  WIN = "WIN",
  LOST = "LOST",
}

export enum GameSessionType {
  CASUAL = "CASUAL",
  CHALLENGE = "CHALLENGE",
  BATTLE = "BATTLE",
  TUTORIAL = "TUTORIAL",
  TOURNAMENT = "TOURNAMENT",
}

export enum MomentType {
  TUTORIAL = "TUTORIAL",
  CASUAL = "CASUAL",
  CHALLENGE = "CHALLENGE",
  BATTLE = "BATTLE",
  ZEN = "ZEN",
}

export enum RotationMode {
  PORTRAIT = "PORTRAIT",
  LANDSCAPE = "LANDSCAPE",
  ANY = "ANY",
}

export enum ChronoType {
  daily = "daily",
  weekly = "weekly",
  overall = "overall",
}

export enum RankingOrder {
  "DESC" = "DESC",
  "ASC" = "ASC",
}

export enum PlayState {
  OPEN = "OPEN",
  PLAYING = "PLAYING",
  PLAYED = "PLAYED",
}

export enum MatchState {
  CREATED = "CREATED",
  PLAYING = "PLAYING",
  PLAYED = "PLAYED",
  EXPIRED = "EXPIRED",
}

export enum NotificationType {
  BATTLE_EXPIRED = "BATTLE_EXPIRED",
  BATTLE_WON = "BATTLE_WON",
  BATTLE_LOST = "BATTLE_LOST",
  BATTLE_EXPIRING = "BATTLE_EXPIRING",
  BATTLE_INVITATION = "BATTLE_INVITATION",
  BATTLE_REMINDER = "BATTLE_REMINDER",
  FRIEND_ACCEPTED = "FRIEND_ACCEPTED",
  FRIEND_INVITATION = "FRIEND_INVITATION",
  TOURNAMENT_WON = "TOURNAMENT_WON",
  TOURNAMENT_LOST = "TOURNAMENT_LOST",
  TOURNAMENT_CANCELLED = "TOURNAMENT_CANCELLED",
  BONUS = "BONUS",
}

export enum UserWalletType {
  VIRTUAL = "virtual",
  WINNINGS = "winnings",
  DEPOSIT = "deposit",
  BONUS = "bonus",
}

export enum USEREVENT_NOTIFICATION_TYPE {
  BATTLE_EXPIRED = "BATTLE_EXPIRED",
  BATTLE_WON = "BATTLE_WON",
  BATTLE_LOST = "BATTLE_LOST",
  BATTLE_TIED = "BATTLE_TIED",
  BATTLE_INVITE_SENT = "BATTLE_INVITE_SENT",
  BATTLE_INVITE_RECEIVED = "BATTLE_INVITE_RECEIVED",
  BATTLE_WAITING_OPPONENT = "BATTLE_WAITING_OPPONENT", // Does not exist in the back-end
  BATTLE_REQUEST_EXPIRED = "BATTLE_REQUEST_EXPIRED", // Does not exist in the back-end
  BATTLE_REQUEST_REJECTED = "BATTLE_REQUEST_REJECTED", // Does not exist in the back-end
  TOURNAMENT_WON = "TOURNAMENT_WON",
  TOURNAMENT_LOST = "TOURNAMENT_LOST",
  TOURNAMENT_CANCELLED = "TOURNAMENT_CANCELLED",
  TOURNAMENT_PLAYING = "TOURNAMENT_PLAYING",
  IGNORE = "IGNORE",
}

export enum Transaction_Types {
  debit = "debit",
  credit = "credit",
}

export enum WalletActionTypes {
  Open_Withdraw = "Open_Withdraw",
  Open_Deposit = "Open_Deposit",
  Deposit_Pending = "Deposit_Pending",
  Deposit_Failed = "Deposit_Failed",
  Deposit_Completed = "Deposit_Completed",
  Withdraw_Pending = "Withdraw_Pending",
  Withdraw_Failed = "Withdraw_Failed",
  Withdraw_Completed = "Withdraw_Completed",
  Deposit_Currency_Selection = "Deposit_Currency_Selection",
}

export enum TRANSACTION_CATEGORY {
  WALLET = "wallet",
  BATTLE = "battle",
  TOURNAMENT = "tournament",
  SOLO = "solo",
  OTHER = "other",
}

export enum TRANSACTION_ACTION_TYPE {
  CASH_PAID = "cash_paid",
  COINS_PAID = "coins_paid",
  CASH_WON = "cash_won",
  COINS_WON = "coins_won",
  CASH_REFUNDED = "cash_refunded",
  COINS_REFUNDED = "coins_refunded",
  BONUS_COINS_RECEIVED = "bonus_coins_received",
  BONUS_CASH_RECEIVED = "bonus_cash_received",
  DEPOSIT_SUCCESS = "deposit_success",
  DEPOSIT_FAILED = "deposit_failed",
  WITHDRAWAL_PENDING = "withdrawal_pending",
  WITHDRAWAL_SUCCESS = "withdrawal_success",
  WITHDRAWAL_FAILED = "withdrawal_failed",
  ACCOUNT_ADJUSTED = "account_adjusted",
  COINS_ADJUSTED = "coins_adjusted",
  COINS_PURCHASED = "coins_purchased",
  COINS_PURCHASE_FAILED = "coins_purchase_failed",
  OTHER = "other",
}

export enum TRANSACTION_WORKFLOW {
  depositAdd = "deposit_add", // Completes a real money deposit
  voidDeposit = "void_deposit", // Voids a completed deposit, and removed the money from the user and the escrow wallets
  withdrawalStart = "withdrawal_start", // Starts a real money withdrawal
  withdrawalComplete = "withdrawal_complete", // Completes a real money withdrawal
  withdrawalFail = "withdrawal_fail", // Fails a real money withdrawal and reimburses the user
  battleJoinReal = "battle_join_real", // Joins a battle with real money
  battleCancelReal = "battle_cancel_real", // Cancels a battle with real money
  battleRefundReal = "battle_refund_real", // Refund a battle with real money
  battleWinReal = "battle_win_real", // Pays the winner(s) of a battle with real money
  battleJoinVirtual = "battle_join_virtual", // Joins a coin battle
  battleCancelVirtual = "battle_cancel_virtual", // Cancels a coin battle
  battleRefundVirtual = "battle_refund_virtual", // Refunds a coin battle
  battleWinVirtual = "battle_win_virtual", // Pays the winner(s) of a coin battle
  bonusPay = "bonus_pay", // Pays a bonus to the user
  bonusCancel = "bonus_cancel", // Cancels a bonus
  promotionPayVirtual = "promotion_pay_virtual", // A coin promotion payment
  storePurchaseCoins = "store_purchase_coins", // A coin purchase
  storePurchaseCoinsAddIncome = "store_purchase_coins_add_income", // purchased coins and add income
  voidCoinPurchase = "void_coin_purchase", // Voids a coin purchase, removes the coins from the user wallet
  voidCoinPurchaseAddIncome = "void_coin_purchase_add_income", // Voids the income recognized from a coin purchase
  storePurchaseItemsVirtual = "store_purchase_items_virtual", // A store item purchase
  storeSellItemsVirtual = "store_sell_items_virtual", // A store item sale
  adjAddToDeposit = "adj_add_to_deposit", // Manual adjustment: Adding to the deposit
  adjRemoveFromDeposit = "adj_remove_from_deposit", // Manual adjustment: Removing from the deposit
  adjAddToBonus = "adj_add_to_bonus", // Manual adjustment: Adding to the bonus
  adjRemoveFromBonus = "adj_remove_from_bonus", // Manual adjustment: Removing from bonus
  adjAddToWinnings = "adj_add_to_winnings", // Manual adjustment: Adding to winnings
  adjRemoveFromWinning = "adj_remove_from_winnings", // Manual adjustment: Removing from winnings
  adjAddToVirtual = "adj_add_to_virtual", // Manual adjustment: Adding to coin balance
  adjRemoveFromVirtual = "adj_remove_from_virtual", // Manual adjustment: Removing from coin balance
  adjInternalTransferReal = "adj_internal_transfer_real", // Manual adjustment: Internal transfer of cash
  adjInternalTransferVirtual = "adj_internal_transfer_virtual", // Manual adjustment: Internal transfer of coins
  adjDoInternalDepositReal = "adj_do_internal_deposit_real", // Manual adjustment: Internal deposit of cash
  adjDoInternalWithdrawalReal = "adj_do_internal_withdrawal_real", // Manual adjustment: Internal withdrawal of cash
  adjDoInternalDepositVirtual = "adj_do_internal_deposit_virtual", // Manual adjustment: Internal deposit of coins
  adjDoInternalWithdrawlVirtual = "adj_do_internal_withdrawal_virtual", // Manual adjustment: Interal withdrawal of coins
}

export enum TransactionStatus {
  pending = "pending",
  completed = "completed",
  cancelled = "cancelled",
  expired = "expired",
  played = "played",
}

export enum GameMomentTabsType {
  winCash = "winCash",
  winCoins = "winCoins",
  soloPlay = "soloPlay",
}

export enum SubscriptionStatus {
  pending = "pending",
  subscribed = "subscribed",
  unsubscribed = "unsubscribed",
}
