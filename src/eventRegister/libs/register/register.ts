import {
  IRegisterEventsConstructor,
  IEventsRegister,
  IEventSimulate,
  ITouchEvent,
  IMouseEvent,
  IEventDataset,
  IEventData,
} from "./types";
import { DELAY_TIME, EventsToRegister, EventType, LATENCY_TIME, Version, WebsocketEventGroups } from "./types/enums";

const emitEvent = (ws: any, name: string, data: any) => {
  if (!ws) return;
  ws.emit(name, data);
};

export class EventsRegister implements IEventsRegister {
  socketEvents: any;
  onmoAPI: string | undefined;
  gameSessionId: string;
  websocket: any;
  startTime: number | undefined = undefined;
  pingIntervalId: any = 0;
  isPausedGame: boolean = false;
  isResumedGame: boolean = false;
  currentScore: number = 0;
  onChangeScore: (score: number) => void;
  onChangeFinalScore: (score: number) => void;
  onLoadedDocker: (isLoaded: boolean) => void;
  onGetEventDataSet?: (eventDataset: IEventDataset) => void;
  finalScore: number | undefined = undefined;
  isGameLoaded: boolean = false;
  isReplayed: boolean = false;
  runningPage: string | undefined = undefined;
  isSentEndGame: boolean = false;
  eventDataset: IEventDataset = {
    version_1: [],
    version_2: [],
    version_3: [],
  };
  gameSeed: number = new Date().getTime();
  slotErrorTimeoutId: NodeJS.Timeout | undefined = undefined;
  currentSlot: string | undefined;
  mouseMoveEvents: MouseEvent[] = [];
  touchMoveEvents: ITouchEvent[] = [];
  version: Version = Version.version3;
  isSentScreenResolution: boolean = false;

  constructor({
    onmoAPI,
    gameSessionId,
    onChangeScore,
    onChangeFinalScore,
    onLoadedDocker,
    onGetEventDataSet,
    websocket,
    gameSeed,
    version,
  }: IRegisterEventsConstructor) {
    this.onmoAPI = onmoAPI;
    this.gameSessionId = gameSessionId;
    this.gameSeed = gameSeed;
    this.websocket = websocket;
    this.version = version;

    this.onChangeScore = onChangeScore;
    this.onChangeFinalScore = onChangeFinalScore;
    this.onLoadedDocker = onLoadedDocker;
    this.initialize();
    this.onGetEventDataSet = onGetEventDataSet;
  }

  /**
   * Send Ping event
   * @returns {void}
   */
  sendPing = (): void => {
    this.pingIntervalId = setInterval(() => {
      if (!this.startTime) return;
      console.log("[Register events] - Send Ping");
      this.sendEvent({
        type: EventType.Ping,
        time: Date.now() - this.startTime,
      });
    }, DELAY_TIME);
  };

  stopPing = () => {
    if (!this.pingIntervalId) return;
    clearInterval(this.pingIntervalId);
  };

  /**
   * Lost internet
   * @returns {void}
   */
  lostInternetMock = (): void => {
    this.stopPing();
    this.pingIntervalId = undefined;
  };

  /**
   * Reconnect internet
   * @returns {void}
   */
  reconnectInternet = (): void => {
    console.log("[Register events] - Reconnect internet");
    this.sendPing();
  };

  /**
   * Set default values
   * @return {void}
   */
  setDefault = (): void => {
    console.log("[Register events] - Set default");
    this.startTime = undefined;
    this.isPausedGame = false;
    this.finalScore = undefined;
    this.isGameLoaded = false;
    this.isReplayed = false;
    this.runningPage = undefined;
    this.isSentEndGame = false;
    this.slotErrorTimeoutId = undefined;
    this.isSentScreenResolution = false;
  };

  /**
   * Initialize data
   * @returns {void}
   */
  initialize = (): void => {
    console.log("[Register events] - Initialize");
    this.setDefault();

    if (!this.onmoAPI) return;

    this.onBrowserError();

    this.connectToAvailableSlot();

    this.websocket?.on(WebsocketEventGroups.GameLoaded, () => {
      if (this.slotErrorTimeoutId) {
        clearTimeout(this.slotErrorTimeoutId);
        this.slotErrorTimeoutId = undefined;
        this.websocket?.off(WebsocketEventGroups.BrowserError);
      }

      this.onLoadedDocker(true);
      this.isGameLoaded = true;
    });

    this.fetchFinalScore();
  };

  /**
   * When a page on the simulator crashes, leave room and connect to another page after a timeout
   * Sometimes, the page crashes due to an error that does not affect the game loading process, we can still continue to use that page
   * so the timeout is, if in some delay after the crash the event register doesn't receive the GameLoaded event,
   * we connect to another available page
   * @returns {void}
   */
  onBrowserError = (): void => {
    this.websocket?.on(WebsocketEventGroups.BrowserError, (data: any) => {
      if (data.gameSessionId !== this.gameSessionId || this.slotErrorTimeoutId) return;
      console.log(
        "[Event Register] - Simulation's slot got error, start to connect to another available slot after 10s"
      );
      this.slotErrorTimeoutId = setTimeout(() => {
        console.log("[Event Register] - Start to connect to another available slot");
        this.leaveRoom();
        this.isSentScreenResolution = false;
        this.connectToAvailableSlot();
        this.clearPageErrorTimeout();
      }, 1000 * 10);
    });
  };

  /**
   * Clear page error timeout if we start to connect to another page or receive a GameLoaded event
   * @returns {void}
   */
  clearPageErrorTimeout = (): void => {
    if (!this.slotErrorTimeoutId) return;
    clearTimeout(this.slotErrorTimeoutId);
    this.slotErrorTimeoutId = undefined;
  };

  /**
   * Connect to avaiable slot on simulator
   * One simulator have 4 slots used to simulate the playing process of users
   * We send a gameSessionId to the simulator to check if we have any slot that available
   * If there is a slot, the simulator will send back the slot number via the GameSessionId event
   * Then we will send the screen resolution to the simulator
   * @returns {void}
   */
  connectToAvailableSlot = (): void => {
    this.websocket.emit(WebsocketEventGroups.GameSessionId, {
      gameSessionId: this.gameSessionId,
      gameSeed: this.gameSeed,
      version: this.version,
    });

    this.websocket.on(WebsocketEventGroups.GameSessionId, (data: any) => {
      if (!data?.slot || data.gameSessionId !== this.gameSessionId) return;

      this.sendScreenResolution(data.slot);
    });
  };

  /**
   * With some different device resolutions, the HTML game canvas on the emulator won't match the device scaling
   * So we send the current device's screen resolution to the emulator
   * The emulator will resize the browser just like the device
   * @returns {void}
   */
  sendScreenResolution = (slot: string): void => {
    if (this.isSentScreenResolution) return;
    this.isSentScreenResolution = true;

    this.websocket?.emit(WebsocketEventGroups.ScreenResolution, {
      slot,
      height: window.innerHeight,
      width: window.innerWidth,
    });
  };

  /**
   * Leave the websocket room
   * @returns {void}
   */
  leaveRoom = (): void => {
    this.websocket.emit(WebsocketEventGroups.LeaveRoom, {
      room: this.gameSessionId,
    });
  };

  /**
   * Send mouse events to back end
   * @param {string} event
   * @returns {void}
   */
  sendEvent = (event: any): void => {
    emitEvent(this.websocket, WebsocketEventGroups.MouseEvent, {
      gameSessionId: this.gameSessionId,
      event,
    });
  };

  /**
   * Send a list of events
   * @param {IMouseEvent[]} events
   * @returns {void}
   */
  sendListOfEvents = (events: IEventData[]): void => {
    emitEvent(this.websocket, WebsocketEventGroups.MouseEvents, {
      gameSessionId: this.gameSessionId,
      events,
    });
  };

  /**
   * Get event dataset
   * @returns {void}
   */
  getEventDataset = () => {
    if (!this.eventDataset) return;
    this.onGetEventDataSet && this.onGetEventDataSet(this.eventDataset);
  };

  /**
   * Listen to back end on game start
   * @returns {void}
   */
  onGameStart = (): void => {
    if (this.startTime) return;
    this.startTime = Date.now();
    this.isResumedGame = true;

    emitEvent(this.websocket, WebsocketEventGroups.GameStart, {
      gameSessionId: this.gameSessionId,
      event: {
        time: this.startTime,
      },
    });

    this.fetchScore();
    this.register();
    this.sendPing();
  };

  /**
   * Send game pause event to back end
   * @returns {void}
   */
  sendGamePause = (): void => {
    if (this.isPausedGame || !this.startTime) return;
    console.log("[Event Register] - Send pause game event");
    this.isPausedGame = true;
    this.isResumedGame = false;

    this.sendEvent({ type: EventType.Pause, time: Date.now() - this.startTime });
  };

  /**
   * Send game resume event to back end
   * @returns {void}
   */
  sendGameResume = (): void => {
    if (this.isResumedGame || !this.startTime) return;
    console.log("[Event Register] - Send resume game event");
    this.isResumedGame = true;
    this.isPausedGame = false;

    this.sendEvent({
      type: EventType.Resume,
      time: Date.now() - this.startTime,
    });
  };

  /**
   * Send left game event to back end
   * @returns {void}
   */
  sendLeftGame = (): void => {
    console.log("[Event Register] - Send left game event");
    this.stopPing();
    if (this.startTime) {
      this.sendEvent({
        type: EventType.Leave,
        time: Date.now() - this.startTime,
      });

      return;
    }

    this.sendEvent({
      type: EventType.Leave,
    });
  };

  /**
   * Send replay event to back end
   * @returns {void}
   */
  sendGameReplay = (): void => {
    if (!this.startTime) return;
    console.log("[Event Register] - Send replay game event");

    this.sendEvent({
      type: EventType.Replay,
      time: Date.now() - this.startTime,
    });
  };

  /**
   * Send end game event to back end
   * @returns {void}
   */
  sendEndGame = (): void => {
    if (!this.startTime || this.isSentEndGame) return;
    this.isSentEndGame = true;
    console.log("[Event Register] - Send end game event");

    this.sendEvent({
      type: EventType.End,
      time: Date.now() - this.startTime,
    });
  };

  /**
   * Fetch score from back end
   * @returns {void}
   */
  fetchScore = (): void => {
    this.websocket?.on(WebsocketEventGroups.Score, (data: any) => {
      this.currentScore = data.score;
      this.onChangeScore(data.score);
    });
  };

  /**
   * Fetch final score
   * @returns {void}
   */
  fetchFinalScore = (): void => {
    this.websocket?.on(WebsocketEventGroups.FinalScore, (data: any) => {
      this.finalScore = data.finalScore;
      this.onChangeFinalScore(data.finalScore);
      this.unsubscribe();
    });
  };

  unsubscribe = () => {
    console.log(`[Event Register] - Unsubscribe`);
    this.stopPing();
    this.websocket?.off(WebsocketEventGroups.FinalScore);
    this.websocket?.off(WebsocketEventGroups.Score);
    this.websocket?.off(WebsocketEventGroups.GameStart);
    this.websocket?.off(WebsocketEventGroups.GameLoaded);
  };

  /**
   * Register version 1
   * Send start and end events only
   * Good for some games that don't have a lot of drag events like Bingo Mania, Sudoku
   * @returns {void}
   */
  register_1 = (): void => {
    const version = Version.version1;

    const htmlGameCanvas = document.getElementById("UT_CANVAS") || document.getElementById("game-phaser");
    let hasTouchEvent = false;

    htmlGameCanvas?.addEventListener(EventsToRegister.TouchStart, (event: TouchEvent) => {
      if (!hasTouchEvent) {
        hasTouchEvent = true;
      }
      this.saveTouchEvent(event, version);
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.TouchEnd, (event: ITouchEvent) => {
      if (!hasTouchEvent) {
        hasTouchEvent = true;
      }

      this.saveTouchEvent(event, version);
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.MouseDown, (event: IMouseEvent) => {
      if (hasTouchEvent) return;
      this.saveMouseEvent(event, version);
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.MouseUp, (event: IMouseEvent) => {
      if (hasTouchEvent) return;
      this.saveMouseEvent(event, version);
    });
  };

  /**
   * Register version 2
   * Send start and end event. If after a delay time, user doesn't release an end event, send a move event to the simulator
   * The simulator will generate moves event itself base on the start and end point
   * For the debug, send number of moves event and travelled distance for each action
   * Good for some games that need to drag the item around in a long time like Cube puzzle
   * @returns {void}
   */
  register_2 = (): void => {
    let hasTouchEvent = false;
    let sendMoveIntervalId: any = undefined;

    let xTravelled = 0;
    let yTravelled = 0;
    let prevX = 0;
    let prevY = 0;
    let select = false;
    let nbMoves = 0;
    let travelledDistance = 0;

    const version = Version.version2;

    const htmlGameCanvas = document.getElementById("UT_CANVAS") || document.getElementById("game-phaser");

    htmlGameCanvas?.addEventListener(EventsToRegister.MouseDown, (event: MouseEvent) => {
      if (hasTouchEvent) return;
      select = true;
      prevX = event.pageX;
      prevY = event.pageY;

      this.saveMouseEvent(event, version);

      // If in DELAY_TIME, the user doesn't release a mousedown event,
      // send a mousemove event at the current mouse's position to the simulator
      if (!sendMoveIntervalId) {
        sendMoveIntervalId = setInterval(() => {
          const mouseMoveEvent = this.mouseMoveEvents[this.mouseMoveEvents.length - 1];
          this.saveMouseEvent(mouseMoveEvent, version);
        }, DELAY_TIME / 2 - LATENCY_TIME);
      }
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.MouseUp, (event: IMouseEvent) => {
      if (hasTouchEvent) return;

      if (select) {
        yTravelled = Math.abs(event.pageY - prevY);
        xTravelled = Math.abs(event.pageX - prevX);
        travelledDistance += Math.sqrt(yTravelled ** 2 + xTravelled ** 2);
        event.travelledDistance = travelledDistance;
        event.nbMoves = nbMoves;

        select = false;
        prevX = 0;
        prevY = 0;
        yTravelled = 0;
        xTravelled = 0;
        nbMoves = 0;
        travelledDistance = 0;
      }

      this.saveMouseEvent(event, version);

      // If user releases a mouseup event before the limit time, no need to send a mousemove event
      if (sendMoveIntervalId) {
        clearInterval(sendMoveIntervalId);
        sendMoveIntervalId = undefined;
      }
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.MouseMove, (event: IMouseEvent) => {
      if (hasTouchEvent) return;

      if (select) {
        yTravelled = Math.abs(event.pageY - prevY);
        xTravelled = Math.abs(event.pageX - prevX);

        prevX = event.pageX;
        prevY = event.pageY;

        travelledDistance += Math.sqrt(yTravelled ** 2 + xTravelled ** 2);
        event.travelledDistance = travelledDistance;
        event.nbMoves = nbMoves;
      }

      this.mouseMoveEvents?.push(event);
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.TouchStart, (event: TouchEvent) => {
      select = true;
      if (!hasTouchEvent) {
        hasTouchEvent = true;
      }
      this.saveTouchEvent(event, version);

      prevX = event.changedTouches[0].clientX;
      prevY = event.changedTouches[0].clientY;

      // If in DELAY_TIME, the user doesn't release a touchend event,
      // send a touchmove event at the current mouse's position to the simulator
      if (!sendMoveIntervalId) {
        sendMoveIntervalId = setInterval(() => {
          const touchMoveEvent = this.touchMoveEvents[this.touchMoveEvents.length - 1];
          this.saveTouchEvent(touchMoveEvent, version);
        }, DELAY_TIME / 2 - LATENCY_TIME);
      }
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.TouchMove, (event: ITouchEvent) => {
      if (!hasTouchEvent) {
        hasTouchEvent = true;
      }
      nbMoves++;

      if (select) {
        prevY && (yTravelled = Math.abs(event.changedTouches[0].clientY - prevY));
        prevX && (xTravelled = Math.abs(event.changedTouches[0].clientX - prevX));

        prevX = event.changedTouches[0].clientX;
        prevY = event.changedTouches[0].clientY;

        travelledDistance += Math.sqrt(yTravelled ** 2 + xTravelled ** 2);
        event.travelledDistance = travelledDistance;
        event.nbMoves = nbMoves;

        this.touchMoveEvents?.push(event);
      }
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.TouchEnd, (event: ITouchEvent) => {
      if (!hasTouchEvent) {
        hasTouchEvent = true;
      }

      if (select && this.startTime) {
        yTravelled = Math.abs(event.changedTouches[0].clientY - prevY);
        xTravelled = Math.abs(event.changedTouches[0].clientX - prevX);
        travelledDistance += Math.sqrt(yTravelled ** 2 + xTravelled ** 2);
        event.travelledDistance = travelledDistance;
        event.nbMoves = nbMoves;

        this.saveTouchEvent(event, version);

        select = false;
        prevX = 0;
        prevY = 0;
        yTravelled = 0;
        xTravelled = 0;
        nbMoves = 0;
        travelledDistance = 0;
      }

      // If user releases a mouseup event before the limit time, no need to send a touchend event
      if (sendMoveIntervalId) {
        clearInterval(sendMoveIntervalId);
        sendMoveIntervalId = undefined;
      }
    });
  };

  /**
   * Register version 3
   * First, send a start event. If user releases an end event, send the array of all move and end events to the simulator
   * avoid sending events all the time causing big delay for simulator
   * If after a delay time, user doesn't release an end event, send the current array of events to the simulator
   * Send one, skip one event (Need to improve later)
   * Good for games that need to drag the item in a short time like Bubble Puzzle
   * @returns {void}
   */
  register_3 = (): void => {
    let hasTouchEvent = false;
    let sendMoveIntervalId: any = undefined;
    let touchEvents: ITouchEvent[] = [];
    let mouseEvents: IMouseEvent[] = [];
    let select = false;
    let nbSkipped = 0;
    let lastMoveEvent: any = undefined;

    const version = Version.version3;

    const htmlGameCanvas = document.getElementById("UT_CANVAS") || document.getElementById("game-phaser");

    htmlGameCanvas?.addEventListener(EventsToRegister.MouseDown, (event: MouseEvent) => {
      if (hasTouchEvent) return;
      select = true;

      this.saveMouseEvent(event, version);

      // If in DELAY_TIME, the user doesn't release a mousedown event,
      // send a mousemove event at the current mouse's position to the simulator
      if (!sendMoveIntervalId) {
        sendMoveIntervalId = setInterval(() => {
          this.saveListOfMouseEvents(mouseEvents, version);
          mouseEvents = [];
        }, DELAY_TIME / 2 - LATENCY_TIME);
      }
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.MouseUp, (event: IMouseEvent) => {
      if (hasTouchEvent) return;
      if (select && this.startTime) {
        event.time = Date.now() - this.startTime;
        if (mouseEvents[mouseEvents.length - 1]?.time !== lastMoveEvent?.time) {
          mouseEvents?.push(lastMoveEvent);
          lastMoveEvent = undefined;
        }
        mouseEvents.push(event);

        this.saveListOfMouseEvents(mouseEvents, version);

        select = false;
        mouseEvents = [];

        lastMoveEvent = undefined;
      }

      // If user releases a mouseup event before the limit time, no need to send a mousemove event
      if (sendMoveIntervalId) {
        clearInterval(sendMoveIntervalId);
        sendMoveIntervalId = undefined;
      }
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.MouseMove, (event: IMouseEvent) => {
      if (hasTouchEvent) return;

      nbSkipped++;

      if (select && this.startTime) {
        event.time = Date.now() - this.startTime;
        lastMoveEvent = event;

        if (nbSkipped > 1) {
          // Skip each 1 event
          mouseEvents?.push(event);
          nbSkipped = 0;
        }
      }
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.TouchStart, (event: TouchEvent) => {
      if (!hasTouchEvent) {
        hasTouchEvent = true;
      }

      select = true;
      this.saveTouchEvent(event, version);

      // If in DELAY_TIME, the user doesn't release a touchend event,
      // send a touchmove event at the current mouse's position to the simulator
      if (!sendMoveIntervalId) {
        sendMoveIntervalId = setInterval(() => {
          this.saveListOfTouchEvents(touchEvents, version);
          touchEvents = [];
        }, DELAY_TIME / 2 - LATENCY_TIME);
      }
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.TouchMove, (event: ITouchEvent) => {
      if (!hasTouchEvent) {
        hasTouchEvent = true;
      }

      nbSkipped++;

      if (select && this.startTime) {
        event.time = Date.now() - this.startTime;
        lastMoveEvent = event;

        if (nbSkipped > 1) {
          // Skip each 1 event
          touchEvents?.push(event);
          nbSkipped = 0;
        }
      }
    });

    htmlGameCanvas?.addEventListener(EventsToRegister.TouchEnd, (event: ITouchEvent) => {
      if (!hasTouchEvent) {
        hasTouchEvent = true;
      }

      if (select && this.startTime) {
        event.time = Date.now() - this.startTime;
        if (touchEvents[touchEvents.length - 1]?.time !== lastMoveEvent?.time) {
          console.log("send last move");
          touchEvents?.push(lastMoveEvent);
          lastMoveEvent = undefined;
        }

        touchEvents.push(event);

        this.saveListOfTouchEvents(touchEvents, version);

        select = false;
        touchEvents = [];
      }

      // If user releases a mouseup event before the limit time, no need to send a touchend event
      if (sendMoveIntervalId) {
        clearInterval(sendMoveIntervalId);
        sendMoveIntervalId = undefined;
      }
    });
  };

  /**
   * Register all event
   * @returns {void}
   */
  register = (): void => {
    switch (this.version) {
      case Version.version1:
        console.log("[Event register] - version 1");
        this.register_1();
        break;
      case Version.version2:
        console.log("[Event register] - version 2");
        this.register_2();
        break;
      case Version.version3:
        console.log("[Event register] - version 3");
        this.register_3();
        break;
      case Version.versionDataset:
        console.log("[Event register] - logging dataset with all version");
        this.register_1();
        this.register_2();
        this.register_3();
        break;
      default:
        console.log("[Event register] - version 3 - default");
        this.register_3();
        break;
    }
  };

  saveListOfTouchEvents = (touchEvents: ITouchEvent[], version: Version) => {
    const events = touchEvents.map((event) => {
      const touch = event.changedTouches[0];
      const touchEvent = {
        type: event.type,
        clientX: touch.clientX,
        clientY: touch.clientY,
        screenX: touch.screenX,
        screenY: touch.screenY,
        travelledDistance: event.travelledDistance,
        nbMoves: event.nbMoves,
        time: event.time,
      };

      const time = Date.now();

      const canvasEvent = {
        type: touchEvent.type,
        screenX: window.innerWidth,
        screenY: window.innerHeight,
        clientX: touchEvent.clientX,
        clientY: touchEvent.clientY,
      };

      const eventData = {
        type: EventType.Input,
        data: canvasEvent,
        time: touchEvent.time || time - (this.startTime || 0),
        travelledDistance: touchEvent.travelledDistance,
        nbMoves: touchEvent.nbMoves,
      };

      this.sortEventDataset(eventData, version);

      return eventData;
    });

    this.sendListOfEvents(events);
  };

  saveListOfMouseEvents = (mouseEvents: IMouseEvent[], version: Version) => {
    const events = mouseEvents.map((event) => {
      const time = Date.now();

      const canvasEvent = {
        type: event.type,
        screenX: window.innerWidth,
        screenY: window.innerHeight,
        clientX: event.clientX,
        clientY: event.clientY,
      };

      const eventData: IEventData = {
        type: EventType.Input,
        data: canvasEvent,
        time: event.time || time - (this.startTime || 0),
        travelledDistance: event.travelledDistance,
        nbMoves: event.nbMoves,
      };

      this.sortEventDataset(eventData, version);

      return eventData;
    });

    this.sendListOfEvents(events);
  };

  /**
   * Save mouse event
   * @param {MouseEvent} event
   * @param {Version} version
   * @returns {IEventData}
   */
  saveMouseEvent = (event: IMouseEvent, version: Version): IEventData => {
    const time = Date.now();

    const canvasEvent = {
      type: event.type,
      screenX: window.innerWidth,
      screenY: window.innerHeight,
      clientX: event.clientX,
      clientY: event.clientY,
    };

    const eventData: IEventData = {
      type: EventType.Input,
      data: canvasEvent,
      time: time - (this.startTime || 0),
      travelledDistance: event.travelledDistance,
      nbMoves: event.nbMoves,
    };

    this.sortEventDataset(eventData, version);
    this.sendEvent(eventData);

    return eventData;
  };

  sortEventDataset = (event: IEventSimulate, version: Version) => {
    if (version === Version.versionDataset) return;
    const dataset = this.eventDataset && this.eventDataset[version];

    dataset?.push(event);
    dataset?.sort((a: any, b: any) => b.time - a.time);
    this.eventDataset[version] = dataset;
  };

  /**
   * Save touch event
   * @param {TouchEvent} event
   * @returns {void}
   */
  saveTouchEvent = (event: ITouchEvent, version: Version): void => {
    const touch = event.changedTouches[0];
    const touchEvent = {
      type: event.type,
      clientX: touch.clientX,
      clientY: touch.clientY,
      screenX: touch.screenX,
      screenY: touch.screenY,
      travelledDistance: event.travelledDistance,
      nbMoves: event.nbMoves,
    };
    this.saveMouseEvent(touchEvent as IMouseEvent, version);
  };
}
