import React, { useState, useEffect, useContext } from "react";
import { useStyles as useStylesV4 } from "../HeaderGameSessionV4.style";
import { convertTotalTimePlayed } from "../../../../utils/utils";
//import { GameSessionCtx } from "../../../../../context/gameSession/state";
//import { STREAM_STATUS } from "../../../../../context/gameSession/constants";

export const ProgressBar = (props: any) => {
  const classesV4 = useStylesV4();
 // const { setStreamStatus } = useContext(GameSessionCtx);

  const { isPause, totalTime, isShowEndScreen, isShowMustToLeavePopup, setShowEndScreen }: any = props;

  const [progress, setProgress] = useState(100);

  const timeDisplayWidth = (27 / window.innerWidth) * 100;
  const timeLeft = ((totalTime * progress) / 100) * 1000;

  const requestTime = () => {
    let timerId: any;
    let startTime: number | undefined;

    const showTime = (timestamp: number) => {
      if (!isPause) {
        if (startTime === undefined) {
          startTime = timestamp;
          timerId = requestAnimationFrame(showTime);
          return;
        }

        /* Compute current progress in % from the timestamp between current frame 
          and the latest frame we saved the startTime = timestamp
        */
        const elapsedMs = timestamp - startTime;
        const totalTimeMs = totalTime * 1000;
        const percentRest = (elapsedMs / totalTimeMs) * 100;
        const currentProgress = progress - percentRest;

        /* Updating the width of the progress bar */
        const progressBarEl = document.getElementById("time-progress-bar");

        if (progressBarEl !== null) {
          progressBarEl.style.transform = `translateX(${currentProgress - 100}%)`;
        }

        /* Updating the position of the current time label */
        const timeDisplayEl = document.getElementById("timeDisplay");

        if (timeDisplayEl !== null) {
          if (currentProgress <= timeDisplayWidth) {
            timeDisplayEl.style.transform = `unset`;
          } else if (window.matchMedia("(orientation: landscape)").matches) {
            timeDisplayEl.style.transform = `translateY(${100 - currentProgress}%)`;
          } else {
            timeDisplayEl.style.transform = `translateX(${currentProgress - 100}%)`;
          }

          timeDisplayEl.style.textAlign = currentProgress <= timeDisplayWidth ? "start" : "end";
        }

        /* We only update the progress every second to update the label text */
        if (elapsedMs < 1000) {
          timerId = requestAnimationFrame(showTime);
          return;
        }
        startTime = timestamp;

        if (currentProgress >= -2) {
          setProgress(currentProgress);
        }
      } else {
        timerId = requestAnimationFrame(showTime);
      }
    };

    timerId = requestAnimationFrame(showTime);

    return () => cancelAnimationFrame(timerId);
  };

  useEffect(requestTime, [progress, isPause]);

  const timeLeftLabel = convertTotalTimePlayed(timeLeft);
  const nbSecondsLeft = parseInt(timeLeftLabel.split(" : ")[1], 10);

  // nbSecondsLeft is the second displayed and timeLeft is the real time left
  // 3:00 gives nbSecondsLeft = 0 so we use timeLeft to verify we are under 1 min
  if (!isShowEndScreen && nbSecondsLeft < 1 && timeLeft < 5000) {
    if (setShowEndScreen) {
      setShowEndScreen(true);
    } else {
      if (!isShowMustToLeavePopup && navigator.onLine) {
       // setStreamStatus(STREAM_STATUS.SHOW_END_SCREEN);
      } else {
        //setStreamStatus(STREAM_STATUS.DONE);
      }
    }
  }

  return (
    <>
      <span data-testid="span-time" id="timeDisplay" className={classesV4.timeDisplay}>
        {timeLeftLabel}
      </span>
      <div className={classesV4.rootTimer}>
        <div id="time-progress-bar" className={classesV4.barColorPrimaryTimer}></div>
      </div>
      {!isShowEndScreen && nbSecondsLeft <= 3 && timeLeft < 5000 && (
        <div className={classesV4.countDown}>
          {nbSecondsLeft === 3 && (
            <div className={classesV4.item1}>
              <p>3</p>
            </div>
          )}
          {nbSecondsLeft === 2 && (
            <div className={classesV4.item2}>
              <p>2</p>
            </div>
          )}
          {nbSecondsLeft === 1 && (
            <div className={classesV4.item3}>
              <p>1</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default ProgressBar;
