import React, { useState, useEffect } from "react";
import { EventsRegister } from "../../../libs";
import { IBaseGameSession } from "../../../models/types/gameSession";

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

interface IHtmlGameProps {
  gameSession: IBaseGameSession;
  setIsLoadedCallback: Function;
  eventRegister?: EventsRegister;
  isStarted: boolean;
  isDockerLoaded: boolean;
  onChangeScore?: Function;
  onEndGame?: Function;
  gameSeed: number;
}

export const HtmlGame = (props: IHtmlGameProps) => {
  const {
    gameSession,
    setIsLoadedCallback,
    eventRegister,
    isStarted,
    isDockerLoaded,
    onChangeScore,
    onEndGame,
    gameSeed,
  } = props;
  const dataMoment = gameSession?.moment?.data || "";
  const [isLoaded, setIsLoaded] = useState(false);

  const loadHtmlGame = () => {
    return new Promise((resolve, reject) => {
      script = document.createElement("script");
      script.src = process.env.REACT_APP_ASSETS_ENDPOINT + `games/${gameSession.moment?.appId}/game.js`;
      script.id = process.env.REACT_APP_ASSETS_ENDPOINT + `games/${gameSession.moment?.appId}/game.js`;
      script.crossOrigin = "anonymous";
      script.addEventListener("load", () => {
        resolve(script);
      });
      script.addEventListener("error", (e: any) => {
        reject(e);
      });
      document.body.appendChild(script);
    });
  };

  const removeScript = () => {
    script?.parentNode?.removeChild(script);
    const canvas = document.getElementById("UT_CANVAS");
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

  const onmoLoadGame = () => {
    onmoHtmlGame.seeds = gameSeed;
    onmoHtmlGame.momentDatas = dataMoment;
    loadHtmlGame().then(() => {
      hideCanvas();
    });

    document.body.style.display = "block";

    return () => {
      resetStyleBody();
      if (isLoaded) {
        onmoHtmlGame?.unload();
      }
    };
  };

  useEffect(() => {
    if (isStarted) {
      showCanvas();
    }
  }, [isStarted]);

  useEffect(onmoLoadGame, []);

  useEffect(() => {
    let isUnmounting: boolean;

    const loadedCallback = () => {
      if (!isUnmounting) {
        isReceivedEndgameEvent = false;
        hideCanvas();
        onmoHtmlGame?.pause();
        setIsLoaded(true);

        if (setIsLoadedCallback) {
          setIsLoadedCallback(true);
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
        onChangeScore && onChangeScore(data.score);
      }
    };
    const endGameCallback = (data: any) => {
      if (!isUnmounting) {
        eventRegister?.sendEndGame();
        isReceivedEndgameEvent = true;
        onEndGame && onEndGame();
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

  // CHECK IF USER NOT ACTIVE ONMO WEB TAB IN ORDER TO PAUSE GAME
  useEffect(() => {
    const onVisibilityChange = () => {
      if (isStarted) {
        try {
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
  }, [onmoHtmlGame, isStarted, eventRegister]);

  useEffect(() => {
    setIsLoadedCallback(isLoaded && isDockerLoaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isDockerLoaded]);

  return (
    <div data-testid="div-root">
      <div id="error_log" style={{ display: "none" }} />
    </div>
  );
};

export default HtmlGame;
