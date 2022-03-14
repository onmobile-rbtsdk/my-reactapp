import { Storage } from "@aws-amplify/storage";
import { osVersion, osName } from "react-device-detect";

let chunks: any = [];
let duration = 0;
let htmlGameRecorder: any = null;
let streamGameRecorder: any = null;

const FPS_STREAM = 5;
const FPS_HTML = 2;
let fps: any = null;
let startTimeRecording: any = null;
let animationId: any = null;
const streamGameCanvas = document.createElement("canvas") as HTMLCanvasElement;

const eventTouchStream = (e: any) => {
  const videoTag = document.getElementsByTagName("video")[0];
  if (videoTag && streamGameCanvas) {
    const recordingCtx: any = streamGameCanvas.getContext("2d");
    let rect = e.target.getBoundingClientRect();
    const screenX = window.innerWidth;
    const screenY = window.innerHeight - rect.top;
    let x, y;
    if (screenX / screenY > streamGameCanvas.width / streamGameCanvas.height) {
      const fixRatio = streamGameCanvas.height / screenY;
      const overSize = (screenX - screenY * (streamGameCanvas.width / streamGameCanvas.height)) / 2;
      x = (e.changedTouches[0].pageX - overSize) * fixRatio;
      y = (e.changedTouches[0].pageY - rect.top) * fixRatio;
    } else {
      const fixRatio = streamGameCanvas.width / screenX;
      const overSize = (screenY - screenX * (streamGameCanvas.height / streamGameCanvas.width)) / 2;
      x = e.changedTouches[0].pageX * fixRatio;
      y = (e.changedTouches[0].pageY - rect.top - overSize) * fixRatio;
    }
    var circle = new Path2D();
    circle.arc(x - 5, y - 5, 10, 0, 2 * Math.PI);
    recordingCtx.fillStyle = "red";
    recordingCtx.fill(circle);
  }
};

// const eventTouchHtml = (e: any) => {
//   const htmlGameCanvas: any = document.getElementById("UT_CANVAS");
//   if (htmlGameCanvas && streamGameCanvas) {
//     const recordingCtx: any = streamGameCanvas.getContext("2d");

//     const screenX = window.innerWidth;
//     const screenY = window.innerHeight;
//     const x = e.changedTouches[0].clientX * (streamGameCanvas.width / screenX);
//     const y = e.changedTouches[0].clientY * (streamGameCanvas.height / screenY);

//     const circle = new Path2D();
//     circle.arc(x, y, 20, 0, 2 * Math.PI);
//     recordingCtx.fillStyle = "red";
//     recordingCtx.fill(circle);
//   }
// };

const recordingAnim = () => {
  const videoTag = document.getElementsByTagName("video")[0];
  if (videoTag && streamGameCanvas) {
    if (!startTimeRecording) {
      startTimeRecording = Date.now();
    }

    const elapsedTime = Date.now() - startTimeRecording;

    if (elapsedTime < 1000 / fps) {
      animationId = requestAnimationFrame(recordingAnim);
      return;
    }

    const recordingCtx: any = streamGameCanvas.getContext("2d");
    streamGameCanvas.width = videoTag.videoWidth;
    streamGameCanvas.height = videoTag.videoHeight;
    recordingCtx.drawImage(
      videoTag,
      0,
      0,
      videoTag.videoWidth,
      videoTag.videoHeight,
      0,
      0,
      streamGameCanvas.width,
      streamGameCanvas.height
    );
    if (streamGameRecorder && streamGameRecorder.state === "recording") {
      animationId = requestAnimationFrame(recordingAnim);
      return;
    }
  }
};

const saveStreamVideoToS3 = async (sessionId: string) => {
  const blob = new File(chunks, "video.webm", {
    type: "video/webm",
  });

  const videoS3Url = `gameSessions/${sessionId}/video.webm`;

  try {
    await Storage.put(videoS3Url, new File([blob], "video"), {
      contentType: "video/webm",
    });
    console.log("saved game session video to S3", URL.createObjectURL(blob));
  } catch (e) {
    console.error(`Fail to save video of game session ${sessionId}`, e);
  }
  resetCanvas();
};

const resetCanvas = () => {
  chunks = [];
  const oldCanvas: any = streamGameCanvas.getContext("2d");
  oldCanvas.clearRect(0, 0, 0, 0);
};

export const startToRecordStreamVideo = async (gameSessionId: string) => {
  fps = FPS_STREAM;
  const videoTag = document.getElementsByTagName("video")[0];
  if (videoTag) {
    document.body.addEventListener("touchmove", eventTouchStream, false);
    document.body.addEventListener("touchend", eventTouchStream, false);
    // @ts-ignore
    const mediaStream = streamGameCanvas.captureStream(FPS_STREAM) || streamGameCanvas.mozCaptureStream(FPS_STREAM);

    const options = {
      audioBitsPerSecond: 1,
      videoBitsPerSecond: 500000,
    };
    // @ts-ignore
    streamGameRecorder = new MediaRecorder(mediaStream, options);
    streamGameRecorder.onstart = () => {
      console.log("start to record stream video game session");
    };
    streamGameRecorder.ondataavailable = (event: any) => {
      chunks.push(event.data);
    };
    streamGameRecorder.onstop = async () => {
      console.log("stop recording stream video game session");
      document.body.removeEventListener("touchmove", eventTouchStream);
      document.body.removeEventListener("touchend", eventTouchStream);
      duration = Math.round((Date.now() - duration) / 1000);
      saveStreamVideoToS3(gameSessionId);
    };
    streamGameRecorder.onerror = (event: any) => console.error(`Fail to record the canvas`, event);
  }

  streamGameRecorder?.state === "inactive" && streamGameRecorder.start();
  recordingAnim();
  duration = Date.now();
};

export const stopToRecordVideoGame = () => {
  htmlGameRecorder && htmlGameRecorder.state === "recording" && htmlGameRecorder.stop();
  streamGameRecorder && streamGameRecorder.state === "recording" && streamGameRecorder.stop();
  cancelAnimationFrame(animationId);
};

// const getPixels = (gl: any, x: any, y: any, width: any, height: any) => {
//   const length = width * height * 4;
//   const row = width * 4;
//   const end = (height - 1) * row;
//   const arr = new Uint8Array(length);
//   const pixels = new Uint8ClampedArray(length);

//   gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, arr);

//   for (let i = 0; i < length; i += row) {
//     pixels.set(arr.subarray(i, i + row), end - i);
//   }

//   return pixels;
// };

// const drawCanvas = () => {
//   const htmlGameCanvas: any = document.getElementById("UT_CANVAS");
//   if (!htmlGameCanvas) return;
//   const gl = htmlGameCanvas.getContext("webgl2");
//   const data = getPixels(gl, 0, 0, htmlGameCanvas.width, htmlGameCanvas.height);
//   const canvasCtx: any = streamGameCanvas.getContext("2d");

//   streamGameCanvas.width = htmlGameCanvas.width;
//   streamGameCanvas.height = htmlGameCanvas.height;
//   canvasCtx.putImageData(new ImageData(data, htmlGameCanvas.width, htmlGameCanvas.height), 0, 0);
//   setTimeout(() => {
//     animationId = requestAnimationFrame(drawCanvas);
//   }, 1000 / FPS_HTML);
// };

export const startToRecordHtmlVideo = async (gameSessionId: string) => {
  // Do not record for iOS 15.2, it crashes the HTML game
  if (osVersion.indexOf("15.") !== -1 && osName === "iOS") {
    return;
  }

  fps = FPS_HTML;
  const htmlGameCanvas =
    document.getElementById("UT_CANVAS") || (document.getElementById("game-phaser") as HTMLCanvasElement | null);
  if (htmlGameCanvas) {
    // drawCanvas();
    // document.body.addEventListener("touchmove", eventTouchHtml, true);
    // document.body.addEventListener("touchend", eventTouchHtml, true);
    // @ts-ignore

    const mediaStream = htmlGameCanvas.captureStream(FPS_HTML) || htmlGameCanvas.mozCaptureStream(FPS_HTML);

    const options = {
      audioBitsPerSecond: 1,
      videoBitsPerSecond: 10000,
    };
    // @ts-ignore
    htmlGameRecorder = new MediaRecorder(mediaStream, options);
    htmlGameRecorder.onstart = () => {
      console.log("start to record html video game session");
    };
    htmlGameRecorder.ondataavailable = (event: any) => {
      chunks.push(event.data);
    };
    htmlGameRecorder.onstop = async () => {
      console.log("stop recording html video game session");
      duration = Math.round((Date.now() - duration) / 1000);
      saveStreamVideoToS3(gameSessionId);
      // document.body.removeEventListener("touchmove", eventTouchHtml);
      // document.body.removeEventListener("touchend", eventTouchHtml);
    };
    htmlGameRecorder.onresume = (event: any) => console.error(`resume to record the canvas`, event);
    htmlGameRecorder.onwarning = (event: any) => console.error(`warning to record the canvas`, event);
    htmlGameRecorder.onerror = (event: any) => console.error(`Fail to record the canvas`, event);
  }

  htmlGameRecorder?.state === "inactive" && htmlGameRecorder.start();
  duration = Date.now();
};
