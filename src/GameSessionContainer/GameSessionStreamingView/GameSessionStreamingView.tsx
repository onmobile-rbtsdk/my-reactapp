import queryString from "query-string";
import React, { useContext, Suspense, useEffect } from "react";
//import { useLocation } from "react-router-dom";
import { STREAM_ENDPOINT } from "../../constants/endpoint";
import { GameSessionCtx } from "../../context/gameSession/state";
//import { UserCtx } from "../../context/user/state";
// import { GameSessionType } from "../../graphql/API";
//import { ROLE } from "../GameSession/constants";
import { OnmoLoading } from "../../OnmoLoading";
//import { PreloadScreen } from "./PreloadScreen/PreLoadScreen";
import { isMobile } from "react-device-detect";
import StreamingView from "../../appland/StreamingView";
import { StreamingController } from "streaming-view-sdk";
import { startToRecordStreamVideo } from "../GameSession/helper";

interface IPropsGameSessionStreamingView {
  connectedTimes: number;
  setConnectedTimes: Function;
  onStreamEvent: Function;
  streamVolume?: number;
  streamReadyCallback: { payload: Function };
  streamRequireInteractionCallback: { payload: Function };
  enableControl: boolean;
  isCalculating?: boolean;
  onAgreeToGoBack: Function;
  setIsStartSoloChallenge: Function;
  isShowingEndScreen?: boolean;
  started?: boolean;
  userId:string
}

export const GameSessionStreamingView = (props: IPropsGameSessionStreamingView) => {

  const {
    connectedTimes,
    setConnectedTimes,
    onStreamEvent,
    streamVolume,
    streamReadyCallback,
    streamRequireInteractionCallback,
    setIsStartSoloChallenge,
    enableControl,
    started,
    userId
  } = props;
  const { gameSession, role } = useContext(GameSessionCtx);
  //const { userData } = useContext(UserCtx);
  //const location = useLocation();
  //const { startAt }: any = queryString.parse(location.search);
  //const isInGameSession = window.location.pathname.includes("app/game-session");

  const startPlaying = async () => {
    const streamController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
      edgeNodeId: gameSession?.edgeNodeId,
    });
    streamController.resume();
    if (gameSession?.id) {
      await startToRecordStreamVideo(gameSession?.id);
    }
    try {
      streamReadyCallback?.payload();
      streamRequireInteractionCallback?.payload();
    } catch (e) {
      console.error(`Fail to run call back functions`, e);
    }
    setConnectedTimes(new Date().getTime());
  };

  // const isShowingPreloadScreen =
  //   role === ROLE.HOST &&
  //   !connectedTimes &&
  //   gameSession?.sessionType !== GameSessionType.BATTLE &&
  //   gameSession?.sessionType !== GameSessionType.TOURNAMENT &&
  //   isInGameSession;

  useEffect(() => {
    if (started && gameSession) {
      startPlaying();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, gameSession]);

  // if (gameSession)
  return (
    <Suspense fallback={<OnmoLoading />}>
      <StreamingView
        key={gameSession?.id}
        //userClickedPlayAt={parseInt(startAt, 10)}
        apiEndpoint={STREAM_ENDPOINT}
        edgeNodeId={gameSession?.edgeNodeId}
        userId={userId}
        enableControl={enableControl}
        enableDebug={false}
        enableFullScreen={isMobile}
        muted={streamVolume === 0}
        volume={streamVolume}
        onEvent={(evt: any, payload: any) => onStreamEvent(evt, payload)}></StreamingView>
      {/* {isShowingPreloadScreen && (
        <PreloadScreen
          setIsStartSoloChallenge={setIsStartSoloChallenge}
          startPlaying={() => startPlaying()}
          streamReadyCallback={streamReadyCallback}
          gameType={"STREAMING"}
          loadedPercentage={0}
        />
      )} */}
    </Suspense>
  );
};
export default GameSessionStreamingView;
