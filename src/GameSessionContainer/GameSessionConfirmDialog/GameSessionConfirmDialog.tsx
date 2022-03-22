import React from "react";
import { OnmoPopup } from "../../OnmoPopup";
import { createUseStyles } from "react-jss";
import { Typography } from "../../Common/ComponentExport";

interface IPropsGameSessionConfirmDialog {
  open: boolean;
  onAgree: Function;
  onDisagree: Function;
  texts: any;
}

export const useStyles = createUseStyles(() => ({
  logoutText: {
    width: "100%",
    fontSize: 15,
    color: "#222",
    textAlign: "center",
  },
}));

export const GameSessionConfirmDialog = (props: any) => {
  const { open, onAgree, onDisagree, texts }: IPropsGameSessionConfirmDialog = props;
  const classes = useStyles();
  if (!open) return null;

  return (
    <>
      <OnmoPopup
        isPriorityConfirm={true}
        isOpen={open}
        onAgree={onAgree}
        onDisagree={onDisagree}
        title={texts.title}
        disagreeText={texts.disagree}
        agreeText={texts.agree}>
        <Typography className={classes.logoutText}>{texts.description}</Typography>
      </OnmoPopup>
    </>
  );
};
