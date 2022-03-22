import "./App.css";
import { useEffect, useState } from "react";
import HtmlGame from "./HtmlGame/HtmlGame";
import { GameSession } from "./GameSessionContainer/GameSession";
import GameSessionProvider from "./context/gameSession/state";
import { STREAM_STATUS } from "./context/gameSession/constants";

function App() {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const userId = params.get("userId");
  const gameSessionString = params.get("gameSession");
  let gameSession = null;
  try {
    gameSession = JSON.parse(gameSessionString);
  } catch (e) {
    alert(e.message);
  }
  const [isLoaded, setLoaded] = useState(false);
  const [isHardwareBackPressed, setHardwareBackPressed] = useState(false);

  const handleMessage = (message) => {
    if (message.data === "HARDWARE_BACK") {
      setHardwareBackPressed(true);
    }
  };

  useEffect(() => {
    document.addEventListener("message", handleMessage);
    return () => {
      document.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {gameSession?.edgeNodeId !== "HTML" ? (
          <GameSessionProvider
            gameSession={gameSession}
            streamStatus={
              gameSession?.sessionResults
                ? STREAM_STATUS.SHOW_END_SCREEN
                : STREAM_STATUS.CONNECTING
            }
          >
            <GameSession
              started={isLoaded}
              setIsLoadingGame={!isLoaded}
              setIsLoadedCallback={(status) => {
                window.ReactNativeWebView.postMessage("LOADED");
                setLoaded(status);
              }}
              userId={userId}
              endSession={(temp) => {
                window.ReactNativeWebView.postMessage(temp);
              }}
              isHardwareBackPressed={isHardwareBackPressed}
              setHardwareBackPressed={setHardwareBackPressed}
            />
          </GameSessionProvider>
        ) : (
          <HtmlGame
            gameSession={gameSession}
            started={!isLoaded}
            setIsLoadingGame={isLoaded}
            setIsLoadedCallback={(status) => {
              if (status) {
                window.ReactNativeWebView.postMessage("LOADED");
              }
              setLoaded(status);
            }}
            setLoadedPercentage={(per) => {
              //  alert(per)
            }}
            endSession={(temp) => {
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
