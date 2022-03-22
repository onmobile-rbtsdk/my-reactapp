import { ACTIONS } from "./actions";

export default (state: any, action: any) => {
  const { gameSession, role, status } = action;
  switch (action.type) {
    case ACTIONS.SET_STREAM_STATUS: {
      return {
        ...state,
        streamStatus: status,
      };
    }
    case ACTIONS.SET_GAME_SESSION:
      return {
        ...state,
        gameSession,
        role,
      };
    default:
      return state;
  }
};
