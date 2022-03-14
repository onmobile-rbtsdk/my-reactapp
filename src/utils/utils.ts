//import { THEME_REGEX_PHONE_PREFIX } from "../utils/theme";

export const nf = Intl.NumberFormat();

export const formatTime = (duration: number) => {
  const minute = String(Math.floor(duration / 60)).padStart(2, "0");
  const second = String(duration % 60).padStart(2, "0");
  return `${minute}:${second}`;
};

export const convertTotalTimePlayed = (timePlayed: number) => {
  let mins: string | number = Math.floor(timePlayed / 1000 / 60);
  if (mins < 10) {
    mins = "0" + mins;
  }
  let secs: string | number = Math.floor((timePlayed / 1000) % 60);
  if (secs < 10) {
    secs = "0" + secs;
  }
  return mins + " : " + secs;
};

export const convertToScore = (score?: number, type?: string) => {
  if (!score || score === 0 || score === -1) return 0;
  return type?.toUpperCase() === "TIME" ? formatTime(score) : score;
};

export const filterSpecialCharacter = (value: string) => {
  const regexValidName = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
  return value.replace(regexValidName, "");
};

export const isValidName = (name: string) => /^[A-Z0-9 ]{2,16}$/i.test(name);

export const isValidEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

export const isDataV3 = (data: string): boolean => {
  try {
    const dataObj = JSON.parse(data);
    return dataObj?.versions?.hasOwnProperty("v3.0");
  } catch (error) {
    return false;
  }
};

export const isDataV2 = (data: string): boolean => {
  try {
    const dataObj = JSON.parse(data);
    return !dataObj.versions || dataObj.versions?.hasOwnProperty("v2.0");
  } catch (error) {
    return false;
  }
};

// export const isValidPhoneNumber = (phoneNb: string): boolean => {
//   return phoneNb.length >= 10 && phoneNb.length <= 18 && THEME_REGEX_PHONE_PREFIX.test(phoneNb);
// };

export const validateCash = (balance: number): number | string => {
  return balance % 1 === 0 ? balance : balance?.toFixed(2);
};
