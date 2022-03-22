import axios from "axios";
import * as htmlToImage from "html-to-image";
import { map, min } from "lodash-es";
import sha1 from "sha1";
import { v4 as uuidv4 } from "uuid";
import { EventNames } from "../constants/events";
import {
  EXPIRED_TIME,
  FRAME_QUALITY,
  LATEST_EVENT_TIME,
  NodeTypes,
  PLATFORM,
  R0B0_KEY,
  ROB0_API,
  ROB0_CONFIGURATION_PARAMS,
  ROB0_CREDENTIALS,
  ROB0_EVENTS_OBJECT,
  ROB0_EVENT_ID,
  ROB0_FPS,
  ROB0_IS_CALLED_CHECK_EXPIRED_FUNC,
  ROB0_IS_CALLED_CONFIGURATION_FUNC,
  ROB0_STREAMING_EVENT_ID,
  ROB0_UPLOAD_INTERVAL_MS,
} from "../constants/rob0";
import { IMouse, IRob0Frame, ITouch } from "../interfaces/capsule";
import { IConfigurationRob0, IRob0ConfigurationCredential, IRob0Event } from "../interfaces/rob0";
import { buildCapsule } from "../utils/buildCapsule";
import { Rob0Utils } from "../utils/rob0";
import { formatDataURL, getImageData, onMouseChanged, onTouchChanged, videoDimensions } from "../utils/video";

const CONFIGURATION_VERSION = "2020-12-14";
const configAxios = axios.create({
  headers: {
    "x-api-key": R0B0_KEY,
  },
});

const awsAxios = axios.create();

export class Rob0 {
  static UPLOAD_INTERVAL_MS = ROB0_UPLOAD_INTERVAL_MS;
  static FPS = ROB0_FPS;
  static URL = ROB0_API;
  static event: IRob0Event | null = null;
  static credentials: any = null;
  static eventsCount: number = 0;
  static events: Array<any> = [];
  static uploadingInterval: NodeJS.Timeout | undefined;
  static recordingInterval: NodeJS.Timeout | undefined;
  static fps = 1;
  static canvas = document.createElement("canvas");
  static mouseEvent: IMouse | null = null;
  static touchEvents: Array<ITouch> | null = null;
  static keyCodes: Array<number> | null = null;
  static frames: Array<any> = [];
  static framesCount: number = 0;
  static configurationParams: IConfigurationRob0 | null = null;
  static event_start: number | null = 0;
  static latestEventTime: string = "";
  static rob0EventsObject: any = {};

  //For capture only
  static canvasCapture = document.createElement("canvas");

  static captureScreen = (node: HTMLVideoElement) => {
    const ctx = Rob0.canvasCapture.getContext("2d");
    const { height, width } = videoDimensions(node);
    Rob0.canvasCapture.width = width;
    Rob0.canvasCapture.height = height;
    if (ctx) {
      // ctx.drawImage(node, 0, 0, width, height);
      ctx.drawImage(node, 0, 0, width, height);
      return Rob0.canvasCapture.toDataURL();
    }
  };

  static addAndUploadEvent = async (event: IRob0Event) => {
    const { credentials } = Rob0Utils.getRob0StorageConfiguration();
    if (!credentials?.length) return;

    const id = Rob0Utils.getCurrentEventId(ROB0_EVENT_ID);
    const event_1 = Rob0.mapEventWithLinkedId(event, id);

    Rob0.addRob0Event({
      ...event_1,
      event_id: id,
      linked_to: event_1.linked_to || 0,
    });

    Rob0Utils.setLocalStorageValue(ROB0_EVENT_ID, id);
    await Rob0.upload();
  };

  static mapEventWithLinkedId = (event: IRob0Event, event_id: number) => {
    const storageEvents = Rob0Utils.getLocalStorageValue(ROB0_EVENTS_OBJECT);
    let rob0EventObjects: any = {};
    if (storageEvents) {
      rob0EventObjects = storageEvents;
    }

    const type = event.event_name;
    const endEventName = Rob0Utils.getEndEventName(type);
    const isStartEvent = Rob0Utils.isStartEvent(type);
    const isEndEvent = Rob0Utils.isEndEvent(type);
    if (isStartEvent && endEventName) {
      rob0EventObjects[endEventName] = event_id;
    }
    if (isEndEvent && endEventName) {
      event.linked_to = rob0EventObjects[endEventName];
      delete rob0EventObjects[endEventName];
    }
    if (rob0EventObjects) {
      Rob0Utils.setLocalStorageValue(ROB0_EVENTS_OBJECT, JSON.stringify(rob0EventObjects));
    }

    return event;
  };

  static addRob0Event = (event: IRob0Event) => {
    const rob0Event = {
      ...event,
      timestamp: new Date().getTime() / 1000,
      inputs_duration: 0,
      inputs_number: 1,
    };
    Rob0.event = rob0Event;
    Rob0.events.push(rob0Event);
    Rob0.latestEventTime = rob0Event.timestamp.toString();
  };

  static configuration = async () => {
    try {
      await Rob0Utils.removeOldLocalStorageEventValue();
      const { credentials } = Rob0Utils.getRob0StorageConfiguration();
      if (credentials?.length) return (Rob0.credentials = credentials);
      if (!Rob0.configurationParams || !process.env.REACT_APP_ROB0_KEY) return;

      const { sessionId, momentId, deviceId, username } = Rob0.configurationParams;
      const timeNow = new Date().getTime() / 1000;
      const payload = {
        version: CONFIGURATION_VERSION,
        timestamp: timeNow,
        session_id: sessionId,
        device_id: sha1(deviceId),
        model: username,
        platform: PLATFORM,
        app_id: momentId,
        app_version: process.env.REACT_APP_BUILD,
      };
      const response: any = await configAxios.post(`${Rob0.URL}/v1/configurations`, payload);
      if (response.status === 200) {
        Rob0.credentials = response.data?.credentials;
        Rob0Utils.setLocalStorageValue(ROB0_CREDENTIALS, JSON.stringify(Rob0.credentials));
      } else {
        throw response;
      }
    } catch (e) {
      console.error(`Fail to configuration rob0`);
    }
  };

  static checkConfigurationExpired = async () => {
    if (Rob0.isConfigurationExpired() && Rob0.configurationParams) {
      console.warn("[Rob0] configuration expired");
      let configParams = Rob0.configurationParams;
      await Rob0.removeRob0StorageAndConfiguration();

      configParams.sessionId = uuidv4();
      Rob0.configurationParams = configParams;
      console.warn("[Rob0] re-config expired session");
      await Rob0.configuration();
    }
  };

  static syncConfigurationParams = async (params: IConfigurationRob0) => {
    Rob0Utils.setLocalStorageValue(ROB0_CONFIGURATION_PARAMS, JSON.stringify(params));
    Rob0.configurationParams = params;
  };

  static getConfigurationParams = () => {
    const params = Rob0Utils.getLocalStorageValue(ROB0_CONFIGURATION_PARAMS);
    return params || null;
  };

  static isConfigurationExpired = () => {
    const { lastEventTime, credentials } = Rob0Utils.getRob0StorageConfiguration();
    const expired_time = min(map(credentials, "expire_at"));
    const timeNow = new Date().getTime() / 1000;
    return (
      expired_time - timeNow <= 0 ||
      (lastEventTime && Rob0.configurationParams && timeNow - parseInt(lastEventTime) >= EXPIRED_TIME)
    );
  };

  static removeRob0StorageAndConfiguration = async () => {
    Rob0.stopRecording();

    await Promise.all([
      Rob0Utils.removeLocalStorageValue(ROB0_CREDENTIALS),
      Rob0Utils.removeLocalStorageValue(LATEST_EVENT_TIME),
      Rob0Utils.removeLocalStorageValue(ROB0_CONFIGURATION_PARAMS),
      Rob0Utils.removeLocalStorageValue(ROB0_EVENT_ID),
      Rob0Utils.removeLocalStorageValue(ROB0_EVENTS_OBJECT),
      Rob0Utils.removeLocalStorageValue(ROB0_STREAMING_EVENT_ID),
      Rob0Utils.removeLocalStorageValue(ROB0_IS_CALLED_CONFIGURATION_FUNC),
      Rob0Utils.removeLocalStorageValue(ROB0_IS_CALLED_CHECK_EXPIRED_FUNC),
    ]);

    Rob0.credentials = null;
    Rob0.events = [];
    Rob0.event = null;
    Rob0.eventsCount = 0;
    Rob0.event_start = 0;
    Rob0.fps = 1;
    Rob0.mouseEvent = null;
    Rob0.touchEvents = null;
    Rob0.keyCodes = null;
    Rob0.frames = [];
    Rob0.framesCount = 0;
    Rob0.latestEventTime = "";
    Rob0.configurationParams = null;
  };

  static startRecording = (node: HTMLElement) => {
    if (!node || !Rob0.credentials?.length) return;
    // Default FPS for screen recording
    Rob0.fps = 1;
    if (node.nodeName === NodeTypes.VIDEO) {
      const video = node as HTMLVideoElement;
      const { height, width } = videoDimensions(video);
      Rob0.canvas.width = width;
      Rob0.canvas.height = height;
      Rob0.fps = Rob0.FPS;
    } else if (node.nodeName === NodeTypes.CANVAS) {
      Rob0.canvas = node as HTMLCanvasElement;
      Rob0.fps = Rob0.FPS;
    }

    Rob0.addFrameEventListeners(node);

    if (Rob0.recordingInterval) {
      clearInterval(Rob0.recordingInterval);
    }
    Rob0.recordingInterval = setInterval(() => Rob0.loop(node), 1000 / Rob0.fps);
    console.info("[Rob0] Start recording");

    Rob0.startUploading();
  };

  static stopRecording = () => {
    setTimeout(() => {
      if (Rob0.recordingInterval) {
        clearInterval(Rob0.recordingInterval);
      }
    }, 1000 / Rob0.fps);

    console.info("[Rob0] Stop recording");
  };

  static startUploading = () => {
    if (Rob0.uploadingInterval) {
      clearInterval(Rob0.uploadingInterval);
    }

    Rob0.uploadingInterval = setInterval(Rob0.upload, Rob0.UPLOAD_INTERVAL_MS);
    console.info("[Rob0] Start uploading");
  };

  static addFrameEventListeners = (node: HTMLElement) => {
    node.addEventListener("mousemove", (event: any) => {
      const coordinates = onMouseChanged(node, event);
      Rob0.getMouseEvent(coordinates);
    });

    node.addEventListener("touchstart", (event: any) => {
      const coordinates = onTouchChanged(node, event?.touches[0]);
      Rob0.getTouchEvents(coordinates ? [coordinates] : null);
    });

    node.addEventListener("touchmove", (event: any) => {
      const coordinates = onTouchChanged(node, event?.touches[0]);
      Rob0.getTouchEvents(coordinates ? [coordinates] : null);
    });

    node.addEventListener("touchend", (event: any) => {
      const coordinates = onTouchChanged(node, event?.touches[0]);
      Rob0.getTouchEvents(coordinates ? [coordinates] : null);
    });

    node.addEventListener("keydown", (event: any) => {
      Rob0.getKeyCodes([event.keyCode]);
    });
  };

  static getMouseEvent = (mouse: IMouse | null) => {
    Rob0.mouseEvent = mouse;
  };

  static getTouchEvents = (touches: Array<ITouch> | null) => {
    Rob0.touchEvents = touches;
  };

  static getKeyCodes = (keyCodes: Array<number> | null) => {
    Rob0.keyCodes = keyCodes;
  };

  static loop = async (node: HTMLElement): Promise<void> => {
    const ctx = Rob0.canvas.getContext("2d");

    if (!ctx) return;

    if (node.nodeName === NodeTypes.VIDEO) {
      const video = node as HTMLVideoElement;
      if (video.paused || video.ended || video.readyState <= 2) {
        return;
      }

      ctx.drawImage(video, 0, 0, Rob0.canvas.width, Rob0.canvas.height);
    } else if (node.nodeName === NodeTypes.CANVAS) {
      Rob0.canvas = node as HTMLCanvasElement;
    }

    let buffer = null;

    if (node.nodeName === NodeTypes.VIDEO || node.nodeName === NodeTypes.CANVAS) {
      buffer = getImageData(Rob0.canvas);
    } else {
      buffer = await Rob0.getBufferFromScreenNode(node);
    }

    Rob0.createRob0Frames(buffer);
  };

  static createRob0Frames = (imageData: Uint8Array) => {
    if (!Rob0.frames.length) {
      const event_id = Rob0Utils.getCurrentEventId(ROB0_EVENT_ID);
      Rob0.addRob0Event({
        event_id,
        event_name: EventNames.STREAMING,
        inputs_duration: 0,
        inputs_number: 1,
        timestamp: new Date().getTime() / 1000,
        linked_to: 0,
      });
      Rob0Utils.setLocalStorageValue(ROB0_EVENT_ID, event_id);
      Rob0Utils.setLocalStorageValue(ROB0_STREAMING_EVENT_ID, event_id);
    }
    const frame = {
      imageData,
      mouse: Rob0.mouseEvent,
      touches: Rob0.touchEvents,
      keyCodes: Rob0.keyCodes,
    };

    Rob0.frames.push(frame);
    Rob0.framesCount++;
  };

  static getBufferFromScreenNode = async (node: HTMLElement) => {
    const dataURL = await htmlToImage.toJpeg(node, {
      quality: FRAME_QUALITY,
      pixelRatio: 1,
      height: window.innerHeight,
      backgroundColor: "#FFF",
    });

    Rob0.canvas.height = window.innerHeight;
    Rob0.canvas.width = window.innerWidth;

    return Buffer.from(formatDataURL(dataURL), "base64");
  };

  static upload = async () => {
    const isCheckedExpired = Rob0Utils.getLocalStorageValue(ROB0_IS_CALLED_CHECK_EXPIRED_FUNC);
    if (!isCheckedExpired) {
      Rob0Utils.setLocalStorageValue(ROB0_IS_CALLED_CHECK_EXPIRED_FUNC, "true");
      await Rob0.checkConfigurationExpired();
      Rob0Utils.setLocalStorageValue(ROB0_IS_CALLED_CHECK_EXPIRED_FUNC, "false");
    }

    if (!Rob0.configurationParams || !Rob0.credentials?.length) return;
    await Promise.all([Rob0.uploadEvents(), Rob0.uploadFrames()]);
  };

  static uploadEvents = async (): Promise<void> => {
    const { sessionId, deviceId }: any = Rob0.configurationParams;
    if (Rob0.events.length) {
      const events = map(Array(Rob0.events.length), () => ({
        Data: btoa(
          JSON.stringify({
            ...Rob0.events.shift(),
            session_id: sessionId,
            device_id: sha1(deviceId),
            api_key: R0B0_KEY,
          }) + "\n"
        ),
      }));
      const fEvents = events.filter((e) => e !== null);
      await Promise.all(Rob0.credentials.map((c: IRob0ConfigurationCredential) => Rob0.uploadEachEvents(c, fEvents)));
    }
  };

  static uploadFrames = async () => {
    if (Rob0.frames.length) {
      const frames: Array<IRob0Frame | undefined> = map(Array(Rob0.frames.length), () => Rob0.frames.shift());
      await Promise.all(
        Rob0.credentials.map(async (c: IRob0ConfigurationCredential) => {
          const capsuleBuffer = Rob0.getCapsuleBuffer(frames);
          await Rob0.uploadCapsule(c, capsuleBuffer, frames);
        })
      );
      console.info(`[Rob0] ${frames.length} frames uploaded`);
    }
  };

  static getCapsuleBuffer = (frames: Array<IRob0Frame | undefined>) => {
    const capsuleFrames: any = frames.filter((o) => o !== undefined);
    return buildCapsule({
      capsuleFrames,
      screenHeight: Rob0.canvas.height,
      screenWidth: Rob0.canvas.width,
      fps: Rob0.fps,
    });
  };

  static uploadCapsule = async (
    configuration: IRob0ConfigurationCredential,
    capsuleBuffer: Uint8Array,
    frames: Array<IRob0Frame | undefined>
  ) => {
    try {
      const event_id = Rob0Utils.getLocalStorageValue(ROB0_STREAMING_EVENT_ID);
      if (!event_id) return;

      const host = `${configuration.capsules_bucket}.s3.amazonaws.com`;
      const path = `/${configuration.capsules_prefix}/${new Date().getTime() / 1000}_${event_id}_${Rob0.fps}_${
        frames.length
      }`;
      const customHeaders = {
        "X-Amz-Security-Token": configuration.session_token,
      };
      const opts: any = {
        host,
        path,
        service: "s3",
        method: "PUT",
        region: configuration.region,
        headers: {
          ...customHeaders,
        },
        body: capsuleBuffer,
      };
      Rob0Utils.getSignature(opts, configuration);
      delete opts?.headers?.Host;
      delete opts?.headers["Content-Length"];
      await awsAxios.put(`https://${host}${path}`, capsuleBuffer, {
        headers: { ...opts.headers },
      });
    } catch (e) {
      console.error(`[Rob0] frames upload failed`);
    }
  };

  static uploadEachEvents = async (configuration: IRob0ConfigurationCredential, events: any) => {
    if (!Rob0.credentials) return;
    try {
      const payload = {
        DeliveryStreamName: configuration?.events_target?.split(":")[1],
        Records: events,
      };
      const host = `firehose.${configuration.region}.amazonaws.com`;
      const customHeaders = {
        "X-Amz-Target": "Firehose_20150804.PutRecordBatch",
        "X-Amz-Security-Token": configuration.session_token,
        "Content-Type": "application/x-amz-json-1.1",
      };
      const opts: any = {
        host,
        service: "firehose",
        region: configuration.region,
        headers: {
          ...customHeaders,
        },
        body: JSON.stringify(payload),
      };
      Rob0Utils.getSignature(opts, configuration);
      delete opts?.headers?.Host;
      delete opts?.headers["Content-Length"];
      await awsAxios.post(`https://${host}`, payload, {
        headers: { ...opts.headers },
      });

      Rob0Utils.setLocalStorageValue(LATEST_EVENT_TIME, Rob0.latestEventTime);
    } catch (e) {
      console.warn(`[Rob0] ${events.length} events upload failed`);
    }
  };
}
