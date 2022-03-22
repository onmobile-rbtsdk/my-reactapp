import { flatbuffers } from "flatbuffers";
import { Rob0 } from "./rob0-model";
import { INITIAL_BUILDER_SIZE } from "../constants/capsule";
import { ICapsulePayload, IRob0Frame } from "../interfaces/capsule";

interface ITouch {
  x: number;
  y: number;
}

interface IMouse {
  x: number;
  y: number;
}

export const buildCapsule = ({ capsuleFrames, screenWidth, screenHeight, fps }: ICapsulePayload) => {
  const builder: any = new flatbuffers.Builder(INITIAL_BUILDER_SIZE);
  let imageDataOffset = 0;
  let imagesData: Array<Uint8Array | null> = [];
  let frames = new Array(capsuleFrames.length);

  capsuleFrames.forEach((frame: IRob0Frame, i: number) => {
    const { touches, mouse, keyCodes } = frame;
    let touchOffset = null;
    let keyCodesOffset = null;

    if (touches && touches !== null) {
      touchOffset = addTouchEvents(builder, touches);
    }
    if (keyCodes && keyCodes !== null) {
      keyCodesOffset = Rob0.Frame.createKeyCodesVector(builder, keyCodes);
    }

    Rob0.Frame.startFrame(builder);
    if (capsuleFrames[i].imageData && capsuleFrames[i].imageData !== null) {
      addImages(builder, capsuleFrames[i].imageData, imageDataOffset);
      imagesData.push(capsuleFrames[i].imageData);
      imageDataOffset += capsuleFrames[i].imageData?.byteLength || 0;
    }
    if (touchOffset) {
      Rob0.Frame.addTouch(builder, touchOffset);
    }
    if (keyCodesOffset) Rob0.Frame.addKeyCodes(builder, keyCodesOffset);
    if (mouse) {
      addMouseEvents(builder, mouse);
    }

    frames[i] = Rob0.Frame.endFrame(builder);
    Rob0.Frame.addAppFps(builder, fps);
  });

  const framesOffset = Rob0.Capsule.createFramesVector(builder, frames);

  Rob0.Capsule.startCapsule(builder);
  Rob0.Capsule.addVersion(builder, 1);
  Rob0.Capsule.addFps(builder, fps);
  const resOffset = Rob0.Vector2.createVector2(builder, screenWidth, screenHeight);
  Rob0.Capsule.addResolution(builder, resOffset);
  Rob0.Capsule.addFrames(builder, framesOffset);

  const capsule = Rob0.Capsule.endCapsule(builder);
  builder.finishSizePrefixed(capsule);
  const capsuleData = builder.asUint8Array();
  let data: Uint8Array = new Uint8Array(capsuleData.byteLength + imageDataOffset);
  data.set(capsuleData, 0);
  imageDataOffset = imagesData.reduce((currentOffset, imageData: any) => {
    data.set(imageData, currentOffset);
    return currentOffset + imageData?.byteLength;
  }, capsuleData.byteLength);

  return data;
};

const addTouchEvents = (builder: flatbuffers.Builder, touches: Array<ITouch>) => {
  Rob0.Frame.startTouchVector(builder, touches.length);
  touches.forEach((touch: ITouch) => {
    Rob0.Vector2.createVector2(builder, touch.x, touch.y);
  });

  return builder.endVector();
};

const addMouseEvents = (builder: flatbuffers.Builder, mouse: IMouse) => {
  const mouseOffset = Rob0.Vector2.createVector2(builder, mouse.x, mouse.y);
  Rob0.Frame.addMouse(builder, mouseOffset);
};

const addImages = (builder: flatbuffers.Builder, imageData: Uint8Array | null, imageDataOffset: number) => {
  const imageOffset = Rob0.Image.createImage(builder, imageDataOffset, imageData?.byteLength || 0);
  Rob0.Frame.addImage(builder, imageOffset);
};
