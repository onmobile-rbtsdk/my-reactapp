import * as React from "react";
import { HtmlGame } from "../HtmlGame";
import { SimulateEvent } from "../../../libs";
import { IBaseGameSession } from "../../../models/types/gameSession";
import { useStyles } from "./HTMLSimulateDataset.styles";
import DATASET from "../../../libs/simulateEvent/eventDataset.json";
import { IEventDataset } from "../../../libs/simulateEvent/types";
import { setStyleForGameSessions } from "../../../../../helpers";
import { Button, Grid, CircularProgress, Typography } from "../../../../Common/ComponentExport";

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

export const HTMLSimulateDataset = () => {
  const [simulator, setSimulator] = React.useState<SimulateEvent | null>(null);
  const [gameSession, setGameSession] = React.useState<IBaseGameSession | undefined>(undefined);
  const [timeStarted, setTimeStarted] = React.useState<number | null>(null);
  const [score, setScore] = React.useState<number>(0);
  const classes = useStyles();
  const gameSeed = new Date(new Date().setHours(0, 0, 0, 0)).getTime();

  React.useEffect(setStyleForGameSessions, []);

  const onRelay = (isReplay: boolean) => {};

  const onLoadedGame = (isLoaded: boolean) => {
    if (isLoaded) {
      simulator?.sendGameLoaded();
    }
  };

  const onFetchGameSession = (gameSession: IBaseGameSession) => {
    if (gameSession) {
      setGameSession(gameSession);
    }
  };

  const onStartGame = () => {
    onmoHtmlGame?.resume();
    setTimeStarted(Date.now());
    simulator?.startGameFromDataset();
  };

  React.useEffect(() => {
    const simulator = new SimulateEvent({
      onmoAPI: "http://localhost:4100",
      canvasId: "UT_CANVAS",
      delayTime: 1000,
      onmoEnvironment: process.env.REACT_APP_ENV,
      eventDataset: DATASET as IEventDataset,
      onRelay,
      onFetchGameSession,
      onChangeScore,
    });

    setSimulator(simulator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeScore = (score: number) => {
    simulator?.updateScore(score);
    setScore(score);
  };

  const onEndGame = () => {
    simulator?.endGame();
  };

  if (!gameSession || !simulator) {
    return (
      <Grid container className={classes.wrapper}>
        <Grid item xs={12} sm={12} md={8} className={classes.loadingSpace}>
          <CircularProgress size={40} className={classes.loadingIcon} data-testid="loading-icon" />
        </Grid>
      </Grid>
    );
  }

  return (
    <div data-testid="div-root">
      <Grid container className={classes.buttonGroupWrapper}>
        <Grid item xs={12} className={classes.buttonGroupInner}>
          {timeStarted === null ? (
            <Button
              fullWidth
              data-testid="btn-start"
              variant="contained"
              onClick={onStartGame}
              className={classes.button}>
              Start
            </Button>
          ) : (
            <Typography data-testid="score" className={classes.score}>
              Score: {score}
            </Typography>
          )}
        </Grid>
      </Grid>
      <HtmlGame
        gameSeed={gameSeed}
        gameSession={gameSession}
        isStarted={timeStarted !== null}
        isDockerLoaded={true}
        setIsLoadedCallback={onLoadedGame}
        onChangeScore={(score: number) => onChangeScore(score)}
        onEndGame={onEndGame}
      />
    </div>
  );
};

export default HTMLSimulateDataset;
