import { AxiosResponse } from "axios";
import { io, Socket } from "socket.io-client";
import { GameSession } from "../../models/gameSession";
import {
  IEventSimulate,
  IMouseEvent,
  IGameStartEvent,
  IGamePauseEvent,
  IGameResumeEvent,
  IEventPrescription,
  IReplayEvent,
  IEndGameEvent,
  ILeaveGameEvent,
  IGameSessionIdEvent,
  IDataSimulate,
  IRegisterEventsConstructor,
  IBaseGameSession,
  IBaseMoment,
  IEventDataset,
} from "./types";
import { EventType, WebsocketEventGroups } from "./types/enums";

declare global {
  interface Window {
    setZeroTimeout: Function;
  }
}

(function () {
  const timeouts: any = [];
  const messageName = "zero-timeout-message";
  function setZeroTimeout(fn: any) {
    timeouts.push(fn);
    window.postMessage(messageName, "*");
  }
  function handleMessage(event: any) {
    if (event.source === window && event.data === messageName) {
      event.stopPropagation();
      if (timeouts.length > 0) {
        var fn = timeouts.shift();
        fn();
      }
    }
  }
  window.addEventListener("message", handleMessage, true);
  window.setZeroTimeout = setZeroTimeout;
})();

// @ts-ignore
const onmoHtmlGame = window.onmoHtmlGame;

const LOST_INTERNET_DELAY_TIME_OUT = 3000;

export class SimulateEvent {
  canvas = document.createElement("canvas");
  onmoAPI: string = "";
  gameSession?: IBaseGameSession | undefined = undefined;
  moment: IBaseMoment | undefined = undefined;
  websocket: Socket | null = null;
  eventsToSimulate: IEventSimulate[] | undefined = [];
  startTime: number = 0;
  dockerStartTime: number = 0;
  pingTime: number = 0;
  killDockerTimeoutId: number | undefined | null = undefined;
  momentTimeoutId: number | undefined | null = undefined;
  canvasId?: string;
  allScores: number[] = [];
  isPausedGame: boolean = false;
  delayTime: number = 3000;
  isLostInternet: boolean = false;
  lastPing: number | undefined = undefined;
  gameSessionId: string | undefined = undefined;
  onmoEnvironment: string | undefined = undefined;
  isReplayed: boolean = false;
  isGameStarted: boolean = false;
  isEndGame: boolean = false;
  pauseDuration: number = 0;
  pauseStartTime: number = 0;
  isSentFinalScore: boolean = false;
  isSentEndGame: boolean = false;
  dockerTimeout: number = 60000;
  isTestingDataset: boolean = false;
  onRelay: (isReplay: boolean) => void;
  onFetchGameSession: (gameSession: IBaseGameSession) => void;
  onChangeScore: (score: number) => void;

  /**
   * Constructor
   * @param {String} onmoAPI - Websocket endpoint
   * @param {String} canvasId - Canvas id
   * @param {Number} delayTime - Delay time to simulate events
   * @param {String} onmoEnvironment - Onmo environment: dev/staging/prod
   * @param {Function} onRelay - Function listen on replay event
   * @param {Function} onFetchGameSession - Function listen on fetch game session result
   */
  constructor({
    onmoAPI,
    canvasId,
    delayTime,
    onmoEnvironment,
    eventDataset,
    onRelay,
    onFetchGameSession,
    onChangeScore,
  }: IRegisterEventsConstructor) {
    this.onmoAPI = onmoAPI;
    this.canvasId = canvasId ? canvasId : "UT_CANVAS";
    this.delayTime = delayTime;
    this.onmoEnvironment = onmoEnvironment;
    this.onRelay = onRelay;
    this.onFetchGameSession = onFetchGameSession;
    this.onChangeScore = onChangeScore;

    if (eventDataset) {
      this.initializeDataset(eventDataset);
    } else {
      this.initializeData();
      this.onGameStart();
    }
  }

  /**
   * Set default value for some params
   * @returns {void}
   */
  setDefault = (): void => {
    this.allScores = [];
    this.pingTime = 0;
    this.killDockerTimeoutId = undefined;
    this.moment = undefined;
    this.momentTimeoutId = undefined;
    this.eventsToSimulate = [];
    this.startTime = 0;
    this.dockerStartTime = 0;
    this.isPausedGame = false;
    this.isLostInternet = false;
    this.lastPing = undefined;
    this.gameSessionId = undefined;
    this.gameSession = undefined;
    this.isReplayed = false;
    this.isGameStarted = false;
    this.isEndGame = false;
    this.isSentFinalScore = false;
    this.isSentEndGame = false;
  };

  /**
   * Initialize data
   * @returns {void}
   */
  initializeData = (): void => {
    this.setDefault();

    this.websocket = io(this.onmoAPI, {
      transports: ["websocket"],
    });
  };

  /**
   *
   * @param {IEventDataset} eventDataset
   * @returns {Promise<void>}
   */
  initializeDataset = async (eventDataset: IEventDataset): Promise<void> => {
    if (!eventDataset) return;
    this.setDefault();
    this.eventsToSimulate = eventDataset?.data;
    this.gameSessionId = eventDataset?.gameSessionId;
    this.isTestingDataset = true;

    const gameSession = await this.getGameSession(this.gameSessionId);
    if (gameSession) {
      this.gameSession = gameSession;
    }
  };

  /**
   * Listen to start game/ mouse events
   * @param {string} data
   * @returns {void}
   */

  onGameStart = async () => {
    try {
      this.websocket?.on(WebsocketEventGroups.GameSessionId, async (data: IGameSessionIdEvent) => {
        const gameSessionId = data.gameSessionId;

        this.websocket?.emit(WebsocketEventGroups.Join, {
          room: gameSessionId,
        });

        this.gameSessionId = gameSessionId;
        this.gameSessionId = data.gameSessionId;
        const gameSession = await this.getGameSession(data.gameSessionId);

        this.gameSession = gameSession;
        this.moment = gameSession?.moment;
      });

      this.websocket?.on(WebsocketEventGroups.MouseEvent, (data: string) => {
        if (!this.gameSession || this.isSentEndGame || this.isSentFinalScore) return;
        const parsedData = JSON.parse(data);
        this.sortEvents(parsedData);

        if (this.isLostInternet) {
          console.log(`[Reconnected internet] - Game session - ${this.gameSessionId}`);
          this.requestSimulate();
        }
      });

      this.websocket?.on(WebsocketEventGroups.GameStart, (data: IGameStartEvent) => {
        if (!this.gameSession) return;

        if (this.startTime === 0) {
          this.startGame();
          this.startTime = data.time;
        }
      });

      this.websocket?.on(WebsocketEventGroups.GamePause, (data: IGamePauseEvent) => {
        if (!this.gameSession) return;
        this.sortEvents(data);
      });

      this.websocket?.on(WebsocketEventGroups.GameResume, (data: IGameResumeEvent) => {
        if (!this.gameSession) return;
        this.sortEvents(data);

        if (this.isPausedGame) {
          this.requestSimulate();
        }
      });

      this.websocket?.on(WebsocketEventGroups.LeaveGame, async (data: ILeaveGameEvent) => {
        if (!data.time) {
          return this.leaveGame();
        }
        if (!this.gameSession) return;
        this.sortEvents(data);

        if (this.isPausedGame) {
          this.requestSimulate();
        }
      });

      this.websocket?.on(WebsocketEventGroups.GameReplay, (data: IReplayEvent) => {
        if (this.isReplayed || !this.gameSession) return;
        this.isReplayed = true;
        const event = {
          time: data.time - this.startTime,
          type: EventType.Replay,
        };
        this.sortEvents(event);
      });

      this.websocket?.on(WebsocketEventGroups.EndGame, (data: IEndGameEvent) => {
        this.sortEvents(data);

        if (this.isPausedGame) {
          this.requestSimulate();
        }
      });

      this.websocket?.on(WebsocketEventGroups.KillDocker, () => {
        this.killDocker();
      });
    } catch (e) {
     // console.log(`[ERROR - On start game] - game session - ${this.gameSessionId} - ${e?.message}`);
    }
  };

  /**
   * Start the game
   * @returns {void}
   */
  startGame = async (): Promise<void> => {
    try {
      if (this.isGameStarted || !this.gameSession || !this.moment) return;
      this.isGameStarted = true;
      await new Promise((resolve, reject) => {
        this.momentTimeoutId = window.setTimeout(async () => {
          try {
            console.log(`[Game started] - Game session - ${this.gameSessionId}`);
            // @ts-ignore
            onmoHtmlGame?.resume();
            this.dockerStartTime = Date.now();
            this.startMomentTimeout(0);
            await this.requestSimulate();
            resolve("");
          } catch (e) {
            reject(e);
          }
        }, this.delayTime);
      });
    } catch (e) {
      //console.log(`[ERROR - Start game] - game session - ${this.gameSessionId} - ${e?.message}`);
    }
  };

  startGameFromDataset = async () => {
    onmoHtmlGame?.resume();
    this.dockerStartTime = Date.now();
    this.startMomentTimeout(0);
    await this.requestSimulate();
  };

  /**
   * Pause game
   * @returns {void}
   */
  pauseGame = (): void => {
    if (this.isPausedGame || !this.gameSession) return;
    console.log(`[Game paused] - Game session - ${this.gameSessionId}`);
    this.isPausedGame = true;
    onmoHtmlGame?.pause();
    this.stopMomentTimeout();
    this.pauseStartTime = Date.now();
  };

  /**
   * Leave the game
   * @returns {Promise<void>}
   */
  leaveGame = async (): Promise<void> => {
    try {
      if (!this.gameSession) return;
      console.log(`[Left Game] - Game session - ${this.gameSessionId}`);
      onmoHtmlGame?.pause();
      this.stopMomentTimeout();
      this.sendFinalScore();
      await this.sendEndGameSession(-1);
    } catch (e) {
      //console.log(`[ERROR - Leave game] - game session - ${this.gameSessionId} - ${e?.message}`);
    }
  };

  /**
   * Resume the game
   * @returns {void}
   */
  resumeGame = (): void => {
    if (!this.isPausedGame || !this.gameSession) return;
    console.log(`[Game Resumed] - Game session - ${this.gameSessionId} - Resume Game`);
    this.isPausedGame = false;
    onmoHtmlGame?.resume();
    this.pauseDuration = this.pauseDuration + Date.now() - this.pauseStartTime;
    this.startMomentTimeout(this.pauseDuration);
  };

  /**
   * End game
   * @returns {Promise<void>}
   */
  endGame = async (): Promise<void> => {
    try {
      if (this.isEndGame || !this.gameSession) return;
      this.isEndGame = true;
      console.log(`[End Game] - Game session - ${this.gameSessionId}`);
      if (this) onmoHtmlGame?.pause();
      this.stopMomentTimeout();
      this.sendFinalScore();
      await this.sendEndGameSession();
    } catch (e) {
     // console.log(`[ERROR - End game] - game session - ${this.gameSessionId} - ${e?.message}`);
    }
  };

  /**
   * Replay the game
   * @returns {void}
   */
  replayGame = (): void => {
    try {
      if (!this.gameSession) return;
      console.log(`[Replayed Game] - Game session - ${this.gameSessionId}`);
      this.leaveRoom();
      this.initializeData();
      this.stopMomentTimeout();
      this.stopDockerTimeout();
      this.onRelay(true);
    } catch (e) {
    //  console.log(`[ERROR - Replay game] - game session - ${this.gameSessionId} - ${e?.message}`);
    }
  };

  leaveRoom = () => {
    this.websocket?.emit(WebsocketEventGroups.LeaveRoom, {
      room: this.gameSessionId,
    });
  };

  /**
   * Sort events list
   * @param {IEventSimulate} event
   * @returns {void}
   */
  sortEvents = (event: IEventSimulate): void => {
    this.eventsToSimulate?.push(event);
    this.eventsToSimulate?.sort((a, b) => b.time - a.time);
  };

  /**
   * Simulate mouse events
   * @param {HTMLElement} canvas
   * @param {IDataSimulate} data
   */
  simulateMouseEvent = (canvas: HTMLElement, data: IDataSimulate) => {
    switch (data.type) {
      case "touchstart":
        data.type = "mousedown";
        break;
      case "touchmove":
        data.type = "mousemove";
        break;
      case "touchend":
        data.type = "mouseup";
        break;
      default:
        // If event is mouse event, no need to check
        break;
    }

    const event = new MouseEvent(data.type, {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: data.x,
      clientY: data.y,
    });

    canvas.dispatchEvent(event);
  };

  /**
   * Set prescription
   * @param {IMouseEvent} event
   * @returns {IEventPrescription}
   */
  setPrescription = (event: IMouseEvent): IEventPrescription => {
    const isOverWidth = window.innerWidth / window.innerHeight > event.screenX / event.screenY;

    const fixByX = window.innerWidth / event.screenX;
    const fixByY = window.innerHeight / event.screenY;

    const x = isOverWidth
      ? (window.innerWidth - event.screenX * fixByY) / 2 + event.clientX * fixByY
      : event.clientX * fixByX;
    const y = isOverWidth
      ? event.clientY * fixByY
      : (window.innerHeight - event.screenY * fixByX) / 2 + event.clientY * fixByX;

    return { type: event.type, x: x, y: y };
  };

  /**
   * Simulate event
   * @param {IEventSimulate} event
   * @returns
   */
  simulateEvent = (event: IEventSimulate): void => {
    if (!this.canvasId) return;
    const node = document.getElementById(this.canvasId);
    if (!node || !event || !event.data) return;
    this.simulateMouseEvent(node, this.setPrescription(JSON.parse(event?.data)));
  };

  /**
   * Request simulate event
   * @returns {void}
   */
  requestSimulate = (): void => {
    let currentEvent: IEventSimulate | undefined = undefined;
    const simulate = async () => {
      // @ts-ignore
      if (window.is_running === false) {
        console.log(`[Stopped simulate] - Game session - ${this.gameSessionId}`);
        return;
      }
      if (this.isSentEndGame || this.isSentFinalScore) return;

      if (!currentEvent) {
        currentEvent = this.eventsToSimulate?.pop();
      }

      const elapsedMs = Date.now() - this.dockerStartTime;

      // If no events received, check lost internet status
      if (!currentEvent) {
        await this.processLostInternetStatus();
        if (this.isLostInternet) return;
        window.setZeroTimeout(simulate);
        return;
      }

      if (currentEvent && elapsedMs < currentEvent.time) {
        window.setZeroTimeout(simulate);
        return;
      }

      // Stop docker time out when have events
      this.stopDockerTimeout();

      if (currentEvent?.type !== EventType.Input) {
        await this.processGameState(currentEvent);

        if (
          currentEvent?.type === EventType.Replay ||
          currentEvent.type === EventType.Leave ||
          currentEvent.type === EventType.End ||
          currentEvent.type === EventType.Pause
        ) {
          return;
        }

        currentEvent = undefined;
        window.setZeroTimeout(simulate);
        return;
      }

      this.simulateEvent(currentEvent);
      currentEvent = undefined;
      window.setZeroTimeout(simulate);
    };
    window.setZeroTimeout(simulate);
  };

  /**
   * Start docker 1 minutes time out
   * @returns {Promise<string>}
   */
  startDockerTimeout = async (): Promise<string> => {
    console.log(`[Start docker timeout] - Game session - ${this.gameSessionId}`);
    // Start time out to kill docker
    return new Promise((resolve, reject) => {
      this.killDockerTimeoutId = window.setTimeout(async () => {
        try {
          await this.endGame();
          resolve("end game");
        } catch (e) {
          reject(e);
        }
      }, this.dockerTimeout);
    });
  };

  /**
   * Stop docker time out
   * @returns {void}
   */
  stopDockerTimeout = (): void => {
    if (!this.isLostInternet || !this.killDockerTimeoutId) return;
    console.log(`[Stop docker timeout] - Game session - ${this.gameSessionId}`);

    this.isLostInternet = false;
    window.clearTimeout(this.killDockerTimeoutId);
    this.killDockerTimeoutId = null;
  };

  /**
   * Start moment time out
   * @returns {void}
   */
  startMomentTimeout = async (pauseDuration: number): Promise<void> => {
    if (!this.moment) return;
    console.log(`[Start moment time out] - Game session - ${this.gameSessionId}`);

    const playedDuration = Date.now() - this.dockerStartTime - pauseDuration;

    const timeout = this.moment?.time * 1000 - playedDuration;

    return new Promise((resolve, reject) => {
      this.momentTimeoutId = window.setTimeout(async () => {
        try {
          console.log(`[Moment has time out] - Game session - ${this.gameSessionId}`);
          onmoHtmlGame?.pause();
          this.sendFinalScore();
          await this.sendEndGameSession();
          resolve();
        } catch (e) {
          reject(e);
        }
      }, timeout);
    });
  };

  /**
   * Stop moment time out
   * @returns {void}
   */
  stopMomentTimeout = (): void => {
    if (!this.momentTimeoutId) return;
    console.log(`[Stop moment time out] - Game session - ${this.gameSessionId}`);
    window.clearTimeout(this.momentTimeoutId);
    this.momentTimeoutId = null;
  };

  /**
   * Update score
   * @param {Number} score
   * @returns {void}
   */
  updateScore = (score: number): void => {
    try {
      if (!this.gameSessionId) return;
      this.sendScore(score);
      this.allScores.push(score);
    } catch (e) {
    //  console.log(`[ERROR - Update score] - game session - ${this.gameSessionId} - ${e?.message}`);
    }
  };

  /**
   * Send the score to the front end
   * @param {Number} score
   * @returns {void}
   */
  sendScore = (score: number): void => {
    console.log(`[Send score] - Game session - ${this.gameSessionId} - score: ${score}`);
    this.websocket?.emit(WebsocketEventGroups.Score, {
      gameSessionId: this.gameSessionId,
      score,
    });
  };

  /**
   * Send final score to the front end
   * @returns {void}
   */
  sendFinalScore = (): void => {
    if (this.isSentFinalScore || !this.gameSessionId) return;
    this.isSentFinalScore = true;
    const finalScore = this.allScores[this.allScores.length - 1];
    console.log(`[Send final score] - Game session - ${this.gameSessionId} - final score: ${finalScore}`);
    this.websocket?.emit(WebsocketEventGroups.FinalScore, {
      gameSessionId: this.gameSessionId,
      finalScore,
    });
  };

  /**
   * Send Game loaded state
   * @returns {void}
   */
  sendGameLoaded = (): void => {
    try {
      console.log(`[Send game loaded] - Game session - ${this.gameSessionId}`);
      this.websocket?.emit(WebsocketEventGroups.GameLoaded, {
        gameSessionId: this.gameSessionId,
        event: { time: Date.now() },
      });
    } catch (e) {
     // console.log(`[ERROR - Send game loaded] - game session - ${this.gameSessionId} - ${e?.message}`);
    }
  };

  /**
   * Process game states
   * @param {IEventSimulate} event
   * @returns {Promise<void>}
   */
  processGameState = async (event: IEventSimulate): Promise<void> => {
    switch (event.type) {
      case EventType.Pause:
        this.pauseGame();
        break;
      case EventType.Resume:
        this.resumeGame();
        break;
      case EventType.Ping:
        this.lastPing = Date.now();
        break;
      case EventType.Leave:
        await this.leaveGame();
        break;
      case EventType.End:
        await this.endGame();
        break;
      case EventType.Replay:
        this.replayGame();
        break;
      default:
        console.warn("Event type does not exist");
        break;
    }
  };

  /**
   * Process lost internet status
   * @returns {Promise<void>}
   */
  processLostInternetStatus = async (): Promise<void> => {
    if (!this.lastPing) return;
    const duration = Date.now() - this.lastPing;

    if (duration > LOST_INTERNET_DELAY_TIME_OUT) {
      if (this.isLostInternet) return;
      console.log(`[Lost internet] - Game session - ${this.gameSessionId}`);
      this.isLostInternet = true;
      await this.startDockerTimeout();
    }
  };

  /**
   * Send end game session
   * @param {Number} score
   * @returns {Promise<AxiosResponse<any> | null>}
   */
  sendEndGameSession = async (score?: number): Promise<AxiosResponse<any> | null> => {
    if (this.isSentEndGame || !this.gameSessionId || this.isTestingDataset) return null;
    this.isSentEndGame = true;
    return GameSession.sendEndHtmlGameSession(
      {
        score: score || this.allScores[this.allScores.length - 1],
        time: Math.round((Date.now() - this.dockerStartTime) / 1000),
        gameSessionId: this.gameSessionId,
      },
      this.onmoEnvironment
    );
  };

  /**
   * Get game session
   * @param {String} gameSessionId
   * @returns {Promise<void>}
   */
  getGameSession = async (gameSessionId: string): Promise<any> => {
    if (!gameSessionId) return;
    try {
      const gameSession = await GameSession.getGameSessionV2({ gameSessionId, onmoEnvironment: this.onmoEnvironment });

      this.onFetchGameSession(gameSession);

      return gameSession;
    } catch (e) {
     // console.log(e?.message);
    }
  };

  /**
   * Kill docker
   */
  killDocker = (): void => {
    //@ts-ignore
    console.log("[Simulation] - kill docker");
    // @ts-ignore
    window.is_running = false;
  };
}
