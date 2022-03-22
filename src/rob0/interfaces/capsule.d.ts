export interface ITouch {
  x: number;
  y: number;
}

export interface IMouse {
  x: number;
  y: number;
}

export interface IRob0Frame {
  imageData: Uint8Array | null;
  touches: Array<ITouch> | null;
  keyCodes: Array<number> | null;
  mouse: IMouse | null;
}

export interface ICapsulePayload {
  capsuleFrames: Array<IFrame>;
  screenWidth: number;
  screenHeight: number;
  fps: number;
}
