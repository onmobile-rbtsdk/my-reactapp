import { FRAME_QUALITY } from "../constants/rob0";

export const videoDimensions = (video: HTMLVideoElement) => {
  const videoRatio = video.videoWidth / video.videoHeight;
  let width = video.offsetWidth,
    height = video.offsetHeight;
  const elementRatio = width / height;
  if (elementRatio > videoRatio) width = height * videoRatio;
  else height = width / videoRatio;
  return {
    width: width,
    height: height,
  };
};

export const onTouchChanged = (node: HTMLElement, event: any) => {
  if (!event) return;
  const { clientX, clientY } = event;

  if (node.nodeName === "VIDEO") {
    const video = node as HTMLVideoElement;
    const { height, width } = videoDimensions(video);
    const realStartPoint = {
      x: (video.offsetWidth - width) / 2,
      y: (video.offsetHeight - height) / 2,
    };

    const x = clientX - video.offsetLeft - realStartPoint.x;
    const y = clientY - video.offsetTop - realStartPoint.y;
    if (x > width || x < 0 || y < 0 || y > height) return null;

    return {
      x,
      y,
    };
  }
  return {
    x: clientX,
    y: clientY,
  };
};

export const onMouseChanged = (node: HTMLElement, event: any) => {
  const { offsetX, offsetY, clientX, clientY } = event;
  if (node.nodeName === "VIDEO") {
    const video = node as HTMLVideoElement;
    const { height, width } = videoDimensions(video);
    const realStartPoint = {
      x: (node.offsetWidth - width) / 2,
      y: (node.offsetHeight - height) / 2,
    };

    const x = offsetX - realStartPoint.x;
    const y = offsetY - realStartPoint.y;
    if (x > width || x < 0 || y < 0 || y > height) return null;

    return {
      x,
      y,
    };
  }

  return {
    x: clientX,
    y: clientY,
  };
};

export const getImageData = (canvas: HTMLCanvasElement) =>
  Buffer.from(formatDataURL(canvas.toDataURL("image/jpeg", FRAME_QUALITY)), "base64");

export const formatDataURL = (data: string) =>
  data.replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", "");
