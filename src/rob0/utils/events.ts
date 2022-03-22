import { EventNames } from "../constants/events";

export const getEventNameFromPath = (pathname: string) => {
  if (pathname.indexOf("/app/bottom-nav/top-nav/games") > -1) return EventNames.PAGE_GAMES;
  else if (pathname.indexOf("/battles/join") > -1) return EventNames.PAGE_BATTLE_JOIN;
  else if (pathname.indexOf("/app/battles/v4/create") > -1) return EventNames.PAGE_BATTLE_CREATE;
  else if (pathname.indexOf("/battles/end-screen") > -1) return EventNames.PAGE_BATTLE_END_SCREEN;
  else if (pathname.indexOf("/app/battles/select-game") > -1) return EventNames.PAGE_BATTLE_SELECT_GAME;
  else if (pathname.indexOf("/app/battles/top-game-for-battle") > -1) return EventNames.PAGE_BATTLE_TOP_GAME;
  else if (pathname.indexOf("/battles/leaderboard") > -1) return EventNames.PAGE_BATTLE_LEADERBOARD;
  else if (pathname.indexOf("/app/bottom-nav/top-nav/battles") > -1) return EventNames.PAGE_BATTLE;
  else if (pathname.indexOf("/app/feedback-for-coins") > -1) return EventNames.PAGE_FEEDBACK;
  else if (pathname.indexOf("/html-games") > -1) return EventNames.PAGE_HTML_GAMES;
  else if (pathname.indexOf("/app/bottom-nav/top-nav/friends") > -1) return EventNames.PAGE_FRIENDS;
  else if (pathname.indexOf("/app/me") > -1) return EventNames.PAGE_ME;
  else if (pathname.indexOf("/app/transaction-history") > -1) return EventNames.PAGE_TRANSACTION;
  else if (pathname.indexOf("/authenticate/reset-password") > -1) return EventNames.PAGE_RESET_PASSWORD;
  else if (pathname.indexOf("/app/bottom-nav/discover/all-top-lives") > -1) return EventNames.PAGE_TOP_LIVES;
  else if (pathname.indexOf("/app/bottom-nav/discover/all-challenges") > -1) return EventNames.PAGE_ALL_CHALLENGES;
  else if (pathname.indexOf("/user") > -1) return EventNames.PAGE_USER;
  else if (pathname.indexOf("/game-session") > -1 && pathname.indexOf("/end-screen") > -1)
    return EventNames.PAGE_GAME_SESSION_END_SCREEN;
  else if (pathname.indexOf("/game-session") > -1) return EventNames.PAGE_GAME_SESSION;
  else if (pathname.indexOf("/app/about-us") > -1) return EventNames.PAGE_ABOUT_US;
  else if (pathname === "/app/bottom-nav/top-nav/discover") return EventNames.PAGE_HOME;
  else return "";
};
