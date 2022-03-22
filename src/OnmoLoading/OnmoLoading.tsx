import React from "react";
//import "react-circular-progressbar/dist/styles.css";
import { useStyles } from "./OnmoLoading.style";
import LogoIcon from "../assets/GuestMode/OnmoWhite.svg";
import { Grid } from "../Common/ComponentExport";

export function OnmoLoading() {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <div className={classes.content}>
        <div className={classes.spinner} />
        <img src={LogoIcon} alt="icon-logo-white" />
      </div>
    </Grid>
  );
}

export default OnmoLoading;
