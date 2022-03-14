import React from "react";
import { useStyles } from "./Grid.style";
import clsx from "classnames";

interface IPropsGrid {
  id?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  item?: boolean;
  spacing?: number;
  container?: boolean;
  key?: number | string;
  className?: any;
  onClick?: Function;
  dataTestId: string | number;
  dataCy?: string;
  styleInline?: any;
  onFocusEvent: Function;
  gameId?: string | number;
}

export const Grid = ({ children, ...props }: any) => {
  const {
    id,
    xs,
    sm,
    md,
    lg,
    xl,
    item,
    spacing,
    container,
    key,
    className,
    onClick,
    dataTestId,
    dataCy,
    styleInline,
    onFocusEvent,
    gameId,
  }: IPropsGrid = props;
  const classes = useStyles();

  return (
    <div
      id={id}
      game-id={gameId}
      key={key}
      className={clsx(
        xs && classes.xs,
        xs && `xs${xs}`,
        sm && classes.sm,
        sm && `sm${sm}`,
        md && classes.md,
        md && `md${md}`,
        lg && classes.lg,
        lg && `lg${lg}`,
        xl && classes.xl,
        xl && `xl${xl}`,
        item && classes.item,
        container && classes.container,
        spacing && classes.spacing,
        spacing && `sp${spacing}`,
        className
      )}
      data-testid={dataTestId}
      data-cy={dataCy}
      style={styleInline}
      onClick={() => onClick && onClick()}
      onFocus={() => onFocusEvent && onFocusEvent()}>
      {children}
    </div>
  );
};

export default Grid;
