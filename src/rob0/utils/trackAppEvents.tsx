import { EventNames } from "../constants/events";
import { Rob0 } from "../models/rob0";

export const trackAppEvents = () => {
  document.addEventListener(
    "visibilitychange",
    function () {
      if (document.visibilityState === "visible") {
        Rob0.addAndUploadEvent({ event_name: EventNames.APP_RESUME });
      } else if (document.visibilityState === "hidden") {
        Rob0.addAndUploadEvent({ event_name: EventNames.APP_PAUSE });
      }
    },
    true
  );
};
