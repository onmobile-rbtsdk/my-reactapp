import { PAGE_CSS_STYLES } from "./src/GameSessionContainer/GameSession/constants";
import { forEach } from "lodash-es";
import moment from "moment";

export const setStyleForGameSessions = () => {
  const styles = PAGE_CSS_STYLES;
  forEach(styles.body, (value: any, key: any) => {
    document.body.style[key] = value;
  });
  forEach(styles.html, (value: any, key: any) => {
    document.documentElement.style[key] = value;
  });
  return () => {
    forEach(styles.body, (value: any, key: any) => {
      // @ts-ignore
      document.body.style[key] = null;
    });
    forEach(styles.html, (value: any, key: any) => {
      // @ts-ignore
      document.documentElement.style[key] = null;
    });
  };
};

export const getTimeShort = (time: string) => {
  return moment()
    .from(time)
    .replace("in", "")
    .replace(/\s/, " ")
    .replace("a minute", "1m")
    .replace(" minutes", "m")
    .replace("an hour", "1h")
    .replace(" hours", "h")
    .replace("a day", "Yesterday")
    .replace(" days", "d")
    .replace("a month", "1m")
    .replace(" months", "m");
};
