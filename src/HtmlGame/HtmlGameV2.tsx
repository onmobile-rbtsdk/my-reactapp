import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { HtmlGameSessionHeader } from "./HtmlGameSessionHeader";
//import { EndScreenV4 } from "../GameSessionContainer/EndScreenV4";
import { useTranslation } from "react-i18next";
import { useStyles } from "./HtmlGame.style";
import { useHistory } from "react-router-dom";
import clsx from "classnames";
import { OnmoPopup } from "../OnmoPopup";
import { debounce, isEmpty } from "lodash-es";
//import { GameSessionType } from "../../graphql/API";
import { freeMemoryAfterPlaying, hash } from "./utils/freeMemoryAfterPlaying";
import { stopToRecordVideoGame, startToRecordHtmlVideo } from "../GameSessionContainer/GameSession/helper";
//import PreloadScreen from "../GameSessionContainer/GameSessionStreamingView/PreloadScreen/PreLoadScreen";
import { EventsRegister } from "../eventRegister";
import { Button, Typography} from "../Common/ComponentExport";
//import { UserCtx } from "../../context/user/state";
import { loadGame } from "./utils/loadGame";
import { Version } from "../eventRegister/libs/register/types/enums";
import { io } from "socket.io-client";

let script: any;
// @ts-ignore
const onmoHtmlGame = (window.onmoHtmlGame || {
  pause: () => {},
  resume: () => {},
  unload: () => {},
  addListener: () => {},
  removeListener: () => {},
  soundOn: () => {},
  soundOff: () => {},
}) as any;

let isReceivedEndgameEvent = false;

const hideCanvas = () => {
  const canvas = document.getElementById("UT_CANVAS") || document.getElementById("game-phaser");
  canvas?.style.setProperty("display", "none");
  console.info("hide canvas");
};

const showCanvas = () => {
  console.log("show canvas");
  const canvas = document.getElementById("UT_CANVAS") || document.getElementById("game-phaser");
  canvas?.style.setProperty("maxWidth", "100vw");
  canvas?.style.setProperty("maxHeight", "100vh");
  canvas?.style.setProperty("display", "block");
  canvas?.style.setProperty("background", "#222323");
};

const oldBody: any = {
  margin: document?.body?.style?.margin,
  border: document?.body?.style?.border,
  overflow: document?.body?.style?.overflow,
  display: document?.body?.style?.display,
};

export const HtmlGameV2 = (props: any) => {
  const { t } = useTranslation();
  const {
    gameSession,
    started,
    setIsLoadedCallback,
    onResetGameSession,
    isGivingUp,
    setIsGivingUp,
    loadedPercentage,
    setLoadedPercentage,
  } = props;
  const dataMoment = gameSession?.moment?.data || "";
  const classes = useStyles();
  const [score, setScore] = useState(0);
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [isEndGame, setIsEndGame] = useState(gameSession?.sessionResults);
  const [isPause, setIsPause] = useState(false);
  const [isShowPopupWaitOrLeave, setIsShowPopupWaitOrLeave] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [openDisconectedPopup, setOpenDisconectedPopup] = useState(false);
  const [eventRegister, setEventRegister] = useState<EventsRegister | null>(null);
  const [isDockerLoaded, setIsDockerLoaded] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [gameSeed, setGameSeeds] = useState<number | null>(null);

  const isGameSessionV4 = window.location.pathname.includes("v4");
  //const { simulationWS, connectSimulationWebsocket } = useContext(UserCtx);
  const [simulationWS, setSimulationWS] = useState<any>();
  

  const scoreRef = useRef(score);
  scoreRef.current = score;

  useEffect(() => {
    if (simulationWS) return;
  
    const onmoAPI = process.env.REACT_APP_HTML_GAME_SIMULATION_URL || "https://dev-html-simulation.onmostealth.com/";

    const simulationWS1 = io(onmoAPI, {
      transports: ["websocket"],
    });
    setSimulationWS(simulationWS1);
  }, [simulationWS]);

  const updateOnlineStatus = () => {
    setIsOnline(navigator.onLine);
    if (navigator.onLine) {
      setOpenDisconectedPopup(false);
      setIsPause(false);
    } else {
      setOpenDisconectedPopup(true);
      setIsPause(true);
    }
  };

  const history: any = useHistory();

  useEffect(() => {
    if (!gameSession) return;
    const matchId = gameSession?.matchId;
    const gameSeed = matchId && matchId !== "N/A" ? hash(matchId) : new Date().getTime();
    setGameSeeds(gameSeed);
  }, [gameSession]);

  const isBattleSession: Boolean = true;
    //gameSession?.sessionType === GameSessionType.BATTLE || gameSession?.sessionType === GameSessionType.TOURNAMENT;

  const startGame = () => {
    showCanvas();
    onmoHtmlGame?.resume();
    eventRegister?.onGameStart();
    setTimeStarted(Date.now());
    startToRecordHtmlVideo(gameSession.id);
  };

  const debounceStart = useCallback(debounce(startGame, 500), [eventRegister]);

  const removeScript = () => {
    script?.parentNode?.removeChild(script);
    const canvas = document.getElementById("UT_CANVAS") || document.getElementById("game-phaser");
    canvas?.parentNode?.removeChild(canvas);
  };

  const resetStyleBody = () => {
    if (document.body) {
      ["margin", "border", "overflow", "display"].forEach((property: string) => {
        if (oldBody[property]) {
          document.body.style.setProperty(property, oldBody[property]);
        } else {
          document.body.style.removeProperty(property);
        }
      });
    }
  };

  const onAgreeToGoBack = () => {
    stopToRecordVideoGame();
    if (isBattleSession) {
      setScore(-1);
      setIsEndGame(true);
      setIsShowPopupWaitOrLeave(false);
    } else {
      if (history.length > 1) {
        history.go(-1);
      } else {
        history.push("/");
      }
    }
  };

  const onLeave = () => {
    if (history.length > 1) {
      history.go(-1);
    } else {
      history.push({ pathname: `/` });
    }
  };

  const onClickBack = () => {
    onmoHtmlGame?.soundOff();
    setIsShowPopupWaitOrLeave(true);
    eventRegister?.sendGamePause();
    onmoHtmlGame?.pause();
    setIsPause(true);
  };

  const onClosePopup = () => {
    const gameVolume = localStorage.getItem("gameVolume");
    if (gameVolume && gameVolume !== "0") {
      onmoHtmlGame?.soundOn();
    }
    setIsShowPopupWaitOrLeave(false);
    onmoHtmlGame?.resume();
    eventRegister?.sendGameResume();
    setIsPause(false);
    if (isGivingUp) {
      setIsGivingUp(false);
    }
  };

  const onResume = () => {
    setIsPause(false);
    onmoHtmlGame?.resume();
    eventRegister?.sendGameResume();
  };

  const renderDisconnectedPopup = () => {
    return (
      <OnmoPopup
        isOpen={!isOnline && openDisconectedPopup}
        title={t("common_The stream has been disconnected.")}
        agreeText={t("common_Leave")}
        disagreeText={t("common_Wait")}
        onAgree={onLeave}
        onDisagree={() => {
          setOpenDisconectedPopup(false);
        }}
        disableActions={false}
        readOnly={false}>
        <Typography className={classes.textAlignCenter}>{t("common_Please check your network.")}</Typography>
      </OnmoPopup>
    );
  };

  const renderWaitOrLeavePopup = () => {
    return (
      <OnmoPopup
        isOpen={isShowPopupWaitOrLeave}
        title={t("common_Leave game session")}
        agreeText={t("common_Yes")}
        disagreeText={t("common_No")}
        onAgree={onAgreeToGoBack}
        onDisagree={onClosePopup}
        disableActions={false}
        isPriorityConfirm={true}
        readOnly={false}>
        <Typography data-testid="text-typo" className={classes.textAlignCenter}>
          {t("common_Are you sure to leave? Your entry fee will not be refunded.")}
        </Typography>
      </OnmoPopup>
    );
  };

  const renderPopupResume = () => {
    return (
      <OnmoPopup
        isOpen={isPause && !isShowPopupWaitOrLeave && !isEndGame}
        title={t("Continue game session?")}
        data-testid="popup-resume"
        disableActions={true}>
        <Button className={classes.resumeStream} onClick={onResume} fullWidth>
          {t("Resume")}
        </Button>
      </OnmoPopup>
    );
  };

  const onmoLoadGame = async () => {
    onmoHtmlGame.seeds = gameSeed;
    onmoHtmlGame.momentDatas = dataMoment;

    try {
      const _script = await loadGame(gameSession.moment?.appId, setLoadedPercentage);
      script = _script;
      hideCanvas();
    } catch (e) {
      console.log(e);
    }
    document.body.style.display = "block";
    return () => {
      resetStyleBody();
      if (isGameLoaded) {
        onmoHtmlGame?.unload();
      }
    };
  };

  const onmoUnloadedGame = () => {
    let isUnmounting: boolean;
    let hasSentResult = false;
    onmoHtmlGame?.addListener("UNLOADED", async () => {
      if (!isUnmounting) {
        if (!hasSentResult) {
          hasSentResult = true;
        }
      }
    });

    if (isEndGame) {
      isReceivedEndgameEvent = true;
      onmoHtmlGame?.unload();
    }

    return () => {
      isUnmounting = true;
      onmoHtmlGame?.removeListener("UNLOADED");
    };
  };

  useEffect(() => {
    started && startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  useEffect(() => {
    gameSession && showCanvas();
    if (!isEmpty(gameSession.sessionResults)) 
    {
      setIsEndGame(true);
    }
  }, [gameSession]);

  useEffect(() => {
    if (!gameSeed) return;
    onmoLoadGame();
  }, [gameSeed]);

  useEffect(onmoUnloadedGame, [isEndGame, timeStarted]);

  useEffect(() => {
    let isUnmounting: boolean;

    const loadedCallback = () => {
      if (!isUnmounting) {
        isReceivedEndgameEvent = false;
        hideCanvas();
        onmoHtmlGame?.pause();
        setIsGameLoaded(true);

        console.log("[Html game] - Game is loaded");
      }
    };

    const loadingCallback = () => {
      if (!isUnmounting) {
        hideCanvas();
      }
    };

    const dataCallback = (data: any) => {
      if (!isUnmounting && !isReceivedEndgameEvent && scoreRef.current !== data.score) {
        setScore(data.score);
      }
    };
    const endGameCallback = (data: any) => {
      if (!isUnmounting) {
        isReceivedEndgameEvent = true;
        setIsEndGame(true);
        eventRegister?.sendEndGame();
      }
    };

    const domCallback = (event: any) => {
      if (!isUnmounting) {
        // console.info(event);
      }
    };

    onmoHtmlGame?.addListener("LOADED", loadedCallback);
    onmoHtmlGame?.addListener("LOADING", loadingCallback);
    onmoHtmlGame?.addListener("DATA", dataCallback);
    onmoHtmlGame?.addListener("END_GAME", endGameCallback);
    onmoHtmlGame?.addListener("DOM", domCallback);

    return () => {
      console.log("clean up script");
      stopToRecordVideoGame();
      removeScript();
      hideCanvas();
      isReceivedEndgameEvent = false;
      isUnmounting = true;
      onmoHtmlGame?.removeListener("LOADED", loadedCallback);
      onmoHtmlGame?.removeListener("LOADING", loadingCallback);
      onmoHtmlGame?.removeListener("DATA", dataCallback);
      onmoHtmlGame?.removeListener("END_GAME", endGameCallback);
      onmoHtmlGame?.removeListener("DOM", domCallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventRegister]);

  // Free memory after finishing playing
  useEffect(() => {
    const keysBeforeJSON = localStorage.getItem("htmlgame:keys");
    let keysBefore = keysBeforeJSON === null ? Object.keys(window) : JSON.parse(keysBeforeJSON);
    if (keysBeforeJSON === null) {
      localStorage.setItem("htmlgame:keys", JSON.stringify(keysBefore));
    }

    return () => {
      freeMemoryAfterPlaying(keysBefore);
    };
  }, []);

  const confirmLeaveGameSession = () => {
    //@ts-ignore
    // const unblock = history.block(({ pathname }) => {
    //   //if (!isBattleSession && isShowPopupWaitOrLeave) {
    //     if (isShowPopupWaitOrLeave) {
    //     eventRegister?.sendLeftGame();
    //     return true;
    //   }
    //   if (isEndGame) {
    //     hideCanvas();
    //     removeScript();
    //     unblock();

    //     eventRegister?.sendLeftGame();
    //     return true;
    //   }
    //   return false;
    // });

    // return () => {
    //   unblock && unblock();
    // };
  };

  useEffect(confirmLeaveGameSession, [isShowPopupWaitOrLeave, isEndGame, eventRegister]);

  useEffect(() => {
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    // Check if user click back on browser
    window.addEventListener("popstate", onClickBack);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      window.removeEventListener("popstate", onClickBack);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const gameBox = document.getElementById("UT_CANVAS") || document.getElementById("game-phaser");
    if (!isOnline) {
      gameBox?.style.setProperty("pointer-events", "none");
    } else {
      gameBox?.style.setProperty("pointer-events", "all");
    }
  }, [isOnline]);

  // CHECK IF USER NOT ACTIVE ONMO WEB TAB IN ORDER TO PAUSE GAME
  useEffect(() => {
    const onVisibilityChange = () => {
      if (timeStarted) {
        try {
          setIsPause(true);
          onmoHtmlGame?.pause();
          eventRegister?.sendGamePause();
        } catch (e) {
          console.warn(e);
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onmoHtmlGame, timeStarted, eventRegister]);

  useEffect(() => {
    if (isEndGame) {
      stopToRecordVideoGame();
    }
  }, [isEndGame]);

  const registerVersion = () => {
    const gameId = gameSession.moment?.appId;

    switch (parseInt(gameId)) {
      // Game Cube Puzzle
      case 1:
        return Version.version3;
      // Game Bubble Puzzle
      case 4:
        return Version.version3;
      // Game Bingo Mania
      case 6:
        return Version.version1;
      default:
        return Version.version3;
    }
  };

  useEffect(() => {
    if (!gameSession || !simulationWS || !gameSeed) return;
    const dockerUri = process.env.REACT_APP_HTML_GAME_SIMULATION_URL || "https://dev-html-simulation.onmostealth.com/";
    const eventRegister = new EventsRegister({
      websocket: simulationWS,
      onmoAPI: dockerUri,
      gameSessionId: gameSession.id,
      gameSeed,
      onChangeScore,
      onChangeFinalScore,
      onLoadedDocker,
      onGetEventDataSet,
      version: registerVersion(),
    });
    setEventRegister(eventRegister);
  }, [gameSession, simulationWS, gameSeed]);

  const onChangeScore = (score: number) => {
    console.log(`[Simulation] - score: ${score}`);
  };

  const onChangeFinalScore = (finalScore: number) => {
    setIsEndGame(true);
    setFinalScore(finalScore);
  };

  const onLoadedDocker = () => {
    console.log("[Simulation] - Game is loaded");
    setIsDockerLoaded(true);
  };

  const onGetEventDataSet = () => {};

  useEffect(() => {
    if (isGivingUp) {
      onClickBack();
    }
  }, [isGivingUp]);

  useEffect(() => {
    const cleanup = () => {
      eventRegister?.sendEndGame();
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [eventRegister]);

  useEffect(() => {
    if (!isGameLoaded || !isDockerLoaded) return;
    setIsLoadedCallback && setIsLoadedCallback(true);
  }, [isGameLoaded, isDockerLoaded]);

  return (
    <div data-testid="div-root" className={clsx(classes.root, isEndGame && classes.posAbs)}>
      {renderWaitOrLeavePopup()}
      {renderDisconnectedPopup()}
      {renderPopupResume()}
      {timeStarted && (
        <div className={isEndGame ? classes.hideHeader : ""}>
          <HtmlGameSessionHeader
            onClickBack={onClickBack}
            nbScore={score}
            setIsEndGame={setIsEndGame}
            isShowEndScreen={isEndGame}
            isPause={isPause}
            moment={gameSession?.moment}
          />
        </div>
      )}
      {/* {!isEndGame &&
        !timeStarted &&
        gameSession?.sessionType !== "BATTLE" &&
        gameSession?.sessionType !== "TOURNAMENT" &&
        !isGameSessionV4 && (
          <PreloadScreen
            startPlaying={debounceStart}
            streamReadyCallback={isGameLoaded && isDockerLoaded}
            loadedPercentage={loadedPercentage}
            gameType={"HTML"}
          />
        )} */}

      {/* {isEndGame && (
        <EndScreenV4
          key={gameSession?.id}
          matchId={gameSession?.matchId}
          gameSessionType={gameSession?.sessionType}
          network={1}
          gameSessionId={gameSession?.id}
          hasFinalScore={finalScore !== null}
          lastFrame={null}
          onResetGameSession={onResetGameSession}
        />
      )} */}
      <div id="error_log" style={{ display: "none" }} />
    </div>
  );
};

export default HtmlGameV2;
