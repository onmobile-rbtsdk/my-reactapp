export type GetGameSessionInput = {
  gameSessionId: string;
};
/* eslint-disable */
export const GRAPHQL_GET_GAMESESSION = /* GraphQL */ `
  mutation GetGameSessionV2($getGameSessionInput: GetGameSessionInput!) {
    getGameSessionV2(getGameSessionInput: $getGameSessionInput) {
      id
      edgeNodeId
      matchId
      host {
        id
        username
      }
      controller
      incognito
      isStreamReady
      moment {
        id
        appId
        snapshotId
        title
        description
        type
        momentType
        showTimer
        time
        rankOrder
        data
        app {
          title
          rotationMode
          type
          data
          status
        }
      }
      sessionType
      sessionResults
    }
  }
`;

export const END_GAME_SESSION_QUERY = `
mutation EndHtmlGameSession(
  $endHtmlGameSessionInput: EndHtmlGameSessionInput!
) {
  endHtmlGameSession(endHtmlGameSessionInput: $endHtmlGameSessionInput)
}
`;

export enum APIEnvironment {
  Dev = "dev",
  Staging = "staging",
  prod = "prod",
}

export type APISourceEnvironmentObject = {
  [key: string]: {
    url: string;
    apiKey: string;
  };
};

export const API_SOURCE_ENVIRONMENT: APISourceEnvironmentObject = {
  dev: {
    url: "https://qgt775bmejdcxfkidvudqnzh4y.appsync-api.us-east-1.amazonaws.com/graphql",
    apiKey: "da2-wvvxsfy2u5gr7j22phzcg2jnqe",
  },
  staging: {
    url: "https://6ccgxu5qsrhnxcze76hhsfvlnu.appsync-api.us-east-1.amazonaws.com/graphql",
    apiKey: "da2-a3vegakyjbgtnlqptttyovymoy",
  },
  prod: {
    url: "https://fvzqqnwjbrdmlktmb7z33vc6xa.appsync-api.ap-south-1.amazonaws.com/graphql",
    apiKey: "da2-cizxfcsdezciloa4jqauthlkuq",
  },
};
