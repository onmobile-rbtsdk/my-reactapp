import React from "react";
import clsx from "classnames";
import { useStyles } from "./Typography.style";

type IVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "caption" | "body1" | "body2";

interface IPropsTypography {
  children?: React.ReactNode;
  className?: string;
  onClick?: Function;
  variant?: IVariant;
  id?: string;
}

export const Typography = (props: IPropsTypography) => {
  const classes = useStyles();
  const { children, className, onClick, variant } = props;

  const onClickButton = (event: React.MouseEvent<HTMLElement>) => {
    if (!onClick) return;
    onClick(event);
  };

  const renderTag = () => {
    switch (variant) {
      case "h1":
        return (
          <h1 {...props} className={clsx(classes.root, className)} onClick={onClickButton}>
            {children}
          </h1>
        );
      case "h2":
        return (
          <h2 {...props} className={clsx(classes.root, className)} onClick={onClickButton}>
            {children}
          </h2>
        );
      case "h3":
        return (
          <h3 {...props} className={clsx(classes.root, className)} onClick={onClickButton}>
            {children}
          </h3>
        );
      case "h4":
        return (
          <h4 {...props} className={clsx(classes.root, className)} onClick={onClickButton}>
            {children}
          </h4>
        );
      case "h5":
        return (
          <h5 {...props} className={clsx(classes.root, className)} onClick={onClickButton}>
            {children}
          </h5>
        );
      case "h6":
        return (
          <h6 {...props} className={clsx(classes.root, className)} onClick={onClickButton}>
            {children}
          </h6>
        );
      case "caption":
        return (
          <span {...props} className={clsx(classes.root, className)} onClick={onClickButton}>
            {children}
          </span>
        );
      case "body1":
        return (
          <p {...props} className={clsx(classes.root, classes.body1, className)} onClick={onClickButton}>
            {children}
          </p>
        );
      case "body2":
        return (
          <p {...props} className={clsx(classes.root, classes.body2, className)} onClick={onClickButton}>
            {children}
          </p>
        );
      default:
        return (
          <p {...props} className={clsx(classes.root, className)} onClick={onClickButton}>
            {children}
          </p>
        );
    }
  };

  return renderTag();
};
