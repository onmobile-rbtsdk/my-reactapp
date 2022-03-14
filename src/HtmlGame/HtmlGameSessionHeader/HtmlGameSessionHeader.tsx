import React, { useState, useEffect } from "react";
import On from "../../assets/Game/On.svg";
import Off from "../../assets/Game/Off.svg";
import { useStyles as useStylesV4 } from "../../GameSessionContainer/GameSession/HeaderGameSession/HeaderGameSessionV4.style";
import VeryStrong from "../../assets/header_icons/VeryStrong.svg";
import { ProgressBar } from "../../GameSessionContainer/GameSession/HeaderGameSession/ProgressBar";
import { useTranslation } from "react-i18next";
import { AppLogoIcon } from "../../Common/AppLogoIcon/AppLogoIcon";
import { Timer } from "../../GameSessionContainer/GameSession/HeaderGameSession/Timer";
import { IBaseMoment } from "../../types/baseInterfaces";
import { Typography } from "../../Common/ComponentExport";
interface IPropsHtmlHeaderGameSession {
  nbScore?: number | null;
  isShowEndScreen: boolean;
  setIsEndGame: Function;
  onClickBack: Function;
  isPause: boolean;
  moment: IBaseMoment;
}

// @ts-ignore
const onmoHtmlGame = window.onmoHtmlGame as any;

const IS_TEST = process.env.REACT_APP_TEST === "true";

export const HtmlGameSessionHeader = (props: IPropsHtmlHeaderGameSession) => {
  const { t } = useTranslation();
  const classesV4 = useStylesV4();
  const { nbScore, isShowEndScreen, setIsEndGame, onClickBack, isPause, moment } = props;
  const [toggleVolume, setToggleVolume] = useState(0.5);
  const isTypeTime: boolean = moment.type.toLowerCase() === "time";

  const onToggleStreamVolume = () => {
    if (toggleVolume === 0.5) {
      onmoHtmlGame?.soundOff();
      setToggleVolume(0);
      localStorage.setItem("gameVolume", "0");
    } else if (toggleVolume === 0) {
      onmoHtmlGame?.soundOn();
      setToggleVolume(0.5);
      localStorage.setItem("gameVolume", "0.5");
    }
  };

  useEffect(() => {
    const gameVolume = localStorage.getItem("gameVolume");
    if (gameVolume) {
      setToggleVolume(Number(gameVolume));
      if (gameVolume === "0") {
        onmoHtmlGame?.soundOff();
      } else {
        onmoHtmlGame?.soundOn();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("gameVolume")]);
  let headerText = 'Score';
  if(moment?.type === 'Time'){
    headerText = 'Time';
  }
  return (
    <div id="header" className={classesV4.wrapper}>
      <div className={classesV4.mainContent}>
        <AppLogoIcon testid="img-back" dataCy="onmo-back" classStyles={classesV4.OnmoLogo} onClickLogo={onClickBack} />
        <div className={classesV4.current_results}>
          <Typography className={classesV4.momentType}>
           {headerText}
          </Typography>
          <div className={classesV4.score}>
            {isTypeTime ? <Timer isPause={isPause} /> : <Typography>{nbScore}</Typography>}
          </div>
        </div>
        <img
          data-testid="img-toggle"
          src={toggleVolume === 0 ? Off : On}
          alt="on-off"
          onClick={() => onToggleStreamVolume()}
          className={classesV4.micIcon}
        />
      </div>
      <img src={VeryStrong} alt="internet-speed" className={classesV4.net_speed} />
      <ProgressBar
        totalTime={IS_TEST ? 5 : moment?.time}
        isPause={isPause}
        setShowEndScreen={setIsEndGame}
        isShowEndScreen={isShowEndScreen}
      />
    </div>
  );
};

export default HtmlGameSessionHeader;
