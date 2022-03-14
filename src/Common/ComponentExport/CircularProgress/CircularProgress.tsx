import React from "react";
import clsx from "classnames";
import { useTheme } from "react-jss";
import { useStyles } from "./CircularProgress.style";

interface IPropsCircularProgress {
  className?: string;
  style?: any;
  size?: number;
}

export const CircularProgress = (props: IPropsCircularProgress) => {
  const classes = useStyles();
  const theme: any = useTheme();
  const { className, style, size } = props;
  const sizeApply = size || 30;

  const styleInternal = {
    width: sizeApply,
    height: sizeApply,
    border: `${sizeApply / 10}px solid transparent`,
    borderTop: `${sizeApply / 10}px solid ${theme?.palette?.primary?.main}`,
  };

  return <div {...props} className={clsx(classes.root, className)} style={{ ...styleInternal, ...style }} />;
};
