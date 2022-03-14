import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { HtmlGame } from "../HtmlGame";
import { EventsRegister } from "../../../..";
import { IBaseGameSession } from "../../../../models/types/gameSession";
import { io } from "socket.io-client";

const gameSession = {
  id: "326g312u31731872891",
  matchId: "2532653-23782-2",
  sessionType: "BATTLE",
  edgeNodeId: "http://localhost:4100",
  host: {
    id: "1",
    username: "kevin",
  },
  controller: "",
  incognito: "",
  isStreamReady: true,
  sessionResults: "",
  moment: {
    id: "1",
    appId: "appId",
    snapshotId: "snapshotId",
    title: "title",
    momentType: "type",
    description: "",
    type: "",
    showTimer: true,
    time: 30,
    rankOrder: "DESC",
    app: {
      data: JSON.stringify({ name: "allo" }),
      title: "Game",
      type: "score",
      rotationMode: "",
      status: "",
    },
  },
} as IBaseGameSession;

const onmoAPI = `http://localhost:4100`;

describe("EventRegister/HtmlGame", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should render UT_CANVAS when game is loaded", async () => {
    const websocket = io(onmoAPI, {
      transports: ["websocket"],
    });

    const eventsRegister = new EventsRegister({
      onmoAPI: "http://localhost:4100",
      gameSessionId: gameSession.id,
      onChangeScore: jest.fn(),
      onChangeFinalScore: jest.fn(),
      onLoadedDocker: jest.fn(),
      onGetEventDataSet: jest.fn(),
      websocket,
      gameSeed: Date.now(),
    });

    // Render our component
    render(
      <HtmlGame
        gameSession={gameSession}
        isStarted={true}
        setIsLoadedCallback={jest.fn}
        isDockerLoaded={true}
        eventRegister={eventsRegister}
        onChangeScore={jest.fn()}
        onEndGame={jest.fn()}
        gameSeed={Date.now()}
      />
    );

    // Wait for the component to be ren
    const divRoot = await waitFor(() => screen.findByTestId("div-root"));

    // Check final state
    expect(divRoot).toBeDefined();
    const canvas = document.getElementById("UT_CANVAS");
    expect(canvas).toBeDefined();
  });
});
