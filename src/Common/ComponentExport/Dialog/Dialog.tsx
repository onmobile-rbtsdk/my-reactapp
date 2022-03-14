import React, { useEffect, useRef } from "react";
import { useStyles } from "./Dialog.style";
import clsx from "classnames";

interface IPropsDialog {
  stickBottom?: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  maxWidth: string;
  open: boolean;
  onClose?: Function;
  className?: any;
  dataTestid?: string;
  id?: string;
}

export const Dialog = ({ children, ...props }: any) => {
  const {
    stickBottom,
    fullScreen,
    fullWidth,
    open,
    onClose,
    className,
    maxWidth,
    dataTestid,
    id,
  }: IPropsDialog = props;
  const classes = useStyles();
  const mountedRef = useRef<boolean | null>(null);

  useEffect(() => {
    // In the first render, when open equals false, no need to set anything
    if ((mountedRef.current === null && open === false) || mountedRef.current === open) return;
    mountedRef.current = open;

    const body = document.getElementsByTagName("body")[0];
    if (open) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    return () => {
      body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {!fullScreen && <div className={classes.backdrop} onClick={() => onClose && onClose()} />}
      <div
        id={id ? id : "dialog"}
        data-testid={dataTestid}
        className={clsx(
          classes.root,
          fullWidth && classes.fullWidth,
          stickBottom && classes.stickBottom,
          fullScreen && classes.fullScreen,
          maxWidth && classes.maxWidth,
          `${maxWidth}`,
          className
        )}>
        {children}
      </div>
    </>
  );
};

export default Dialog;
