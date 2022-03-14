import React from "react";
import clsx from "classnames";
import { useTranslation } from "react-i18next";
import { useStyles } from "./OnmoPopup.style";
import { Dialog, Button, Typography, CircularProgress } from "../Common/ComponentExport";
import CloseIcon from "../assets/ArenaItemRow/Close.svg";

interface IPropsOnmoPopup {
  isPriorityConfirm: boolean;
  isOpen: boolean;
  title: string;
  disagreeText: string;
  onDisagree: Function;
  agreeText: string;
  onAgree: Function;
  textInput: string;
  disableActions: Boolean;
  loading: Boolean;
  readOnly: Boolean;
  isDisableConfirmBtn?: boolean;
  hideDisagree?: boolean;
  image?: string;
  isOverImage?: boolean;
  isCloseIcon?: boolean;
}

export const OnmoPopup = ({ children, ...rest }: any) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    isPriorityConfirm,
    isOpen,
    title,
    disagreeText,
    onDisagree = () => {},
    agreeText,
    onAgree,
    textInput,
    disableActions,
    loading,
    readOnly,
    isDisableConfirmBtn,
    hideDisagree,
    image,
    isOverImage,
    isCloseIcon,
  }: IPropsOnmoPopup = rest;

  return (
    <Dialog
      open={isOpen || false}
      onClose={() => onDisagree()}
      dataTestid="onmo-popup"
      className={clsx(classes.dialog, readOnly && classes.readOnly, isOverImage && classes.overTop)}>
      <div className={clsx(classes.root)}>
        {isCloseIcon && (
          <img className={classes.closeIcon} src={CloseIcon} alt="close-icon" onClick={() => onDisagree()} />
        )}
        <div className={clsx(classes.dialogHeader, isOverImage && "overImage")}>
          {image}
          <Typography data-cy="popup-title" data-testid="popup-title">
            {title}
          </Typography>
        </div>
        {children}
        {!disableActions && (
          <div
            className={clsx(
              classes.dialogFooter,
              isPriorityConfirm && classes.isPriorityConfirm,
              (title === t("editProfile_Want to logout?") || title === t("editProfile_Delete Account?")) &&
                classes.redText
            )}>
            {!hideDisagree && (
              <Button
                data-testid="button-cancel"
                data-cy="popup-button-cancel"
                onClick={() => onDisagree()}
                className={""}>
                {disagreeText || t("common_Cancel")}
              </Button>
            )}
            <Button
              data-testid="button-agree"
              data-cy="popup-button-confirm"
              disabled={Boolean(loading) || Boolean(isDisableConfirmBtn)}
              onClick={() => onAgree()}
              className={clsx(
                textInput || textInput === "" ? clsx(textInput === "" ? classes.btnDisable : "", classes.bold) : "",
                classes.btnAgree
              )}>
              {loading ? <CircularProgress data-testid="text-agree" size={25} /> : agreeText || t("common_Confirm")}
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
};
export default OnmoPopup;
