import { STREAM_ENDPOINT } from "../constants/endpoint";
import { StreamingController } from "streaming-view-sdk";

export class AppLand {
  /**
   * To get status of a stream by edge node id
   */
  static getStreamStatus = async (edgeNodeId: string): Promise<{ state: string }> => {
    const res = await fetch(STREAM_ENDPOINT + `/api/streaming-games/status/${edgeNodeId}`);
    return res.json();
  };

  /**
   * To terminate a stream
   */
  static terminateStream = async (edgeNodeId: string): Promise<string> => {
    const streamingController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
      edgeNodeId: edgeNodeId,
    });
    const terminate = await streamingController.terminate();
    return terminate.data.status;
  };

  /**
   * To get device info
   */
  static getDeviceInfo = async (): Promise<string> => {
    const streamingController = await StreamingController({ apiEndpoint: STREAM_ENDPOINT });
    const res = await streamingController.getDeviceInfo();
    //do not delete this console log
    console.log("[Rob0] DeviceInfo payload: " + JSON.stringify(res));

    return JSON.stringify(res);
  };

  /**
   * get predicted game experiences
   */
  static getPredictedGameExperiences = async (): Promise<{ appId: number; score: number }[]> => {
    const streamingController = await StreamingController({ apiEndpoint: STREAM_ENDPOINT });
    const res = await streamingController.getPredictedGameExperiences();

    return res?.apps || res;
  };
}
