export const hideCanvas = () => {
  const canvas = document.getElementById("UT_CANVAS") || document.getElementById("game-phaser");
  canvas?.style.setProperty("display", "none");
  console.info("hide canvas");
};

export const showCanvas = () => {
  console.log("show canvas");
  const canvas = document.getElementById("UT_CANVAS") || document.getElementById("game-phaser");
  canvas?.style.setProperty("maxWidth", "100vw");
  canvas?.style.setProperty("maxHeight", "100vh");
  canvas?.style.setProperty("display", "block");
  canvas?.style.setProperty("background", "#222323");
};
