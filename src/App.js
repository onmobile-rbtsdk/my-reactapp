import "./App.css";
import { useEffect, useState } from "react";
import { StreamingView } from "streaming-view-sdk";
import { StreamingController } from "streaming-view-sdk";
import HtmlGame from "./HtmlGame/HtmlGame";
import HtmlGameV2 from "./HtmlGame/HtmlGameV2";

const apiEndpoint = "https://streaming-api.appland-stream.com";

function App() {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const edgeNodeId = params.get("edgeNodeId");
  const userId = params.get("userId");
  const gameSessionString = params.get("gameSession");
  let gameSession = null;
  if (edgeNodeId === "HTML") {
    try{
    gameSession = JSON.parse(gameSessionString);
    }
    catch(e){
      alert(e.message);
    }
  }
  const [isLoaded, setLoaded] = useState(false);
  const [isHardwareBackPressed, setHardwareBackPressed] = useState(false);

  const startPlaying = async () => {
    console.log("startPlaying edgeNodeId -->" + edgeNodeId);
    const streamController = await StreamingController({
      apiEndpoint: apiEndpoint,
      edgeNodeId: edgeNodeId,
    });
    streamController.resume();
    /*if (gameSession?.id) {
      await startToRecordStreamVideo(gameSession?.id);
    }
    try {
      streamReadyCallback?.payload();
      streamRequireInteractionCallback?.payload();
    } catch (e) {
      console.error(`Fail to run call back functions`, e);
    }
    setConnectedTimes(new Date().getTime());
    */
  };

  const stopPlaying = async () => {
    const streamingController = await StreamingController({
      apiEndpoint: apiEndpoint,
      edgeNodeId: edgeNodeId,
      enableDebug: false,
    });
    await streamingController.terminate();
    window.ReactNativeWebView.postMessage("SUCCESS");
  };

  const handleMessage = (message) => {
    if (message.data === "TERMINATE") {
      stopPlaying();
    }
    else if (message.data === "HARDWARE_BACK") {
      setHardwareBackPressed(true);
    }
  };

  useEffect(() => {
    document.addEventListener("message", handleMessage);
    startPlaying();
    return () => {
      document.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {edgeNodeId !== "HTML" ? (
          <StreamingView
            apiEndpoint={apiEndpoint}
            edgeNodeId={edgeNodeId}
            userId={userId}
            enableDebug={true}
            enableControl={true}
            enableFullScreen={false}
          ></StreamingView>
        ) : (
          <HtmlGame
            gameSession={gameSession}
            started={!isLoaded}
            setIsLoadingGame={isLoaded}
            setIsLoadedCallback={(status) => {
              // alert('loaded=' +status)
              setLoaded(status);
            }}
            setLoadedPercentage={(per) => {
              //  alert(per)
            }}
            endSession={(temp)=>{
              window.ReactNativeWebView.postMessage(temp);
            }}
            isHardwareBackPressed={isHardwareBackPressed}
            setHardwareBackPressed={setHardwareBackPressed}
          />
        )}
      </header>
    </div>
  );
}

export default App;
