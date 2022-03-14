import axios, { AxiosResponse } from "axios";
import { print } from "graphql";
import gql from "graphql-tag";
import {
  GRAPHQL_GET_GAMESESSION,
  API_SOURCE_ENVIRONMENT,
  APIEnvironment,
  END_GAME_SESSION_QUERY,
} from "./constants/gameSession";
import { IDataGetGameSessionV2, IEndGameResult, IBaseGameSession } from "./types/gameSession";

export class GameSession {
  /**
   * Get App by appID and Moment by momentId
   * Get the apiKey and the endPoint from the config
   * @return {Promise<IMomentDataResponse>} return the app and moment data
   */

  static async getGameSessionV2(payload: IDataGetGameSessionV2): Promise<IBaseGameSession> {
    const getGameSessionV2 = gql`
      ${GRAPHQL_GET_GAMESESSION}
    `;

    const { gameSessionId, onmoEnvironment } = payload;

    const sourceEnvironment = onmoEnvironment || APIEnvironment.Dev;

    const apiData = {
      url: API_SOURCE_ENVIRONMENT[sourceEnvironment].url,
      apiKey: API_SOURCE_ENVIRONMENT[sourceEnvironment].apiKey,
    };

    if (!apiData.url || !apiData.apiKey) {
      throw Error("Missing URL/ Api key code");
    }

    axios.defaults.headers.common["x-api-key"] = apiData.apiKey;

    const response = await axios.post(apiData?.url, {
      query: print(getGameSessionV2),
      variables: {
        getGameSessionInput: { gameSessionId: gameSessionId },
      },
    });

    const result = response.data.data.getGameSessionV2;
    if (!result) {
      throw Error("Something wrong with moment data");
    }
    return result;
  }

  /**
   * Send end html game session
   * @param {IEndGameResult} result - End game result
   * @param {Number} result.score - Score
   * @param {String} result.gameSessionId - Game session id
   * @param {String} result.failureMessage - Failure message
   * @param {Number} result.time - Time
   * @returns {Promise<AxiosResponse<any>>}
   */
  static sendEndHtmlGameSession = async (
    result: IEndGameResult,
    onmoEnvironment?: string
  ): Promise<AxiosResponse<any>> => {
    console.log(`[Send end game session] - ${JSON.stringify(result)}`);

    const sourceEnvironment = onmoEnvironment || APIEnvironment.Dev;

    const apiData = {
      url: API_SOURCE_ENVIRONMENT[sourceEnvironment].url,
      apiKey: API_SOURCE_ENVIRONMENT[sourceEnvironment].apiKey,
    };

    if (!apiData.url || !apiData.apiKey) {
      throw Error("Missing URL/ Api key code");
    }

    const endGameSessionQuery = gql`
      ${END_GAME_SESSION_QUERY}
    `;

    return axios({
      url: apiData.url,
      method: "post",
      headers: {
        "x-api-key": apiData.apiKey,
      },
      data: {
        query: print(endGameSessionQuery),
        variables: {
          endHtmlGameSessionInput: {
            score: result.score,
            time: result.time,
            gameSessionId: result.gameSessionId,
            failureMessage: result.failureMessage || "",
          },
        },
      },
    });
  };
}
