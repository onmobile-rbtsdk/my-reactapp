export const loadGame = (gameId: string, setLoadedPercentage: Function) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.id = `https://assets-dev.onmostealth.com/games/${gameId}/game.js`;
    script.crossOrigin = "anonymous";
    script.addEventListener("load", () => {
      resolve(script);
    });
    script.addEventListener("error", (e: any) => {
      reject(e);
    });

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://assets-dev.onmostealth.com/games/${gameId}/game.js`, true);
    xhr.onload = (e) => {
      if (xhr.readyState === 4) {
        script.text = xhr.response;

        document.body.appendChild(script);
        resolve(script);
      }
    };
    xhr.onprogress = function (e) {
      setLoadedPercentage(((e.loaded / 20000000) * 100).toFixed(0));
    };

    xhr.send();
  });
};
