import { flatten, map } from "lodash-es";
import React, { useContext, useEffect, useState } from "react";
import { GameSessionCtx } from "../../context/gameSession/state";
import { GameType, RotationMode } from "../../graphql/API";
import { isDataV2, isDataV3 } from "../../utils/utils";
import { useStyles } from "./GameSessionMask.style";
import { getDefaultStateId } from "./helper";
import clsx from "classnames";
import { Status } from "../../graphql/API";
import warning from "../../assets/Game/warning.svg";
import { Typography } from "../../Common/ComponentExport";

interface IGameSessionMaskProps {
  stateId?: string;
}

export const GameSessionMask = (props: IGameSessionMaskProps) => {
  const { stateId } = props;
  const classes = useStyles();
  const { gameSession }: any = useContext(GameSessionCtx);
  const [masks, setMasks]: any = useState([]);
  const defaultStateId: string = getDefaultStateId(gameSession?.moment?.data);
  const [currentStateId, setCurrentStateId] = useState<string>(defaultStateId);
  const [loadNotiClickedMask, setLoadNotiClickedMask] = useState<boolean>(false);

  const game = gameSession?.moment?.app;

  const getZonesCustom = (state: any) => {
    return map(state.zones, (zone) => ({ ...zone, stateId: state.id }));
  };

  useEffect(() => {
    setCurrentStateId(stateId || defaultStateId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoadNotiClickedMask(false);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [loadNotiClickedMask]);

  const buildMasks = () => {
    try {
      if (!game || !game.data || game?.type === GameType.HTML) return;

      const dataGame = JSON.parse(game?.data);
      let zonesList = [];

      if (isDataV3(gameSession?.moment?.data)) {
        zonesList = flatten(map(dataGame.versions["v3.0"]?.states, (state: any) => getZonesCustom(state)));
      } else if (isDataV2(gameSession?.moment?.data)) {
        zonesList = dataGame?.zones || dataGame.versions["v2.0"]?.zones;
      } else {
        return;
      }

      const masksList = map(zonesList, (zoneItem: any) => {
        if (zoneItem?.type?.toLowerCase() === "mask") {
          const { bbox } = zoneItem;
          return {
            left: `${bbox.left * 100}%`,
            top: `${bbox.top * 100}%`,
            width: `${bbox.width * 100}%`,
            height: `${bbox.height * 100}%`,
            stateId: zoneItem?.stateId,
          };
        }
      }).filter((o) => !!o);

      setMasks(masksList);
    } catch (e) {
      console.warn("Mask not working", e);
    }
  };

  const onClickMask = (event: any) => {
    setLoadNotiClickedMask(true);
    event?.preventDefault();
  };

  const renderMasks = () => {
    return masks?.map((maskValues: any, index: number) => {
      return (
        <div
          key={index}
          data-testid="renderMasks-onClick"
          onClick={(e) => onClickMask(e)}
          className={clsx(classes.mask, { [classes.greenBackground]: gameSession?.moment?.status === Status.DRAFT })}
          style={{
            top: maskValues.top,
            left: maskValues.left,
            height: maskValues.height,
            width: maskValues.width,
            visibility: maskValues?.stateId === currentStateId || !maskValues?.stateId ? "visible" : "hidden",
          }}
        />
      );
    });
  };

  const renderNotiClickMask = () => {
    return (
      <div className={classes.notiClickedMask}>
        <div className={classes.notiMask}>
          {<img className={classes.warningIcon} src={warning} alt="" />}
          <Typography className={classes.textNoti}>All buttons in a game are disabled</Typography>
        </div>
      </div>
    );
  };

  useEffect(() => {
    buildMasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  return (
    <>
      {loadNotiClickedMask && renderNotiClickMask()}
      <div className={game?.rotationMode === RotationMode.LANDSCAPE ? classes.rootLandscape : classes.root}>
        <div className={classes.innerRoot}>{masks && renderMasks()}</div>
      </div>
    </>
  );
};
export default GameSessionMask;
