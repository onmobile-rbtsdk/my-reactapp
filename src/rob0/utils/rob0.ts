import { EventNames } from "../constants/events";
import {
  LATEST_EVENT_TIME,
  ROB0_CREDENTIALS,
  ROB0_EVENTS_OBJECT,
  ROB0_EVENT_ID,
  ROB0_IS_CALLED_CONFIGURATION_FUNC,
  ROB0_STREAMING_EVENT_ID,
} from "../constants/rob0";
import { IRob0ConfigurationCredential } from "../interfaces/rob0";

const aws4 = require("aws4");

export class Rob0Utils {
  static getLocalStorageValue = (type: any) => {
    return JSON.parse(localStorage.getItem(type) || "null");
  };

  static setLocalStorageValue = (type: any, value: any) => {
    localStorage.setItem(type, value);
  };

  static removeLocalStorageValue = (type: any) => {
    localStorage.removeItem(type);
  };

  static getCurrentEventId = (type: any) => {
    const id: any = Rob0Utils.getLocalStorageValue(type);
    return parseInt(id || 0, 10) + 1;
  };

  static getSignature = (opts: any, c: IRob0ConfigurationCredential) => {
    aws4.sign(opts, {
      accessKeyId: c.access_key_id,
      secretAccessKey: c.secret_access_key,
      sessionToken: c.session_token,
    });
  };

  static getRob0StorageConfiguration = () => {
    const credentials = localStorage.getItem(ROB0_CREDENTIALS);
    const lastEventTime = localStorage.getItem(LATEST_EVENT_TIME);
    return { credentials: credentials ? JSON.parse(credentials) : null, lastEventTime };
  };

  static isStartEvent = (type: any) => {
    return type === EventNames.PLAY_BATTLE || type === EventNames.PLAY_CHALLENGE || type === EventNames.PLAY_MOMENT;
  };

  static isEndEvent = (type: any) => {
    return (
      type === EventNames.END_BATTLE ||
      type === EventNames.END_CHALLENGE ||
      type === EventNames.END_MOMENT ||
      type === EventNames.EXIT_BATTLE ||
      type === EventNames.EXIT_CHALLENGE ||
      type === EventNames.EXIT_MOMENT
    );
  };

  static getEndEventName = (startEventName: string) => {
    if (
      startEventName === EventNames.PLAY_BATTLE ||
      startEventName === EventNames.END_BATTLE ||
      startEventName === EventNames.EXIT_BATTLE
    ) {
      return "end_exit_battle";
    } else if (
      startEventName === EventNames.PLAY_CHALLENGE ||
      startEventName === EventNames.END_CHALLENGE ||
      startEventName === EventNames.EXIT_CHALLENGE
    ) {
      return "end_exit_challenge";
    } else if (
      startEventName === EventNames.PLAY_MOMENT ||
      startEventName === EventNames.END_MOMENT ||
      startEventName === EventNames.EXIT_MOMENT
    ) {
      return "end_exit_moment";
    }
    return null;
  };

  static setIsCalledConfigFunc = () => {
    return Rob0Utils.setLocalStorageValue(ROB0_IS_CALLED_CONFIGURATION_FUNC, "true");
  };

  static getIsCalledConfigFuncValue = () => {
    return Rob0Utils.getLocalStorageValue(ROB0_IS_CALLED_CONFIGURATION_FUNC);
  };

  static removeOldLocalStorageEventValue = async () => {
    await Promise.all([
      Rob0Utils.removeLocalStorageValue(LATEST_EVENT_TIME),
      Rob0Utils.removeLocalStorageValue(ROB0_EVENT_ID),
      Rob0Utils.removeLocalStorageValue(ROB0_STREAMING_EVENT_ID),
      Rob0Utils.removeLocalStorageValue(ROB0_EVENTS_OBJECT),
    ]);
  };
}
