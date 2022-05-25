import { ROLE } from "./constants";
import { useContext, useEffect, useState } from "react";
import * as React from "react";
import { GameSessionType, RotationMode } from "../../types/enums";
import { EventNames } from "../../rob0/constants/events";
import { Rob0 } from "../../rob0/models/rob0";
import GameSessionMask from "../GameSessionMask/GameSessionMask";
import { GameSessionStreamingView } from "../GameSessionStreamingView";
import { HeaderGameSession } from "./HeaderGameSession";
import { OnmoPopup } from "../../OnmoPopup";
import { STREAM_ENDPOINT } from "../../constants/endpoint";
import { GameSessionCtx } from "../../context/gameSession/state";
import { STREAM_STATUS } from "../../context/gameSession/constants";
//import { EndScreenV4 } from "../EndScreenV4";
import clsx from "classnames";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStyles } from "./GameSession.style";
import { AppLand } from "../../modelsv2/applands";
import { GameSessionConfirmDialog } from "../GameSessionConfirmDialog";
//import { MaintenanceCtx } from "../../../context/maintenance/state";
import { stopToRecordVideoGame } from "./helper";
//import { AlertCtx } from "../../../context/alert/state";
import RotateAction from "../../assets/RotateAction.svg";
import { StreamingController } from "streaming-view-sdk";
import { Button, Typography } from "../../Common/ComponentExport";

export const GameSession = (props: any) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history: any = useHistory();
 // const location = useLocation();
  const { started, setIsLoadedCallback, onResetGameSession, isGivingUp, setIsGivingUp , userId, endSession, isHardwareBackPressed, setHardwareBackPressed} = props;
  //const { setIsMaintenance } = useContext(MaintenanceCtx);
  const { gameSession, role, streamStatus, setStreamStatus } = useContext(GameSessionCtx);
  //const { setNotificationError } = useContext(AlertCtx);


  //alert(gameSession);
  const moment = gameSession?.moment;
  const isBattleSession: Boolean =
    gameSession?.sessionType === GameSessionType.BATTLE || gameSession?.sessionType === GameSessionType.TOURNAMENT;
  const gameSessionType = gameSession?.sessionType || GameSessionType.TUTORIAL;

  // const urlParams = new URLSearchParams(location.search);
  // const problem = urlParams.get("problem");

  const [connectedTimes, setConnectedTimes]: any = useState(
    STREAM_STATUS.SHOW_END_SCREEN === streamStatus ? Date.now() : null
  );
  const [network, setNetwork] = useState(5);
  const [nbScore, setNbScore] = useState(0);
  const [streamVolume, setStreamVolume] = useState(0.5);
  const [lastFrame, setLastFrame] = useState(undefined);
  const [stateId, setStateId] = useState("");
  const [isShowingEndScreen, setIsShowingEndScreen] = useState(STREAM_STATUS.SHOW_END_SCREEN === streamStatus);
  const [isDockerError, setIsDockerError] = useState<boolean>(false);
  const [second, setSecond] = useState(0);
  const [streamReadyCallback, setStreamReadyCallback]: any = useState(null);
  const [streamRequireInteractionCallback, setRequireInteractionCallback]: any = useState(null);
  const [isLandscape, setIsLandscape]: any = useState(null);
  const [isRotatedToRightRotation, setIsRotatedToRightRotation] = useState(false);
  const [isStartSoloChanllenge, setIsStartSoloChallenge] = useState(false);
  const [gameUnableToPlay, setGameUnableToPlay] = useState(false);
  const [isShowMustToLeavePopup, setIsShowMustToLeavePopup] = useState(false);

  const streamPaused = [
    STREAM_STATUS.REQUIRE_INTERACTION,
    STREAM_STATUS.OUT_OF_CAPACITY,
    STREAM_STATUS.PAUSED,
    STREAM_STATUS.DISCONNECTED,
    STREAM_STATUS.UNREACHABLE,
    STREAM_STATUS.EDGE_NODE_CRASHED,
    STREAM_STATUS.EXPIRED,
    STREAM_STATUS.HAS_FINAL_SCORE,
    STREAM_STATUS.CONFIRM_TO_LEAVE,
  ].includes(streamStatus);

  const [isProgressBarRunning, setIsProgressBarRunning] = useState(!streamPaused);

  const isRightOrientation: Boolean =
    !moment?.app?.rotationMode ||
    (moment?.app?.rotationMode === RotationMode.LANDSCAPE && isLandscape) ||
    (moment?.app?.rotationMode === RotationMode.PORTRAIT && !isLandscape);

  const onSetStreamVolume = () => {
    setStreamVolume(0.5);
  };

  const onMuteStreamVolume = () => {
    setStreamVolume(0);
  };

  const onSetStreamWaiting = () => {
    setGameUnableToPlay(false);
    setSecond(0);
  };

  const resumeStream = async () => {
    if (!gameSession) return;
    try {
      setStreamStatus(STREAM_STATUS.RESUMED);
      const streamController = await StreamingController({
        apiEndpoint: STREAM_ENDPOINT,
        edgeNodeId: gameSession.edgeNodeId,
      });
      await streamController.resume();
      const video = document.getElementsByTagName("video");
      if (video.length) {
        Rob0.startRecording(video[0]);
      }
    } catch (e) {
      console.error(`Fail to resume the stream has edge node id ${gameSession.edgeNodeId}`, e);
      setStreamStatus(STREAM_STATUS.EXPIRED);
    }
  };

  const pauseStream = async () => {
    if (!gameSession) return;
    try {
      const streamController = await StreamingController({
        apiEndpoint: STREAM_ENDPOINT,
        edgeNodeId: gameSession.edgeNodeId,
      });
      await streamController.pause();
      Rob0.stopRecording();
    } catch (e) {
      console.error(`Fail to pause the stream has edge node id ${gameSession.edgeNodeId}`, e);
      setStreamStatus(STREAM_STATUS.EXPIRED);
    }
  };

  const callAnalyticsAndRob0MethodsWhenEndGameSession = () => {
    if (!isBattleSession) {
      Rob0.addAndUploadEvent({ event_name: EventNames.EXIT_CHALLENGE });
    } else {
      Rob0.addAndUploadEvent({ event_name: EventNames.EXIT_BATTLE });
    }
  };

  const capTheLastFrame = () => {
    const element = document.getElementsByTagName("video");
    if (element.length) {
      const captureLastFrame: any = Rob0.captureScreen(element[0]);
      setLastFrame(captureLastFrame);
    }
  };

  const terminateStream = async () => {
    if (!gameSession) return;
    try {
      await AppLand.terminateStream(gameSession.edgeNodeId);
    } catch (e: any) {
      if (
        e.errors?.[0]?.message === "Network Error" ||
        e.errors?.[0]?.message === "Onmo is currently down for maintenance"
      ) {
       // setIsMaintenance(true);
      } else {
        console.error(`Fail to terminate the stream has edge node id ${gameSession?.edgeNodeId}`, e);
      }
    }
  };

  const hardExitGameSession = () => {
    terminateStream();
    if (!isBattleSession) {
      // if it's not battle session, redirect to previous page
      setStreamStatus(STREAM_STATUS.DONE);
    } else {
      // if is battle session, show the end screen
      capTheLastFrame();
      setStreamStatus(STREAM_STATUS.SHOW_END_SCREEN);
      setStreamStatus(STREAM_STATUS.HAS_FINAL_SCORE);
    }
  };

  const onAgreeToGoBack = async () => {
    setGameUnableToPlay(false);
    callAnalyticsAndRob0MethodsWhenEndGameSession();
    stopToRecordVideoGame();
    hardExitGameSession();
    // reset style for body element
    if (!connectedTimes && document.body) {
      document.body.style.overflow = "auto";
    }
    if (isBattleSession) {
      setStreamStatus(STREAM_STATUS.SHOW_END_SCREEN);
    } else {
      setStreamStatus(STREAM_STATUS.SHOW_END_SCREEN);
      // if (history.length > 1) {
      //   history.go(-1);
      // } else {
      //   history.push("/");
      // }
    }
  };

  const onDockerError = async () => {
    setIsDockerError(true);
    callAnalyticsAndRob0MethodsWhenEndGameSession();
    stopToRecordVideoGame();

    if (isBattleSession) {
      capTheLastFrame();
    }
    setStreamStatus(STREAM_STATUS.DONE);
    await terminateStream();

    if (history.length > 1) {
      history.go(-1);
    } else {
      history.push("/");
    }
  };

  const onDisagreeToGoBack = async () => {
    setStreamStatus(STREAM_STATUS.RESUMED);
    await resumeStream();
    if (isGivingUp) {
      setIsGivingUp(false);
    }
  };

  const onClickOnOnmoBuddy = async () => {
    setStreamStatus(STREAM_STATUS.CONFIRM_TO_LEAVE);
    await pauseStream();
  };

  useEffect(() => {
    if ([STREAM_STATUS.EXPIRED, STREAM_STATUS.UNREACHABLE, STREAM_STATUS.EDGE_NODE_CRASHED].includes(streamStatus)) {
      setIsShowMustToLeavePopup(true);
    } else {
      setIsShowMustToLeavePopup(false);
    }
  }, [streamStatus]);

  const renderMustToLeavePopup = () => {
    return (
      <OnmoPopup isOpen={isShowMustToLeavePopup} disableActions={true} title={"Stream Error"}>
        <div className={classes.continuesBox}>
          <Typography>
            {streamStatus === STREAM_STATUS.EXPIRED
              ? "You have been away for too long. Please reload your game."
              : streamStatus === STREAM_STATUS.UNREACHABLE
              ? "Your connection has timed out. Please reload your game."
              : "Your connection has been interrupted. Please reload your game."}
          </Typography>
          <Button onClick={() => onAgreeToGoBack()}>{"Leave"}</Button>
        </div>
      </OnmoPopup>
    );
  };

  const renderNeedToWaitPopup = () => {
    return (
      <OnmoPopup
        isOpen={gameUnableToPlay}
        title={"Stream Warning"}
        agreeText={"Leave"}
        disagreeText={"Wait"}
        onAgree={onAgreeToGoBack}
        onDisagree={onSetStreamWaiting}
        disableActions={false}
        readOnly={false}>
        <Typography className={classes.textAlignCenter}>
          {streamStatus === STREAM_STATUS.DISCONNECTED
            ? "Please check your network."
            : streamStatus === STREAM_STATUS.VIDEO_CANNOT_PLAY
            ? "Stream cannot play for now. Please wait."
            : t("Stream is out of capacity. Choosing the best server for you.")}
        </Typography>
      </OnmoPopup>
    );
  };

  const renderPopupResume = () => {
    return (
      <OnmoPopup
        isOpen={role === ROLE.HOST && streamStatus === STREAM_STATUS.PAUSED && connectedTimes}
        title={"Continue game session?"}
        disableActions={true}>
        <Button className={classes.resumeStream} onClick={resumeStream}>
          {"Resume"}
        </Button>
      </OnmoPopup>
    );
  };

  const renderRequireInteraction = () => {
    return (
      <OnmoPopup
        isOpen={streamStatus === STREAM_STATUS.REQUIRE_INTERACTION}
        title={t("Saver Battery Mode")}
        disableActions={true}
        readOnly={true}>
        <div className={classes.interactionBox}>
          <Typography>
            {t("Your phone is in battery saver mode.")}
            <br /> {t("Tap to continue.")}
          </Typography>
        </div>
      </OnmoPopup>
    );
  };

  // to show confirm popup if user go back by browser
  const openPopupConfirmLeave = () => {
    let unblock: any;

    //unblock = history.block(() => {
      unblock = () => {
      // exit by app
      if (
        role !== ROLE.HOST ||
        isShowingEndScreen ||
        (!isBattleSession && !connectedTimes) ||
        streamStatus === STREAM_STATUS.DONE ||
        streamStatus === STREAM_STATUS.CONFIRM_TO_LEAVE
      ) {
        return true;
      }
      return false;
    };

    return () => {
      unblock && unblock();
    };
  };

  useEffect(openPopupConfirmLeave, [streamStatus, connectedTimes, isShowingEndScreen]);

  // to pause stream automatically when visibility change during the session
  useEffect(() => {
    let isUnmounted = false;
    const onVisibilityChange = () => {
      if (
        !isUnmounted &&
        document.visibilityState !== "visible" &&
        role === ROLE.HOST &&
        connectedTimes &&
        isProgressBarRunning &&
        streamStatus !== STREAM_STATUS.SHOW_END_SCREEN
      ) {
        pauseStream();
        setStreamStatus(STREAM_STATUS.PAUSED);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      isUnmounted = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedTimes, role, isProgressBarRunning, streamStatus]);

  // fake stream error when client want test quick test
  // useEffect(() => {
  //   if (problem === "EVENT_SERVER_OUT_CAPACITY") {
  //     setStreamStatus(STREAM_STATUS.OUT_OF_CAPACITY);
  //   } else if (problem === "EVENT_STREAM_UNREACHABLE") {
  //     setStreamStatus(STREAM_STATUS.UNREACHABLE);
  //   } else if (problem === "EVENT_EDGE_NODE_CRASHED") {
  //     setStreamStatus(STREAM_STATUS.EDGE_NODE_CRASHED);
  //   } // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [problem]);

  // remember the previous session's volume selection
  useEffect(() => {
    const gameVolume = localStorage.getItem("gameVolume");
    if (gameVolume) {
      setStreamVolume(Number(gameVolume));
    } else {
      setStreamVolume(0);
    }
    // Check if user click back on browser
    window.addEventListener("popstate", onClickOnOnmoBuddy);
    return () => {
      window.removeEventListener("popstate", onClickOnOnmoBuddy);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (isHardwareBackPressed) {
      onClickOnOnmoBuddy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHardwareBackPressed]);

  useEffect(() => {
    if (isGivingUp) {
      onClickOnOnmoBuddy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGivingUp]);

  const onStreamEvent = async (event: any, payload: any) => {
    if (!gameSession) return;
    if (event === StreamingController.EVENT_PREDICTED_GAME_EXPERIENCE) {
      setNetwork(payload);
    } else if (event === StreamingController.EVENT_STREAM_READY) {
      setStreamStatus(STREAM_STATUS.READY);
      setStreamReadyCallback({ payload });
      setIsLoadedCallback && setIsLoadedCallback(true);
    } else if (event === "stream-disconnected") {
      if (
        !isShowMustToLeavePopup &&
        !isShowingEndScreen &&
        !isDockerError &&
        streamStatus !== STREAM_STATUS.CONFIRM_TO_LEAVE
      )
        setStreamStatus(STREAM_STATUS.DISCONNECTED);
    } else if (event === "stream-video-can-play") {
      setStreamStatus(STREAM_STATUS.VIDEO_CAN_PLAY);
    } else if (event === StreamingController.EVENT_SERVER_OUT_OF_CAPACITY) {
      if (!isShowMustToLeavePopup && !isShowingEndScreen) setStreamStatus(STREAM_STATUS.OUT_OF_CAPACITY);
    } else if (event === StreamingController.EVENT_STREAM_UNREACHABLE) {
      if (!isShowMustToLeavePopup && !isShowingEndScreen) setStreamStatus(STREAM_STATUS.UNREACHABLE);
    } else if (event === StreamingController.EVENT_EDGE_NODE_CRASHED) {
      if (!isShowMustToLeavePopup && !isShowingEndScreen) setStreamStatus(STREAM_STATUS.EDGE_NODE_CRASHED);
    } else if (event === StreamingController.EVENT_REQUIRE_USER_PLAY_INTERACTION) {
      setRequireInteractionCallback({ payload });
      setStreamStatus(STREAM_STATUS.REQUIRE_INTERACTION);
    } else if (event === StreamingController.EVENT_STREAM_PAUSED) {
      Rob0.stopRecording();
    } else if (event === StreamingController.EVENT_STREAM_RESUMED) {
      setStreamStatus(STREAM_STATUS.RESUMED);
      const video = document.getElementsByTagName("video");
      if (video?.length) {
        Rob0.startRecording(video[0]);
      }
    } else if (event === "moment-detector-event") {
      const payloadParsed = JSON.parse(payload.payload);
      let currentScore;
      let stateIdFromPayload;
      switch (payloadParsed?.event_type) {
        case "score":
          currentScore = Math.floor(payloadParsed?.data?.score);
          stateIdFromPayload = payloadParsed?.data?.stateId;

          setStateId(stateIdFromPayload);
          if (currentScore) {
            setNbScore(currentScore);
          }
          break;
        case "calculate":
          if (!isShowMustToLeavePopup && navigator.onLine) {
            setStreamStatus(STREAM_STATUS.SHOW_END_SCREEN);
            capTheLastFrame();
          } else {
            setStreamStatus(STREAM_STATUS.DONE);
          }
          break;
        case "final_score":
          setStreamStatus(STREAM_STATUS.HAS_FINAL_SCORE);
          callAnalyticsAndRob0MethodsWhenEndGameSession();
          break;

        // case "docker_error":
        //   setNotificationError(payloadParsed?.message);
        //   onDockerError();
      }
    } else if (event === "stream-terminated") {
      if (!isShowingEndScreen) setStreamStatus(STREAM_STATUS.EXPIRED);
    }
  };

  const onBackPopupText = {
    title: "Leave game session",
    description: t("Are you sure want to leave game session?"),
    agree: "Yes",
    disagree: "No",
  };

  const onBackBattlePopupText = {
    title: "Leave game session",
    description: "Are you sure you want to leave? Your entry fee will not be refunded.",
    agree: "Confirm",
    disagree: "Cancel",
  };

  useEffect(() => {
    if (streamStatus === STREAM_STATUS.SHOW_END_SCREEN) {
      setIsShowingEndScreen(true);
      endSession("SUCCESS");
    }
  }, [streamStatus]);

  useEffect(() => {
    return () => {
      stopToRecordVideoGame();
    };
  }, []);

  useEffect(() => {
    if (isShowingEndScreen) {
      stopToRecordVideoGame();
    }
  }, [isShowingEndScreen]);

  useEffect(() => {
    const interval = setTimeout(() => {
      setSecond(second + 1);
    }, 1000);

    if (second === 20 && !streamReadyCallback) {
      setStreamStatus(STREAM_STATUS.VIDEO_CANNOT_PLAY);
      setGameUnableToPlay(true);
    }
    return () => {
      clearTimeout(interval);
    };
  }, [second, streamReadyCallback]);

  useEffect(() => {
    const onOrientationChange = () => {
      const orientation = parseInt(window.orientation?.toString());
      const isRotate = orientation !== 0 && orientation % 90 === 0;

      if (!isRightOrientation && isRotate) {
        setIsRotatedToRightRotation(true);
      }

      setIsLandscape(isRotate);
    };

    window.addEventListener("orientationchange", onOrientationChange, false);
    return () => {
      window.removeEventListener("orientationchange", onOrientationChange, false);
    };
  }, [isRightOrientation]);

  useEffect(() => {
    // check if stream is ready and rotated to the right orientation for running timer progeress bar
    if ((!streamPaused && isRightOrientation) || (isRotatedToRightRotation && !streamPaused)) {
      setIsProgressBarRunning(true);
    } else {
      setIsProgressBarRunning(false);
    }
  }, [isRotatedToRightRotation, streamStatus, isRightOrientation]);

  useEffect(() => {
    // pause stream until user rotated device to right rotation
    if (!isRotatedToRightRotation) {
      pauseStream();
      setStreamStatus(STREAM_STATUS.PAUSED);
    } else {
      resumeStream();
      setStreamStatus(STREAM_STATUS.RESUMED);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRotatedToRightRotation]);

  useEffect(() => {
    if (
      [STREAM_STATUS.DISCONNECTED, STREAM_STATUS.OUT_OF_CAPACITY, STREAM_STATUS.VIDEO_CANNOT_PLAY].includes(
        streamStatus
      )
    ) {
      setGameUnableToPlay(true);
    } else {
      setGameUnableToPlay(false);
    }
  }, [streamStatus]);

  return (
    <div>
      <div className={classes.container} data-testid="container">
        {!isRightOrientation && (started || isStartSoloChanllenge) && !isRotatedToRightRotation && (
          <div className={classes.rotateWarning}>
            <img alt="" src={RotateAction} />
            <Typography>{"Please rotate your device for this game."}</Typography>
          </div>
        )}
        <GameSessionConfirmDialog
          open={streamStatus === STREAM_STATUS.CONFIRM_TO_LEAVE}
          onAgree={onAgreeToGoBack}
          onDisagree={()=>{
            onDisagreeToGoBack();
            setHardwareBackPressed(false);
          }}
          texts={!isBattleSession ? onBackPopupText : onBackBattlePopupText}
        />
        {!isShowingEndScreen && connectedTimes && moment && (
          <HeaderGameSession
            network={network}
            isShowEndScreen={isShowingEndScreen}
            moment={moment}
            nbScore={nbScore}
            onBack={onClickOnOnmoBuddy}
            isProgressBarRunning={isProgressBarRunning}
            streamVolume={streamVolume}
            onSetStreamVolume={onSetStreamVolume}
            onMuteStreamVolume={onMuteStreamVolume}
            isShowMustToLeavePopup={isShowMustToLeavePopup}
          />
        )}
        {!isShowingEndScreen && (
          <>
            {renderRequireInteraction()}
            {renderPopupResume()}
            {renderNeedToWaitPopup()}
            {renderMustToLeavePopup()}
          </>
        )}
        <div
          id="streamBox"
          data-cy="streamBox"
          data-testid="streamBox"
          className={clsx(
            classes.unselectable,
            classes.root,
            ((role === ROLE.HOST && !connectedTimes) || isShowingEndScreen) && classes.streamNotReady
          )}>
          {(streamStatus !== STREAM_STATUS.DONE || role !== ROLE.HOST) && (
            <GameSessionStreamingView
              connectedTimes={connectedTimes}
              setConnectedTimes={setConnectedTimes}
              enableControl={role === ROLE.HOST}
              onStreamEvent={onStreamEvent}
              onAgreeToGoBack={onAgreeToGoBack}
              setIsStartSoloChallenge={setIsStartSoloChallenge}
              streamVolume={streamVolume}
              streamReadyCallback={streamReadyCallback}
              streamRequireInteractionCallback={streamRequireInteractionCallback}
              isShowingEndScreen={isShowingEndScreen}
              started={started}
              userId={userId}
            />
          )}
          {connectedTimes && !isShowingEndScreen && <GameSessionMask stateId={stateId} />}
        </div>
        {/* {isShowingEndScreen && (
          <EndScreenV4
            key={gameSession?.id}
            matchId={gameSession?.matchId}
            gameSessionType={gameSessionType}
            network={network}
            gameSessionId={gameSession?.id}
            lastFrame={lastFrame}
            onResetGameSession={onResetGameSession}
          />
        )} */}
      </div>
    </div>
  );
};

export default GameSession;
