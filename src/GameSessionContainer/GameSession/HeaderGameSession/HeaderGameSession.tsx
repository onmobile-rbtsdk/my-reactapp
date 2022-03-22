import React from "react";
import On from "../../../assets/Game/On.svg";
import Off from "../../../assets/Game/Off.svg";
import VeryStrong from "../../../assets/header_icons/VeryStrong.svg";
import Strong from "../../../assets/header_icons/Strong.svg";
import Weak from "../../../assets/header_icons/Weak.svg";
import VeryWeak from "../../../assets/header_icons/VeryWeak.svg";
import { useStyles as useStylesV4 } from "./HeaderGameSessionV4.style";
import ProgressBar from "./ProgressBar/ProgressBar";
import clsx from "classnames";
import { Timer } from "./Timer";
import { IBaseMoment } from "../../../types/baseInterfaces";
import { AppLogoIcon } from "../../../Common/AppLogoIcon/AppLogoIcon";
import { Typography } from "../../../Common/ComponentExport";

const NETWORK: any = {
  "1": VeryWeak,
  "2": Weak,
  "3": Strong,
  "4": VeryStrong,
};

/*
  Network value is from 1 to 5 but we have 4 icons so we multiply
  by this ratio to round to 4 values
*/
const NETWORK_ROUNDED_RATIO = 4 / 5;
const VERY_STRONG_NETWORK = 4; // html games

interface IPropsHeaderGameSession {
  network?: number;
  moment: IBaseMoment;
  onBack: Function;
  nbScore?: number | null;
  isProgressBarRunning?: boolean;
  onSetStreamVolume: Function;
  onMuteStreamVolume: Function;
  streamVolume?: number;
  isShowEndScreen: boolean;
  isShowMustToLeavePopup: boolean;
}

export const HeaderGameSession = (props: IPropsHeaderGameSession) => {
  const classesV4 = useStylesV4();
  const {
    network,
    moment,
    nbScore,
    isProgressBarRunning,
    onSetStreamVolume,
    onMuteStreamVolume,
    streamVolume,
    isShowEndScreen,
    onBack,
    isShowMustToLeavePopup,
  } = props;

  const isTypeTime: boolean = moment.type.toLowerCase() === "time";
  const isShowTimer: boolean = moment.showTimer;

  const networkRounded = network ? Math.round(network * NETWORK_ROUNDED_RATIO) : VERY_STRONG_NETWORK;

  const onToggleStreamVolume = () => {
    if (streamVolume !== 0) {
      onMuteStreamVolume();
      localStorage.setItem("gameVolume", "0");
    } else {
      onSetStreamVolume();
      localStorage.setItem("gameVolume", "0.5");
    }
  };

  return (
    <div id="header" className={clsx(classesV4.wrapper, isShowEndScreen && classesV4.slideUp)}>
      <div className={classesV4.mainContent}>
        <AppLogoIcon dataCy="onmo-back" classStyles={classesV4.OnmoLogo} onClickLogo={onBack} />
        <div className={classesV4.current_results}>
          <Typography className={classesV4.momentType}>{moment.type}</Typography>
          <div className={classesV4.score}>
            {isTypeTime ? <Timer isPause={!isProgressBarRunning} /> : <Typography>{nbScore}</Typography>}
          </div>
        </div>
        <img
          data-testid="img-toggle"
          src={streamVolume === 0 ? Off : On}
          alt="on-off"
          onClick={() => onToggleStreamVolume()}
          className={classesV4.micIcon}
        />
      </div>
      <img src={NETWORK[networkRounded + ""]} alt="internet-speed" className={classesV4.net_speed} />
      {!isTypeTime && isShowTimer && (
        <ProgressBar
          totalTime={moment.time}
          isPause={!isProgressBarRunning}
          isShowEndScreen={isShowEndScreen}
          isShowMustToLeavePopup={isShowMustToLeavePopup}
        />
      )}
    </div>
  );
};

export default HeaderGameSession;
