import * as React from "react";
import { HtmlGame } from "../HtmlGame";
import { EventsRegister } from "../../../libs";
//import { GameSessions } from "../../../../modelsv2/gameSessions";
import { IBaseGameSession } from "../../../models/types/gameSession";
import { useStyles } from "./HTMLGameSimulationEmulator.style";
import axios from "axios";
import { IEventDataset } from "../../../libs/register/types";
import { setStyleForGameSessions } from "../../../../../helpers";
import { Button, Grid, CircularProgress, Typography, TextField } from "../../../../Common/ComponentExport";
import { io } from "socket.io-client";
import { Version } from "../../../libs/register/types/enums";

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

export const HTMLGameSimulationEmulator = () => {
  const [isReplay, setIsReplay] = React.useState<boolean>(false);
  const [finalScore, setFinalScore] = React.useState<number | null>(null);
  const [isDockerLoaded, setIsDockerLoaded] = React.useState<boolean>(false);
  const [eventRegister, setEventRegister] = React.useState<any | null>(null);
  const [timeStarted, setTimeStarted] = React.useState<number | null>(null);
  const [gameSessionId, setGameSessionId] = React.useState<string | null>(null);
  const [dockerURI, setDockerURI] = React.useState<string | undefined>(undefined);
  const [gameSession, setGameSession] = React.useState<IBaseGameSession | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [score, setScore] = React.useState(0);
  const [scores, setScores] = React.useState<number[]>([]);

  const classes = useStyles();

  const gameSeed = new Date(new Date().setHours(0, 0, 0, 0)).getTime();

  React.useEffect(setStyleForGameSessions, []);

  const fetchGameSession = async (gameSessionId: string) => {
    return null;
    // try {
    //   const gameSession = await GameSessions.getGameSession(gameSessionId);
    //   setGameSession(gameSession);
    //   return gameSession;
    // } catch (e) {
    //   alert(e);
    // }

    // return null;
  };

  const onSubmitInput = async () => {
    if (!gameSessionId || isLoading) return;
    setIsLoading(true);
    const gameSession = await fetchGameSession(gameSessionId);
    if (!gameSession) return;

    const onmoAPI =
      dockerURI || process.env.REACT_APP_HTML_GAME_SIMULATION_URL || "https://dev-html-simulation.onmostealth.com/";

    const websocket = io(onmoAPI, {
      transports: ["websocket"],
    });

    // const register = new EventsRegister({
    //   onmoAPI: dockerURI,
    //   gameSessionId: gameSession.id,
    //   onChangeScore,
    //   onChangeFinalScore,
    //   onLoadedDocker,
    //   onGetEventDataSet,
    //   gameSeed,
    //   websocket,
    //   version: Version.versionDataset,
    // });
    // setEventRegister(register);
    setIsLoading(true);
  };

  const onChangeScore = (score: number) => {
    scores.push(score);
    setScores(scores);
    setScore(score);
  };

  const onChangeFinalScore = (finalScore: number) => {
    console.log("[Docker HTML] - finalScore", finalScore);
    setFinalScore(finalScore);
  };

  const onLoadedDocker = (isLoaded: boolean) => {
    console.log("[Docker HTML] - Docker is loaded");
    setIsDockerLoaded(isLoaded);
  };

  const onLeave = () => {
    eventRegister?.sendLeftGame();
  };

  const onResume = () => {
    onmoHtmlGame?.resume();
    eventRegister?.sendGameResume();
  };

  const onStartGame = () => {
    onmoHtmlGame?.resume();
    setTimeStarted(Date.now());
    eventRegister?.onGameStart();
  };

  const onReplay = async () => {
    setIsReplay(isReplay);
    try {
      await axios.get(`${dockerURI}/external/?reset=true&time=${Date.now()}&room=${gameSessionId}`);
    } catch (e) {
      alert(e);
    }
    window.location.reload();
  };

  const onLoadedGame = () => {
    console.log("Game loaded");
  };

  const onPauseGame = () => {
    onmoHtmlGame?.pause();
    eventRegister?.sendGamePause();
  };

  const onEndGame = () => {
    onmoHtmlGame?.pause();
    eventRegister?.sendEndGame();
  };

  const onLostInternet = () => {
    eventRegister?.lostInternetMock();
  };

  const onReconnectInternet = () => {
    eventRegister?.reconnectInternet();
  };

  const getEventDataset = () => {
    eventRegister?.getEventDataset();
  };

  const onGetEventDataSet = (eventDataSet: IEventDataset) => {
    try {
      console.log(
        "[DATASET]",
        JSON.stringify({
          gameSessionId,
          data: eventDataSet,
          gameSeed,
          scores,
        })
      );

      const data = JSON.stringify({
        gameSessionId,
        gameSeed,
        data: eventDataSet,
        scores,
      });

      const blob = new Blob([data], { type: "application/json" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      const fileName = `dataset-${gameSessionId}`;
      link.download = fileName + ".json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className={classes.root}>
      {gameSessionId !== null && gameSession ? (
        <>
          <HtmlGame
            eventRegister={eventRegister}
            gameSession={gameSession}
            gameSeed={gameSeed}
            isStarted={timeStarted !== null}
            isDockerLoaded={isDockerLoaded}
            setIsLoadedCallback={onLoadedGame}
            onChangeScore={onChangeScore}
          />
          {!timeStarted ? (
            <Button
              data-testid="btn-start"
              onClick={onStartGame}
              fullWidth
              variant="contained"
              disabled={dockerURI !== undefined && !isDockerLoaded}>
              {dockerURI !== undefined && !isDockerLoaded && (
                <CircularProgress size={20} className={classes.loadingIcon} />
              )}
              {dockerURI !== undefined && !isDockerLoaded ? "Waiting for docker" : "Start game"}
            </Button>
          ) : (
            <>
              <Grid container className={classes.buttonGroupWrapper} dataTestId="button-group">
                <Grid item xs={12} className={classes.buttonGroupInner}>
                  <Typography className={classes.score}>
                    {finalScore ? `finalScore: ${finalScore}` : `Score: ${score}`}
                  </Typography>
                  {dockerURI && (
                    <>
                      <Button
                        variant="contained"
                        disabled={timeStarted === null}
                        onClick={onPauseGame}
                        className={classes.button}>
                        Pause
                      </Button>
                      <Button
                        variant="contained"
                        disabled={timeStarted === null}
                        onClick={onResume}
                        className={classes.button}>
                        Resume
                      </Button>
                      <Button
                        variant="contained"
                        disabled={timeStarted === null}
                        onClick={onEndGame}
                        className={classes.button}>
                        End Game
                      </Button>
                      <Button
                        variant="contained"
                        disabled={timeStarted === null}
                        onClick={onLeave}
                        className={classes.button}>
                        Leave
                      </Button>
                      <Button
                        variant="contained"
                        disabled={timeStarted === null}
                        onClick={onLostInternet}
                        className={classes.button}>
                        Lost internet
                      </Button>
                      <Button
                        variant="contained"
                        disabled={timeStarted === null}
                        onClick={onReconnectInternet}
                        className={classes.button}>
                        Reconnect internet
                      </Button>
                      <Button
                        variant="contained"
                        disabled={timeStarted === null}
                        onClick={onReplay}
                        className={classes.button}>
                        Replay
                      </Button>
                    </>
                  )}
                  <Button
                    variant="contained"
                    disabled={timeStarted === null}
                    onClick={getEventDataset}
                    className={classes.button}>
                    Log Data
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </>
      ) : (
        <Grid container className={classes.wrapper} dataTestId="input-form">
          <Grid item xs={12} sm={12} md={8} className={classes.form}>
            <Typography>To check docker, enter docker uri</Typography>
            <Typography>To log event dataset only, leave it blank</Typography>
            <TextField
              dataTestIdInput="input-game-session-id"
              fullWidth
              variant="outlined"
              onChange={(e: any) => setGameSessionId(e.target.value)}
              placeholder={"Enter game session id"}
              className={classes.textField}
              required
            />
            <TextField
              dataTestIdInput="input-docker-uri"
              fullWidth
              variant="outlined"
              onChange={(e: any) => setDockerURI(e.target.value)}
              placeholder={"Enter docker uri"}
              className={classes.textField}
            />
            <Button onClick={onSubmitInput} fullWidth variant="contained" data-testid="btn-submit">
              {isLoading && <CircularProgress size={20} className={classes.loadingIcon} />}
              Submit
            </Button>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default HTMLGameSimulationEmulator;
