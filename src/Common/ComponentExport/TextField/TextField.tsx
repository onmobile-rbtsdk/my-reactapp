import React from "react";
import clsx from "classnames";
import { useStyles } from "./TextField.style";

interface IPropsTextField {
  className?: string;
  fullWidth?: boolean;
  disableUnderline?: boolean;
  autoFocus?: boolean;
  startAdornment?: any;
  endAdornment?: any;
  placeholder?: string;
  type?: string;
  value?: string;
  disabled?: boolean;
  onClick?: any;
  onChange?: any;
  name?: string;
  textTransform?: string;
  dataTestId?: string;
  dataTestIdInput?: string;
  required?: boolean;
  dataCy?: string;
  variant?: "outlined" | "filled";
  onBlur?: any;
  inputStyle?: string;
  id?: string;
}

export const TextField = (props: IPropsTextField) => {
  const classes = useStyles();
  const {
    className,
    fullWidth,
    startAdornment,
    endAdornment,
    placeholder,
    type,
    value,
    onChange,
    autoFocus,
    disableUnderline,
    disabled,
    onClick,
    name,
    textTransform,
    dataTestId,
    dataTestIdInput,
    required,
    dataCy,
    variant,
    onBlur,
    inputStyle,
    id,
  } = props;

  return (
    <div
      id={id}
      onClick={() => onClick && onClick()}
      data-testid={dataTestId}
      data-cy={dataCy}
      className={clsx(classes.root, fullWidth && classes.fullWidth, className)}>
      <div
        className={clsx(
          classes.inputRoot,
          fullWidth && classes.fullWidth,
          disableUnderline && classes.disableUnderline,
          variant && classes.variant,
          `${variant}`
        )}>
        {startAdornment && <div className={clsx(classes.adornmentRoot, classes.startAdornment)}>{startAdornment}</div>}
        <input
          required={required}
          data-testid={dataTestIdInput}
          name={name}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={onChange}
          className={clsx(classes.inputBase, inputStyle, textTransform && classes.textTransform, `${textTransform}`)}
          placeholder={placeholder}
          type={type}
          value={value}
          onBlur={onBlur}
        />
        {endAdornment && <div className={clsx(classes.adornmentRoot, classes.endAdornment)}>{endAdornment}</div>}
      </div>
    </div>
  );
};
