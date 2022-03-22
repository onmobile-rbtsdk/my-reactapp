import React, { useReducer } from "react";
import { IBaseGameSession } from "../../types/baseInterfaces";
import { INITIAL_STATE, ROLE, STREAM_STATUS } from "./constants";
import { setGameSession, setStreamStatus } from "./dispatchers";
import Reducer from "./reducer";

export const GameSessionCtx = React.createContext<any>(INITIAL_STATE);

export default function GameSessionProvider({ children, gameSession: gs, streamStatus }: any) {
  const [state, dispatch] = useReducer(Reducer, {
    ...INITIAL_STATE,
    gameSession: gs,
    role: ROLE.HOST,
    streamStatus: streamStatus || STREAM_STATUS.CONNECTING,
  });

  const setters = {
    setStreamStatus: (status: string) => setStreamStatus(dispatch, status),
    setGameSession: (gameSession: IBaseGameSession, userId: string) => setGameSession(dispatch, gameSession, userId),
  };

  return <GameSessionCtx.Provider value={{ ...state, ...setters }}>{children}</GameSessionCtx.Provider>;
}
