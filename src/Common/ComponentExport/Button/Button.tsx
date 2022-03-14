import React from "react";
import clsx from "classnames";
import { useStyles } from "./Button.style";

interface IPropsButton {
  children: React.ReactNode;
  className?: string;
  onClick?: Function;
  fullWidth?: boolean;
  variant?: "contained" | "outlined" | "text";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  style?: any;
  dataTestId?: string;
}

export const Button = (props: IPropsButton) => {
  const classes = useStyles();
  const {
    children,
    className,
    onClick,
    fullWidth,
    variant,
    startIcon,
    endIcon,
    disabled,
    style,
    dataTestId,
    ...rest
  } = props;

  const onClickButton = (event: React.MouseEvent<HTMLElement>) => {
    if (!onClick) return;
    onClick(event);
  };

  return (
    <button
      data-testid={dataTestId}
      {...rest}
      className={clsx(
        classes.root,
        fullWidth && classes.fullWidth,
        classes.text,
        variant === "contained" && classes.contained,
        variant === "outlined" && classes.outlined,
        startIcon && classes.startIcon,
        endIcon && classes.endIcon,
        disabled && classes.disabled,
        className
      )}
      style={style}
      onClick={onClickButton}
      disabled={disabled}>
      {startIcon && startIcon}
      {children}
      {endIcon && endIcon}
    </button>
  );
};
