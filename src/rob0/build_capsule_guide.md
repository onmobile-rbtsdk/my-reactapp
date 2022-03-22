# create-capsule

## Input

```js
- Array of Frame data:
  + imageData // Uint8Array
  + touchs // The coordinates of the touch position
  + mouse // The coordinates of the click position
  + keyCodes // Array of key code

- screenHeight // height of the frame container
- screenWidth // width of the frame container
- fps // frame rate
```

<img width="500" alt="Screen Shot 2021-02-23 at 14 31 19 (1)" src="https://user-images.githubusercontent.com/32598364/108813891-6f959780-75e4-11eb-8c27-7b8ab534b72a.png">

## Output

```js
Uint8Array: Uint8Array(74951) [208, 1, 0, 0, 16, 0, 0, 0, 12, 0, 20,...]
```

## Examples

```js
import { buildCapsule } from "./buildCapsule";

const frames = [{
  imageData: Uint8Array(7485) [255, 216, 255, 226, 0, 1, 16, ...],
  touches: [{ x: 300, y: 400 }], [{ x: 320, y: 300 }],
  mouse: { x: 200, y: 300 },
  keyCodes: [0, 8],
}]

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 500;
const FRAME_RATE = 30;

const data = buildCapsule(
  {
    capsuleFrames: frames,
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
    fps: FRAME_RATE
  }
);
```

## How to get Image/ Touch/ Mouse/ Key codes input from a capsule

- Rob0-model package and Partial Buffer class is require to get a capsule

```js
import { Rob0 } from "./rob0-model";
import PartialBuffer from "./PartialBuffer";
```

- Get capsule from Data buffer in Partial buffer type

```js
  ...
  const data = buildCapsule(
    {
      capsuleFrames: frames,
      screenWidth: SCREEN_WIDTH,
      screenHeight: SCREEN_HEIGHT,
      fps: FRAME_RATE
    }
  );

  const size = capsuleBuffer.byteLength;
  const buffer = new PartialBuffer(size - 4);
  buffer.putData(capsuleBuffer.slice(4));
  buffer.size = readInt32(capsuleBuffer, 0);

  const capsule = Rob0.Capsule.getRootAsCapsule(buffer);
```

- Capsule contain a number of frames
- Each frame contain one image, touches / mouse / keycode inputs

```js
...
const framesLength = capsule.framesLength();
const fps = capsule.fps();
const frame = capsule.frames(i);
```

- For image, we have to slice data from the offset position plus the frame offset to the end of the image size

```js
const image = frame.image();
const start = bufferImage && bufferImage.offset() + bufferImage.bb.size;
const length = bufferImage && bufferImage.size();
const binaryImage = bufferImage && bufferImage.bb.bytes().slice(start, start + length);
```

- For the touches / mouse / keyCode: from the input, you can get the coordinates of the touch / mouse position: input.x() / input.y()

```js
// Get Touch input from a frame:
for (let i = 0; i < frame.touchLength(); i++) {
   const touchInput = frame.mouse(i);
...

// Get Mouse input from a frame:
for (let i = 0; i < frame.touchLength(); i++) {
   const mouseInput = frame.touch(i);
...

// Get Key code innput from a frame:
const keyCodeLength = frame.keyCodesLength();
for (let i = 0; i < keyCodeLength; i++) {
  const code = frame.keyCodes(i);
...
```

# Upload capsule

```js
// Define Rob0 model
import { Rob0 } from "./rob0";

const rob0 = Rob0.configuration({
  sessionId: "3adb1b68f71731ffe2d7478e6d894359607963b9",
  deviceId: "3adb1b68f71731ffe2d747aa6d894359607963b9",
  momentId: "onmo-application",
  username: "Alex",
});

// Start Recording

Rob0.startRecording((node: HTMLElement | HTMLVideoElement | HTMLCanvasElement));
```

## Key codes

```js
export const KeyCode = [
  // Not assigned (never returned as the result of a keystroke)
  { name: "None", code: 0 },
  // The backspace key
  { name: "Backspace", code: 8 },
  // The forward delete key
  { name: "Delete", code: 127 },
  // The tab key
  { name: "Tab", code: 9 },
  // The Clear key
  { name: "Clear", code: 12 },
  // Return key
  { name: "Return", code: 13 },
  // Pause on PC machines
  { name: "Pause", code: 19 },
  // Escape key
  { name: "Escape", code: 27 },
  // Space key
  { name: "Space", code: 32 },

  // Numeric keypad 0
  { name: "Keypad0", code: 256 },
  // Numeric keypad 1
  { name: "Keypad1", code: 257 },
  // Numeric keypad 2
  { name: "Keypad2", code: 258 },
  // Numeric keypad 3
  { name: "Keypad3", code: 259 },
  // Numeric keypad 4
  { name: "Keypad4", code: 260 },
  // Numeric keypad 5
  { name: "Keypad5", code: 261 },
  // Numeric keypad 6
  { name: "Keypad6", code: 262 },
  // Numeric keypad 7
  { name: "Keypad7", code: 263 },
  // Numeric keypad 8
  { name: "Keypad8", code: 264 },
  // Numeric keypad 9
  { name: "Keypad9", code: 265 },
  // Numeric keypad '.'
  { name: "KeypadPeriod", code: 266 },
  // Numeric keypad '/'
  { name: "KeypadDivide", code: 267 },
  // Numeric keypad '*'
  { name: "KeypadMultiply", code: 268 },
  // Numeric keypad '-'
  { name: "KeypadMinus", code: 269 },
  // Numeric keypad '+'
  { name: "KeypadPlus", code: 270 },
  // Numeric keypad enter
  { name: "KeypadEnter", code: 271 },
  // Numeric keypad
  { name: "KeypadEquals", code: 272 },

  // Up arrow key
  { name: "UpArrow", code: 273 },
  // Down arrow key
  { name: "DownArrow", code: 274 },
  // Right arrow key
  { name: "RightArrow", code: 275 },
  // Left arrow key
  { name: "LeftArrow", code: 276 },
  // Insert key key
  { name: "Insert", code: 277 },
  // Home key
  { name: "Home", code: 278 },
  // End key
  { name: "End", code: 279 },
  // Page up
  { name: "PageUp", code: 280 },
  // Page down
  { name: "PageDown", code: 281 },

  // F1 function key
  { name: "F1", code: 282 },
  // F2 function key
  { name: "F2", code: 283 },
  // F3 function key
  { name: "F3", code: 284 },
  // F4 function key
  { name: "F4", code: 285 },
  // F5 function key
  { name: "F5", code: 286 },
  // F6 function key
  { name: "F6", code: 287 },
  // F7 function key
  { name: "F7", code: 288 },
  // F8 function key
  { name: "F8", code: 289 },
  // F9 function key
  { name: "F9", code: 290 },
  // F10 function key
  { name: "F10", code: 291 },
  // F11 function key
  { name: "F11", code: 292 },
  // F12 function key
  { name: "F12", code: 293 },
  // F13 function key
  { name: "F13", code: 294 },
  // F14 function key
  { name: "F14", code: 295 },
  // F15 function key
  { name: "F15", code: 296 },

  // The '0' key on the top of the alphanumeric keyboard.
  { name: "Alpha0", code: 48 },
  // The '1' key on the top of the alphanumeric keyboard.
  { name: "Alpha1", code: 49 },
  // The '2' key on the top of the alphanumeric keyboard.
  { name: "Alpha2", code: 50 },
  // The '3' key on the top of the alphanumeric keyboard.
  { name: "Alpha3", code: 51 },
  // The '4' key on the top of the alphanumeric keyboard.
  { name: "Alpha4", code: 52 },
  // The '5' key on the top of the alphanumeric keyboard.
  { name: "Alpha5", code: 53 },
  // The '6' key on the top of the alphanumeric keyboard.
  { name: "Alpha6", code: 54 },
  // The '7' key on the top of the alphanumeric keyboard.
  { name: "Alpha7", code: 55 },
  // The '8' key on the top of the alphanumeric keyboard.
  { name: "Alpha8", code: 56 },
  // The '9' key on the top of the alphanumeric keyboard.
  { name: "Alpha9", code: 57 },

  // Exclamation mark key '!'
  { name: "Exclaim", code: 33 },
  // Double quote key '"'
  { name: "DoubleQuote", code: 34 },
  // Hash key '#'
  { name: "Hash", code: 35 },
  // Dollar sign key '$'
  { name: "Dollar", code: 36 },
  // Percent sign key '%'
  { name: "Percent", code: 37 },
  // Ampersand key '&'
  { name: "Ampersand", code: 38 },
  // Quote key '
  { name: "Quote", code: 39 },
  // Left Parenthesis key '('
  { name: "LeftParen", code: 40 },
  // Right Parenthesis key ')'
  { name: "RightParen", code: 41 },
  // Asterisk key '*'
  { name: "Asterisk", code: 42 },
  // Plus key '+'
  { name: "Plus", code: 43 },
  // Comma ',' key
  { name: "Comma", code: 44 },

  // Minus '-' key
  { name: "Minus", code: 45 },
  // Period '.' key
  { name: "Period", code: 46 },
  // Slash '/' key
  { name: "Slash", code: 47 },

  //Colon key
  { name: "Colon", code: 58 },
  // Semicolon ';' key
  { name: "Semicolon", code: 59 },
  // Less than '<' key
  { name: "Less", code: 60 },
  //Equals
  { name: "Equals", code: 61 },
  // Greater than '>' key
  { name: "Greater", code: 62 },
  // Question mark '?' key
  { name: "Question", code: 63 },
  // At key '@'
  { name: "At", code: 64 },

  // Left square bracket key '['
  { name: "LeftBracket", code: 91 },
  // Backslash key '\'
  { name: "Backslash", code: 92 },
  // Right square bracket key ']'
  { name: "RightBracket", code: 93 },
  // Caret key '^'
  { name: "Caret", code: 94 },
  // Underscore '_' key
  { name: "Underscore", code: 95 },
  // Back quote key '`'
  { name: "BackQuote", code: 96 },

  // 'a' key
  { name: "A", code: 97 },
  // 'b' key
  { name: "B", code: 98 },
  // 'c' key
  { name: "C", code: 99 },
  // 'd' key
  { name: "D", code: 100 },
  // 'e' key
  { name: "E", code: 101 },
  // 'f' key
  { name: "F", code: 102 },
  // 'g' key
  { name: "G", code: 103 },
  // 'h' key
  { name: "H", code: 104 },
  // 'i' key
  { name: "I", code: 105 },
  // 'j' key
  { name: "J", code: 106 },
  // 'k' key
  { name: "K", code: 107 },
  // 'l' key
  { name: "L", code: 108 },
  // 'm' key
  { name: "M", code: 109 },
  // 'n' key
  { name: "N", code: 110 },
  // 'o' key
  { name: "O", code: 111 },
  // 'p' key
  { name: "P", code: 112 },
  // 'q' key
  { name: "Q", code: 113 },
  // 'r' key
  { name: "R", code: 114 },
  // 's' key
  { name: "S", code: 115 },
  // 't' key
  { name: "T", code: 116 },
  // 'u' key
  { name: "U", code: 117 },
  // 'v' key
  { name: "V", code: 118 },
  // 'w' key
  { name: "W", code: 119 },
  // 'x' key
  { name: "X", code: 120 },
  // 'y' key
  { name: "Y", code: 121 },
  // 'z' key
  { name: "Z", code: 122 },

  // Left curly bracket key '{'
  { name: "LeftCurlyBracket", code: 123 },
  // Pipe key '|'
  { name: "Pipe", code: 124 },
  // Right curly bracket key '}'
  { name: "RightCurlyBracket", code: 125 },
  // Tilde key '~'
  { name: "Tilde", code: 126 },

  // Numlock key
  { name: "Numlock", code: 300 },
  // Capslock key
  { name: "CapsLock", code: 301 },
  // Scroll lock key
  { name: "ScrollLock", code: 302 },
  // Right shift key
  { name: "RightShift", code: 303 },
  // Left shift key
  { name: "LeftShift", code: 304 },
  // Right Control key
  { name: "RightControl", code: 305 },
  // Left Control key
  { name: "LeftControl", code: 306 },
  // Right Alt key
  { name: "RightAlt", code: 307 },
  // Left Alt key
  { name: "LeftAlt", code: 308 },

  // Left Command key
  { name: "LeftCommand", code: 310 },
  // Left Command key
  { name: "LeftApple", code: 310 },
  // Left Windows key
  { name: "LeftWindows", code: 311 },
  // Right Command key
  { name: "RightCommand", code: 309 },
  // Right Command key
  { name: "RightApple", code: 309 },
  // Right Windows key
  { name: "RightWindows", code: 312 },
  // Alt Gr key
  { name: "AltGr", code: 313 },

  // Help key
  { name: "Help", code: 315 },
  // Print key
  { name: "Print", code: 316 },
  // Sys Req key
  { name: "SysReq", code: 317 },
  // Break key
  { name: "Break", code: 318 },
  // Menu key
  { name: "Menu", code: 319 },

  // First (primary) mouse button
  { name: "Mouse0", code: 323 },
  // Second (secondary) mouse button
  { name: "Mouse1", code: 324 },
  // Third mouse button
  { name: "Mouse2", code: 325 },
  // Fourth mouse button
  { name: "Mouse3", code: 326 },
  // Fifth mouse button
  { name: "Mouse4", code: 327 },
  // Sixth mouse button
  { name: "Mouse5", code: 328 },
  // Seventh mouse button
  { name: "Mouse6", code: 329 },

  // HeavyButton 0 on any joystick
  { name: "JoystickButton0", code: 330 },
  // HeavyButton 1 on any joystick
  { name: "JoystickButton1", code: 331 },
  // HeavyButton 2 on any joystick
  { name: "JoystickButton2", code: 332 },
  // HeavyButton 3 on any joystick
  { name: "JoystickButton3", code: 333 },
  // HeavyButton 4 on any joystick
  { name: "JoystickButton4", code: 334 },
  // HeavyButton 5 on any joystick
  { name: "JoystickButton5", code: 335 },
  // HeavyButton 6 on any joystick
  { name: "JoystickButton6", code: 336 },
  // HeavyButton 7 on any joystick
  { name: "JoystickButton7", code: 337 },
  // HeavyButton 8 on any joystick
  { name: "JoystickButton8", code: 338 },
  // HeavyButton 9 on any joystick
  { name: "JoystickButton9", code: 339 },
  // HeavyButton 10 on any joystick
  { name: "JoystickButton10", code: 340 },
  // HeavyButton 11 on any joystick
  { name: "JoystickButton11", code: 341 },
  // HeavyButton 12 on any joystick
  { name: "JoystickButton12", code: 342 },
  // HeavyButton 13 on any joystick
  { name: "JoystickButton13", code: 343 },
  // HeavyButton 14 on any joystick
  { name: "JoystickButton14", code: 344 },
  // HeavyButton 15 on any joystick
  { name: "JoystickButton15", code: 345 },
  // HeavyButton 16 on any joystick
  { name: "JoystickButton16", code: 346 },
  // HeavyButton 17 on any joystick
  { name: "JoystickButton17", code: 347 },
  // HeavyButton 18 on any joystick
  { name: "JoystickButton18", code: 348 },
  // HeavyButton 19 on any joystick
  { name: "JoystickButton19", code: 349 },

  // HeavyButton 0 on first joystick
  { name: "Joystick1Button0", code: 350 },
  // HeavyButton 1 on first joystick
  { name: "Joystick1Button1", code: 351 },
  // HeavyButton 2 on first joystick
  { name: "Joystick1Button2", code: 352 },
  // HeavyButton 3 on first joystick
  { name: "Joystick1Button3", code: 353 },
  // HeavyButton 4 on first joystick
  { name: "Joystick1Button4", code: 354 },
  // HeavyButton 5 on first joystick
  { name: "Joystick1Button5", code: 355 },
  // HeavyButton 6 on first joystick
  { name: "Joystick1Button6", code: 356 },
  // HeavyButton 7 on first joystick
  { name: "Joystick1Button7", code: 357 },
  // HeavyButton 8 on first joystick
  { name: "Joystick1Button8", code: 358 },
  // HeavyButton 9 on first joystick
  { name: "Joystick1Button9", code: 359 },
  // HeavyButton 10 on first joystick
  { name: "Joystick1Button10", code: 360 },
  // HeavyButton 11 on first joystick
  { name: "Joystick1Button11", code: 361 },
  // HeavyButton 12 on first joystick
  { name: "Joystick1Button12", code: 362 },
  // HeavyButton 13 on first joystick
  { name: "Joystick1Button13", code: 363 },
  // HeavyButton 14 on first joystick
  { name: "Joystick1Button14", code: 364 },
  // HeavyButton 15 on first joystick
  { name: "Joystick1Button15", code: 365 },
  // HeavyButton 16 on first joystick
  { name: "Joystick1Button16", code: 366 },
  // HeavyButton 17 on first joystick
  { name: "Joystick1Button17", code: 367 },
  // HeavyButton 18 on first joystick
  { name: "Joystick1Button18", code: 368 },
  // HeavyButton 19 on first joystick
  { name: "Joystick1Button19", code: 369 },

  // HeavyButton 0 on second joystick
  { name: "Joystick2Button0", code: 370 },
  // HeavyButton 1 on second joystick
  { name: "Joystick2Button1", code: 371 },
  // HeavyButton 2 on second joystick
  { name: "Joystick2Button2", code: 372 },
  // HeavyButton 3 on second joystick
  { name: "Joystick2Button3", code: 373 },
  // HeavyButton 4 on second joystick
  { name: "Joystick2Button4", code: 374 },
  // HeavyButton 5 on second joystick
  { name: "Joystick2Button5", code: 375 },
  // HeavyButton 6 on second joystick
  { name: "Joystick2Button6", code: 376 },
  // HeavyButton 7 on second joystick
  { name: "Joystick2Button7", code: 377 },
  // HeavyButton 8 on second joystick
  { name: "Joystick2Button8", code: 378 },
  // HeavyButton 9 on second joystick
  { name: "Joystick2Button9", code: 379 },
  // HeavyButton 10 on second joystick
  { name: "Joystick2Button10", code: 380 },
  // HeavyButton 11 on second joystick
  { name: "Joystick2Button11", code: 381 },
  // HeavyButton 12 on second joystick
  { name: "Joystick2Button12", code: 382 },
  // HeavyButton 13 on second joystick
  { name: "Joystick2Button13", code: 383 },
  // HeavyButton 14 on second joystick
  { name: "Joystick2Button14", code: 384 },
  // HeavyButton 15 on second joystick
  { name: "Joystick2Button15", code: 385 },
  // HeavyButton 16 on second joystick
  { name: "Joystick2Button16", code: 386 },
  // HeavyButton 17 on second joystick
  { name: "Joystick2Button17", code: 387 },
  // HeavyButton 18 on second joystick
  { name: "Joystick2Button18", code: 388 },
  // HeavyButton 19 on second joystick
  { name: "Joystick2Button19", code: 389 },

  // HeavyButton 0 on third joystick
  { name: "Joystick3Button0", code: 390 },
  // HeavyButton 1 on third joystick
  { name: "Joystick3Button1", code: 391 },
  // HeavyButton 2 on third joystick
  { name: "Joystick3Button2", code: 392 },
  // HeavyButton 3 on third joystick
  { name: "Joystick3Button3", code: 393 },
  // HeavyButton 4 on third joystick
  { name: "Joystick3Button4", code: 394 },
  // HeavyButton 5 on third joystick
  { name: "Joystick3Button5", code: 395 },
  // HeavyButton 6 on third joystick
  { name: "Joystick3Button6", code: 396 },
  // HeavyButton 7 on third joystick
  { name: "Joystick3Button7", code: 397 },
  // HeavyButton 8 on third joystick
  { name: "Joystick3Button8", code: 398 },
  // HeavyButton 9 on third joystick
  { name: "Joystick3Button9", code: 399 },
  // HeavyButton 10 on third joystick
  { name: "Joystick3Button10", code: 400 },
  // HeavyButton 11 on third joystick
  { name: "Joystick3Button11", code: 401 },
  // HeavyButton 12 on third joystick
  { name: "Joystick3Button12", code: 402 },
  // HeavyButton 13 on third joystick
  { name: "Joystick3Button13", code: 403 },
  // HeavyButton 14 on third joystick
  { name: "Joystick3Button14", code: 404 },
  // HeavyButton 15 on third joystick
  { name: "Joystick3Button15", code: 405 },
  // HeavyButton 16 on third joystick
  { name: "Joystick3Button16", code: 406 },
  // HeavyButton 17 on third joystick
  { name: "Joystick3Button17", code: 407 },
  // HeavyButton 18 on third joystick
  { name: "Joystick3Button18", code: 408 },
  // HeavyButton 19 on third joystick
  { name: "Joystick3Button19", code: 409 },

  // HeavyButton 0 on forth joystick
  { name: "Joystick4Button0", code: 410 },
  // HeavyButton 1 on forth joystick
  { name: "Joystick4Button1", code: 411 },
  // HeavyButton 2 on forth joystick
  { name: "Joystick4Button2", code: 412 },
  // HeavyButton 3 on forth joystick
  { name: "Joystick4Button3", code: 413 },
  // HeavyButton 4 on forth joystick
  { name: "Joystick4Button4", code: 414 },
  // HeavyButton 5 on forth joystick
  { name: "Joystick4Button5", code: 415 },
  // HeavyButton 6 on forth joystick
  { name: "Joystick4Button6", code: 416 },
  // HeavyButton 7 on forth joystick
  { name: "Joystick4Button7", code: 417 },
  // HeavyButton 8 on forth joystick
  { name: "Joystick4Button8", code: 418 },
  // HeavyButton 9 on forth joystick
  { name: "Joystick4Button9", code: 419 },
  // HeavyButton 10 on forth joystick
  { name: "Joystick4Button10", code: 420 },
  // HeavyButton 11 on forth joystick
  { name: "Joystick4Button11", code: 421 },
  // HeavyButton 12 on forth joystick
  { name: "Joystick4Button12", code: 422 },
  // HeavyButton 13 on forth joystick
  { name: "Joystick4Button13", code: 423 },
  // HeavyButton 14 on forth joystick
  { name: "Joystick4Button14", code: 424 },
  // HeavyButton 15 on forth joystick
  { name: "Joystick4Button15", code: 425 },
  // HeavyButton 16 on forth joystick
  { name: "Joystick4Button16", code: 426 },
  // HeavyButton 17 on forth joystick
  { name: "Joystick4Button17", code: 427 },
  // HeavyButton 18 on forth joystick
  { name: "Joystick4Button18", code: 428 },
  // HeavyButton 19 on forth joystick
  { name: "Joystick4Button19", code: 429 },

  // HeavyButton 0 on fifth joystick
  { name: "Joystick5Button0", code: 430 },
  // HeavyButton 1 on fifth joystick
  { name: "Joystick5Button1", code: 431 },
  // HeavyButton 2 on fifth joystick
  { name: "Joystick5Button2", code: 432 },
  // HeavyButton 3 on fifth joystick
  { name: "Joystick5Button3", code: 433 },
  // HeavyButton 4 on fifth joystick
  { name: "Joystick5Button4", code: 434 },
  // HeavyButton 5 on fifth joystick
  { name: "Joystick5Button5", code: 435 },
  // HeavyButton 6 on fifth joystick
  { name: "Joystick5Button6", code: 436 },
  // HeavyButton 7 on fifth joystick
  { name: "Joystick5Button7", code: 437 },
  // HeavyButton 8 on fifth joystick
  { name: "Joystick5Button8", code: 438 },
  // HeavyButton 9 on fifth joystick
  { name: "Joystick5Button9", code: 439 },
  // HeavyButton 10 on fifth joystick
  { name: "Joystick5Button10", code: 440 },
  // HeavyButton 11 on fifth joystick
  { name: "Joystick5Button11", code: 441 },
  // HeavyButton 12 on fifth joystick
  { name: "Joystick5Button12", code: 442 },
  // HeavyButton 13 on fifth joystick
  { name: "Joystick5Button13", code: 443 },
  // HeavyButton 14 on fifth joystick
  { name: "Joystick5Button14", code: 444 },
  // HeavyButton 15 on fifth joystick
  { name: "Joystick5Button15", code: 445 },
  // HeavyButton 16 on fifth joystick
  { name: "Joystick5Button16", code: 446 },
  // HeavyButton 17 on fifth joystick
  { name: "Joystick5Button17", code: 447 },
  // HeavyButton 18 on fifth joystick
  { name: "Joystick5Button18", code: 448 },
  // HeavyButton 19 on fifth joystick
  { name: "Joystick5Button19", code: 449 },

  // HeavyButton 0 on sixth joystick
  { name: "Joystick6Button0", code: 450 },
  // HeavyButton 1 on sixth joystick
  { name: "Joystick6Button1", code: 451 },
  // HeavyButton 2 on sixth joystick
  { name: "Joystick6Button2", code: 452 },
  // HeavyButton 3 on sixth joystick
  { name: "Joystick6Button3", code: 453 },
  // HeavyButton 4 on sixth joystick
  { name: "Joystick6Button4", code: 454 },
  // HeavyButton 5 on sixth joystick
  { name: "Joystick6Button5", code: 455 },
  // HeavyButton 6 on sixth joystick
  { name: "Joystick6Button6", code: 456 },
  // HeavyButton 7 on sixth joystick
  { name: "Joystick6Button7", code: 457 },
  // HeavyButton 8 on sixth joystick
  { name: "Joystick6Button8", code: 458 },
  // HeavyButton 9 on sixth joystick
  { name: "Joystick6Button9", code: 459 },
  // HeavyButton 10 on sixth joystick
  { name: "Joystick6Button10", code: 460 },
  // HeavyButton 11 on sixth joystick
  { name: "Joystick6Button11", code: 461 },
  // HeavyButton 12 on sixth joystick
  { name: "Joystick6Button12", code: 462 },
  // HeavyButton 13 on sixth joystick
  { name: "Joystick6Button13", code: 463 },
  // HeavyButton 14 on sixth joystick
  { name: "Joystick6Button14", code: 464 },
  // HeavyButton 15 on sixth joystick
  { name: "Joystick6Button15", code: 465 },
  // HeavyButton 16 on sixth joystick
  { name: "Joystick6Button16", code: 466 },
  // HeavyButton 17 on sixth joystick
  { name: "Joystick6Button17", code: 467 },
  // HeavyButton 18 on sixth joystick
  { name: "Joystick6Button18", code: 468 },
  // HeavyButton 19 on sixth joystick
  { name: "Joystick6Button19", code: 469 },

  // HeavyButton 0 on seventh joystick
  { name: "Joystick7Button0", code: 470 },
  // HeavyButton 1 on seventh joystick
  { name: "Joystick7Button1", code: 471 },
  // HeavyButton 2 on seventh joystick
  { name: "Joystick7Button2", code: 472 },
  // HeavyButton 3 on seventh joystick
  { name: "Joystick7Button3", code: 473 },
  // HeavyButton 4 on seventh joystick
  { name: "Joystick7Button4", code: 474 },
  // HeavyButton 5 on seventh joystick
  { name: "Joystick7Button5", code: 475 },
  // HeavyButton 6 on seventh joystick
  { name: "Joystick7Button6", code: 476 },
  // HeavyButton 7 on seventh joystick
  { name: "Joystick7Button7", code: 477 },
  // HeavyButton 8 on seventh joystick
  { name: "Joystick7Button8", code: 478 },
  // HeavyButton 9 on seventh joystick
  { name: "Joystick7Button9", code: 479 },
  // HeavyButton 10 on seventh joystick
  { name: "Joystick7Button10", code: 480 },
  // HeavyButton 11 on seventh joystick
  { name: "Joystick7Button11", code: 481 },
  // HeavyButton 12 on seventh joystick
  { name: "Joystick7Button12", code: 482 },
  // HeavyButton 13 on seventh joystick
  { name: "Joystick7Button13", code: 483 },
  // HeavyButton 14 on seventh joystick
  { name: "Joystick7Button14", code: 484 },
  // HeavyButton 15 on seventh joystick
  { name: "Joystick7Button15", code: 485 },
  // HeavyButton 16 on seventh joystick
  { name: "Joystick7Button16", code: 486 },
  // HeavyButton 17 on seventh joystick
  { name: "Joystick7Button17", code: 487 },
  // HeavyButton 18 on seventh joystick
  { name: "Joystick7Button18", code: 488 },
  // HeavyButton 19 on seventh joystick
  { name: "Joystick7Button19", code: 489 },

  // HeavyButton 0 on eight joystick
  { name: "Joystick8Button0", code: 490 },
  // HeavyButton 1 on eight joystick
  { name: "Joystick8Button1", code: 491 },
  // HeavyButton 2 on eight joystick
  { name: "Joystick8Button2", code: 492 },
  // HeavyButton 3 on eight joystick
  { name: "Joystick8Button3", code: 493 },
  // HeavyButton 4 on eight joystick
  { name: "Joystick8Button4", code: 494 },
  // HeavyButton 5 on eight joystick
  { name: "Joystick8Button5", code: 495 },
  // HeavyButton 6 on eight joystick
  { name: "Joystick8Button6", code: 496 },
  // HeavyButton 7 on eight joystick
  { name: "Joystick8Button7", code: 497 },
  // HeavyButton 8 on eight joystick
  { name: "Joystick8Button8", code: 498 },
  // HeavyButton 9 on eight joystick
  { name: "Joystick8Button9", code: 499 },
  // HeavyButton 10 on eight joystick
  { name: "Joystick8Button10", code: 500 },
  // HeavyButton 11 on eight joystick
  { name: "Joystick8Button11", code: 501 },
  // HeavyButton 12 on eight joystick
  { name: "Joystick8Button12", code: 502 },
  // HeavyButton 13 on eight joystick
  { name: "Joystick8Button13", code: 503 },
  // HeavyButton 14 on eight joystick
  { name: "Joystick8Button14", code: 504 },
  // HeavyButton 15 on eight joystick
  { name: "Joystick8Button15", code: 505 },
  // HeavyButton 16 on eight joystick
  { name: "Joystick8Button16", code: 506 },
  // HeavyButton 17 on eight joystick
  { name: "Joystick8Button17", code: 507 },
  // HeavyButton 18 on eight joystick
  { name: "Joystick8Button18", code: 508 },
  // HeavyButton 19 on eight joystick
  { name: "Joystick8Button19", code: 509 },
];
```
