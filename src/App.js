import "./App.css";
import { useEffect } from "react";
import { StreamingView } from "streaming-view-sdk";
import { StreamingController } from "streaming-view-sdk";

const apiEndpoint = "https://streaming-api.appland-stream.com";

function App() {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const edgeNodeId = params.get("edgeNodeId");
  const userId = params.get("userId");

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
        <StreamingView
          apiEndpoint={apiEndpoint}
          edgeNodeId={edgeNodeId}
          userId={userId}
          enableDebug={true}
          enableControl={true}
          enableFullScreen={false}
        ></StreamingView>
      </header>
    </div>
  );
}

export default App;
