import { difference } from "lodash-es";

export const hash = (s: string) => {
  for (var i = 0, h = 9; i < s.length; ) h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
  return h ^ (h >>> 9);
};

export const freeMemoryAfterPlaying = (keysBefore: any) => {
  const keysAfter = Object.keys(window);
  const diffKeys = difference(keysAfter, keysBefore);
  diffKeys.forEach((key: string) => {
    try {
      if (["orientation"].includes(key)) return;
      const value = (window as any)[key];
      const typeofValue = typeof value;
      (window as any)[key] = null;
      switch (typeofValue) {
        case "function":
          (window as any)[key] = () => {};
          break;
        case "object":
          (window as any)[key] = { _HTML: { input: {} } };
          break;
        case "string":
          (window as any)[key] = "";
          break;
        default:
          break;
      }
    } catch (e) {
      console.log(`Fail to clean key ${key}`, e);
    }
  });
  console.info(`${diffKeys.length} keys cleaned.`);
};

export const removeScript = (script: any) => {
  script?.parentNode?.removeChild(script);
  const canvas = document.getElementById("UT_CANVAS") || document.getElementById("game-phaser");
  canvas?.parentNode?.removeChild(canvas);
};
