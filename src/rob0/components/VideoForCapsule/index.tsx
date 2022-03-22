import React from "react";
import { Rob0 } from "../../models/rob0";
import { createUseStyles } from "react-jss";
import { ITheme } from "../../../types/theme";

const useStyles = createUseStyles((theme: ITheme) => ({
  wrapper: {},
  video: {
    height: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const rob0 = new Rob0();
const VideoForCapsule = (props: any) => {
  const classes = useStyles();
  const videoRef = React.useRef<any>(null);

  const onPlayVideo = () => {
    if (videoRef.current && rob0) {
      if (videoRef.current?.paused) {
        videoRef.current.play();
      }
    }
  };

  return (
    <div className={classes.wrapper}>
      <button onClick={onPlayVideo}>Play</button>
      <div className={classes.video}>
        <video ref={videoRef} width="100%" height="300" src="./assets/capsule_video.mov" muted />
      </div>
    </div>
  );
};

export default VideoForCapsule;
