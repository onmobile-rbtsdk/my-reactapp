import { IBaseGameSession } from "../../types/baseInterfaces";
import { ACTIONS } from "./actions";
import { ROLE } from "./constants";

export const setStreamStatus = (dispatch: React.Dispatch<any>, status: string) => {
  dispatch({ type: ACTIONS.SET_STREAM_STATUS, status });
};

export const setGameSession = (dispatch: React.Dispatch<any>, gameSession: IBaseGameSession, userId: string) => {
  let role = null;
  if (gameSession) {
    role = gameSession?.host?.id === userId ? ROLE.HOST : ROLE.WATCHER;
  }
  dispatch({ type: ACTIONS.SET_GAME_SESSION, gameSession, role });
};
