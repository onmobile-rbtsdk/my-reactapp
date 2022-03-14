import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
//import { GameSessions } from "../../modelsv2/gameSessions";
import { HtmlGameSessionHeader } from "./HtmlGameSessionHeader";
//import { EndScreenV4 } from "../GameSessionContainer/EndScreenV4";
import { useTranslation } from "react-i18next";
import { useStyles } from "./HtmlGame.style";
import { useHistory } from "react-router-dom";
import clsx from "classnames";
import { OnmoPopup } from "../OnmoPopup";
import { debounce, isEmpty } from "lodash-es";
//import { GameSessionType } from "../../graphql/API";
import {
  freeMemoryAfterPlaying,
  hash,
  removeScript,
} from "./utils/freeMemoryAfterPlaying";
import { hideCanvas, showCanvas } from "./utils/showOrHideCanvas";
import { loadGame } from "./utils/loadGame";
import { resetStyleBody } from "./utils/restyleBody";
import {
  stopToRecordVideoGame,
  startToRecordHtmlVideo,
} from "../GameSessionContainer/GameSession/helper";
//import { MaintenanceCtx } from "../../context/maintenance/state";
//import PreloadScreen from "../GameSessionContainer/GameSessionStreamingView/PreloadScreen/PreLoadScreen";
//import { AlertCtx } from "../../context/alert/state";
import { Button, Typography } from "../Common/ComponentExport";
//import { Analytics } from "../../modelsv2/analytics";
// import { CATEGORY } from "../../constants/analyticsEvent";
// import { isFeaturedTournament } from "../../utils/tournament";
// import { renderCurrencyText } from "../../utils/renderCurrency";
//import { UserCtx } from "../../context/user/state";

enum GameSessionType {
  CASUAL = "CASUAL",
  CHALLENGE = "CHALLENGE",
  BATTLE = "BATTLE",
  TOURNAMENT = "TOURNAMENT",
}

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

export const HtmlGame = (props: any) => {
  const { t } = useTranslation();
  const {
    gameSession,
    started,
    setIsLoadedCallback,
    onResetGameSession,
    isGivingUp,
    setIsGivingUp,
    setLoadedPercentage,
    loadedPercentage,
    forceQuit,
    setIsLoadingGame,
    tournamentType,
    tournamentCurrency,
    endSession,
    isHardwareBackPressed,
    setHardwareBackPressed,
  } = props;
  const dataMoment = gameSession?.moment?.data || "";
  const classes = useStyles();
  const [score, setScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [isEndGame, setIsEndGame] = useState(gameSession?.sessionResults);
  const [updatedGS, setUpdateGS] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [isShowPopupWaitOrLeave, setIsShowPopupWaitOrLeave] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [openDisconectedPopup, setOpenDisconectedPopup] = useState(false);
  const [isForceQuit, setIsForceQuit] = useState(false);
  const [volumnBeforePaused, setVolumnBeforePaused] = useState<string | null>(
    "0"
  );
  const [pauseDuration, setPauseDuration] = useState<number>(0);
  const [pauseStartTime, setPauseStartTime] = useState<number>(0);

  //const { setIsMaintenance } = useContext(MaintenanceCtx);
  //const { setNotificationError }: any = useContext(AlertCtx);
  //const { userData } = useContext(UserCtx);

  const isGameSessionV4 = window.location.pathname.includes("v4");

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
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const matchId = gameSession?.matchId;

  const gameSeed =
    matchId && matchId !== "N/A" ? hash(matchId) : new Date().getTime();
  const isBattleSession: Boolean =
    gameSession?.sessionType === GameSessionType.BATTLE ||
    gameSession?.sessionType === GameSessionType.TOURNAMENT;

  const startGame = () => {
    //alert('start');
    showCanvas();
    try {
      onmoHtmlGame.resume();
      setTimeStarted(Date.now());
      startToRecordHtmlVideo(gameSession.id);
    } catch (e) {
      hideCanvas();
      // alert("Fail to start game"+ e)
      //  setNotificationError("Fail to start game");
    }
  };

  const debounceStart = useCallback(debounce(startGame, 500), []);

  const onAgreeToGoBack = () => {
    // Analytics.trackEvent({
    //   category:
    //     gameSession?.sessionType === "TOURNAMENT"
    //       ? CATEGORY.TOURNAMENT
    //       : gameSession?.sessionType === "BATTLE"
    //       ? CATEGORY.BATTLE
    //       : "",
    //   action: "back",
    //   label: gameSession?.moment.app.title,
    //   moment_type:
    //     gameSession?.sessionType === "TOURNAMENT"
    //       ? "Tournament"
    //       : gameSession?.sessionType === "BATTLE"
    //       ? "Battle"
    //       : "",
    //   game_type: gameSession?.moment.app.type,
    //   currency: isFeaturedTournament(tournamentType) ? "Bonus Cash" : renderCurrencyText(tournamentCurrency),
    //   user_uid: userData?.id,
    // });

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
    setIsShowPopupWaitOrLeave(true);
    const gameVolume = localStorage.getItem("gameVolume");
    setVolumnBeforePaused(gameVolume);
    try {
      if (isLoaded) {
        onmoHtmlGame?.pause();
        setIsPause(true);
      }
      if (gameVolume && gameVolume !== "0") {
        onmoHtmlGame?.soundOff();
        localStorage.setItem("gameVolume", "0");
      }
    } catch (e) {
      setIsPause(false);
      setIsShowPopupWaitOrLeave(false);
      //setNotificationError("Fail to pause the game!");
      //alert('Fail to pause the game!');
    }
  };

  const onClosePopup = () => {
    const gameVolume = localStorage.getItem("gameVolume");
    if (
      (gameVolume && gameVolume !== "0" && timeStarted) ||
      volumnBeforePaused !== "0"
    ) {
      localStorage.setItem("gameVolume", "0.5");
      onmoHtmlGame?.soundOn();
    }
    setIsShowPopupWaitOrLeave(false);

    try {
      onmoHtmlGame?.resume();
      setIsPause(false);

      const pauseTime = pauseDuration + Date.now() - pauseStartTime;
      setPauseDuration(pauseTime);
    } catch (e) {
      setIsPause(true);
      // setNotificationError("Fail to resume the game!");
      // alert('Fail to resume the game!');
    }

    if (isGivingUp) {
      setIsGivingUp(false);
    }
  };

  const onResume = () => {
    const gameVolume = localStorage.getItem("gameVolume");
    if (gameVolume && gameVolume !== "0" && timeStarted) {
      onmoHtmlGame?.soundOn();
    }
    try {
      onmoHtmlGame?.resume();
      setIsPause(false);
      const pauseTime = pauseDuration + Date.now() - pauseStartTime;
      setPauseDuration(pauseTime);
    } catch (e) {
      setIsPause(true);
      //setNotificationError("Fail to resume the game!");
      //alert('Fail to resume the game!');
    }
  };

  const renderDisconnectedPopup = () => {
    return (
      <OnmoPopup
        isOpen={!isOnline && openDisconectedPopup}
        title={"The stream has been disconnected."}
        agreeText={"Leave"}
        disagreeText={"Wait"}
        onAgree={onLeave}
        onDisagree={() => {
          setOpenDisconectedPopup(false);
        }}
        disableActions={false}
        readOnly={false}
      >
        <Typography className={classes.textAlignCenter}>
          {"Please check your network."}
        </Typography>
      </OnmoPopup>
    );
  };

  const renderWaitOrLeavePopup = () => {
    return (
      <OnmoPopup
        isOpen={isShowPopupWaitOrLeave}
        title={"Leave game session"}
        agreeText={"Yes"}
        disagreeText={"No"}
        onAgree={onAgreeToGoBack}
        onDisagree={() => {
          onClosePopup();
          setHardwareBackPressed(false);
        }}
        disableActions={false}
        isPriorityConfirm={true}
        readOnly={false}
      >
        <Typography data-testid="text-typo" className={classes.textAlignCenter}>
          {"Are you sure to leave? Your entry fee will not be refunded."}
        </Typography>
      </OnmoPopup>
    );
  };

  const renderPopupResume = () => {
    return (
      <OnmoPopup
        isOpen={isPause && !isShowPopupWaitOrLeave && !isEndGame}
        title={"Continue game session?"}
        data-testid="popup-resume"
        disableActions={true}
      >
        <Button className={classes.resumeStream} onClick={onResume} fullWidth>
          {"Resume"}
        </Button>
      </OnmoPopup>
    );
  };

  const onmoUnloadedGame = () => {
    let isUnmounting: boolean;
    let hasSentResult = false;
    onmoHtmlGame?.addListener("UNLOADED", async () => {
      if (!isUnmounting) {
        if (!hasSentResult) {
          hasSentResult = true;
          const time = timeStarted
            ? Math.round((Date.now() - timeStarted - pauseDuration) / 1000)
            : 0;

          let finalScore: any;

          if (scoreRef.current === -1) {
            finalScore = -1;
          } else if (scoreRef.current === 0) {
            finalScore = 0;
          } else if (gameSession?.moment?.type.toLowerCase() === "time") {
            finalScore = time;
          } else {
            finalScore = scoreRef.current;
          }

          try {
            const endSessionParam = {
              gameSessionId: gameSession.id,
              score: finalScore,
              time,
              failureMessage: `${
                finalScore === 0 || finalScore === -1 ? "You lost." : ""
              }`,
            };
            endSession(JSON.stringify(endSessionParam));
            // await GameSessions.endHtmlGameSession({
            //   gameSessionId: gameSession.id,
            //   score: finalScore,
            //   time,
            //   failureMessage: `${finalScore === 0 || finalScore === -1 ? "You lost." : ""}`,
            // });
            setUpdateGS(true);
          } catch (e: any) {
            if (
              e.errors?.[0]?.message === "Network Error" ||
              e.errors?.[0]?.message ===
                "Onmo is currently down for maintenance"
            ) {
              //setIsMaintenance(true);
            } else {
              console.error(
                `Fail to end hmtl game session ${gameSession.id}`,
                e
              );
            }
          }
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
    gameSession && loadedPercentage >= 100 && showCanvas();
    if (!isEmpty(gameSession?.sessionResults)) {
      setUpdateGS(true);
    }
  }, [gameSession, loadedPercentage]);

  const onmoLoadGame = async () => {
    onmoHtmlGame.seeds = gameSeed;
    onmoHtmlGame.momentDatas = dataMoment;
    try {
      const _script = await loadGame(
        gameSession.moment?.appId,
        setLoadedPercentage
      );
      script = _script;
      hideCanvas();
    } catch (e) {
      console.log(e);
      // alert(e);
    }
    document.body.style.display = "block";
    return () => {
      resetStyleBody();
      if (isLoaded) {
        onmoHtmlGame?.unload();
      }
    };
  };

  useEffect(() => {
    onmoLoadGame();
  }, []);

  useEffect(onmoUnloadedGame, [isEndGame, timeStarted, pauseDuration]);

  useEffect(() => {
    let isUnmounting: boolean;
    let timeoutStart: NodeJS.Timeout;

    const loadedCallback = () => {
      if (!isUnmounting) {
        isReceivedEndgameEvent = false;
        hideCanvas();
        try {
          onmoHtmlGame?.pause();
          timeoutStart = setTimeout(() => {
            setIsLoaded(true);
            if (setIsLoadedCallback) {
              setIsLoadedCallback(true);
              startGame();
            }
          }, 700);
        } catch (error) {
          // setNotificationError("Fail to start game!");
          //alert('Fail to start game!');
          setIsLoadedCallback(false);
        }
      }
    };

    const loadingCallback = () => {
      if (!isUnmounting) {
        hideCanvas();
      }
    };

    const dataCallback = (data: any) => {
      if (!isUnmounting && !isReceivedEndgameEvent) {
        setScore(data.score);
      }
    };
    const endGameCallback = (data: any) => {
      if (!isUnmounting) {
        isReceivedEndgameEvent = true;
        setIsEndGame(true);
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
      stopToRecordVideoGame();
      removeScript(script);
      hideCanvas();
      isReceivedEndgameEvent = false;
      isUnmounting = true;
      clearTimeout(timeoutStart);
      onmoHtmlGame?.removeListener("LOADED", loadedCallback);
      onmoHtmlGame?.removeListener("LOADING", loadingCallback);
      onmoHtmlGame?.removeListener("DATA", dataCallback);
      onmoHtmlGame?.removeListener("END_GAME", endGameCallback);
      onmoHtmlGame?.removeListener("DOM", domCallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Free memory after finishing playing
  useEffect(() => {
    const keysBeforeJSON = localStorage.getItem("htmlgame:keys");
    let keysBefore =
      keysBeforeJSON === null
        ? Object.keys(window)
        : JSON.parse(keysBeforeJSON);
    if (keysBeforeJSON === null) {
      localStorage.setItem("htmlgame:keys", JSON.stringify(keysBefore));
    }

    return () => {
      freeMemoryAfterPlaying(keysBefore);
    };
  }, []);

  useEffect(() => {
    setIsForceQuit(forceQuit);
  }, [forceQuit]);

  const confirmLeaveGameSession = () => {
    if (isShowPopupWaitOrLeave) {
      const pauseStartTime = Date.now();
      setPauseStartTime(pauseStartTime);
    }

    // //@ts-ignore
    // const unblock = history.block(({ pathname }) => {
    //   if ((!isBattleSession && isShowPopupWaitOrLeave) || isForceQuit) {
    //     return true;
    //   }
    //   if (isEndGame) {
    //     setIsLoadingGame && setIsLoadingGame(false);
    //     hideCanvas();
    //     removeScript(script);
    //     unblock();
    //     return true;
    //   }
    //   return false;
    // });
    //@ts-ignore
    const unblock = () => {
      if ((!isBattleSession && isShowPopupWaitOrLeave) || isForceQuit) {
        return true;
      }
      if (isEndGame) {
        setIsLoadingGame && setIsLoadingGame(false);
        hideCanvas();
        removeScript(script);
        unblock();
        return true;
      }
      return false;
    };

    return () => {
      unblock && unblock();
    };
  };

  useEffect(confirmLeaveGameSession, [
    isShowPopupWaitOrLeave,
    isEndGame,
    isForceQuit,
  ]);

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
    const gameBox =
      document.getElementById("UT_CANVAS") ||
      document.getElementById("game-phaser");
    if (!isOnline) {
      gameBox?.style.setProperty("pointer-events", "none");
    } else {
      gameBox?.style.setProperty("pointer-events", "all");
    }
  }, [isOnline]);

  // CHECK IF USER NOT ACTIVE ONMO WEB TAB IN ORDER TO PAUSE GAME
  const onVisibilityChange = () => {
    if (timeStarted) {
      onmoHtmlGame?.soundOff();
      try {
        setIsPause(true);
        onmoHtmlGame?.pause();

        if (pauseStartTime) {
          const time = pauseDuration + Date.now() - pauseStartTime;
          setPauseDuration(time);
        }

        setPauseStartTime(Date.now());
      } catch (e) {
        setIsPause(false);
        console.warn(e);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onmoHtmlGame, timeStarted, pauseStartTime]);

  useEffect(() => {
    if (isEndGame) {
      document.body.style.overflow = "hidden";
      stopToRecordVideoGame();
    }
  }, [isEndGame]);

  useEffect(() => {
    if (isHardwareBackPressed) {
      onClickBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHardwareBackPressed]);

  useEffect(() => {
    if (isGivingUp) {
      onClickBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGivingUp]);

  useEffect(() => {
    const cleanup = () => {
      const time = timeStarted
        ? Math.round((Date.now() - timeStarted) / 1000)
        : 0;

      try {
        const endSessionParam = {
          gameSessionId: gameSession.id,
          score: -1,
          time,
        };
        endSession(JSON.stringify(endSessionParam));
        // GameSessions.endHtmlGameSession({
        //   gameSessionId: gameSession.id,
        //   score: -1,
        //   time,
        // });
      } catch (error) {
        console.log(error);
      }
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  return (
    <div
      data-testid="div-root"
      className={clsx(classes.root, isEndGame && classes.posAbs)}
    >
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
            streamReadyCallback={isLoaded}
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
          hasFinalScore={updatedGS}
          lastFrame={null}
          onResetGameSession={onResetGameSession}
        />
      )} */}
      <div id="error_log" style={{ display: "none" }} />
    </div>
  );
};

export default HtmlGame;
