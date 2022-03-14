import React, { useState, useEffect } from "react";
import { convertTotalTimePlayed } from "../../../../utils/utils";
import { Typography } from "../../../../Common/ComponentExport/Typography";

export const Timer = (props: any) => {
  const { isPause } = props;
  const [currentTime, setcurrentTime]: any = useState(0);

  const requestProgress = () => {
    if (!isPause) {
      const timer = setInterval(() => {
        setcurrentTime(currentTime + 1000);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  };

  useEffect(requestProgress, [currentTime, isPause]);

  return <Typography data-testid="span-time">{convertTotalTimePlayed(currentTime)}</Typography>;
};

export default Timer;
