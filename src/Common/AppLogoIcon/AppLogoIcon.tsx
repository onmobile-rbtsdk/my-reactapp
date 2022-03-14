import React from "react";
import { THEME_NAME } from "../../utils/theme";
import OnmoLogo from "../../assets/header_icons/OnmoLogo.svg";
import DialogLogo from "../../assets/nav_icons/dialog-logo.svg";

export const AppLogoIcon = (props: any) => {
  const { onClickLogo, classStyles, dataCy, testid } = props;

  const getSource = () => {
    switch (THEME_NAME) {
      case "ONMO": {
        return OnmoLogo;
      }
      case "DIALOG": {
        return DialogLogo;
      }
      default:
        return OnmoLogo;
    }
  };

  return (
    <img
      src={getSource()}
      alt="Onmo-Logo"
      data-testid={testid}
      data-cy={dataCy}
      className={classStyles}
      onClick={() => onClickLogo()}
    />
  );
};

export default AppLogoIcon;
