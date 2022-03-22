export interface IRob0CapsuleTrigger {
  event_name: string;
  capsule_mode: number;
}

export interface IRob0ConfigurationCredential {
  access_key_id: string;
  secret_access_key: string;
  session_token: string;
  expire_at: number;
  region: string;
  events_target: string;
  capsules_bucket: string;
  capsules_prefix: string;
  sessions_target: string;
}

export interface IRob0ConfigurationResponse {
  version?: string;
  record_mode: number;
  max_texture_size: number;
  capsule_duration: number;
  frame_rate: number;
  capsule_triggers: Array<IRob0CapsuleTrigger>;
  credentials: Array<IRob0ConfigurationCredential>;
  reason?: string;
}

export interface IRob0PushEventsRequest {
  timestamp: number;
  device_id: string;
  session_id: string;
  event_id: number;
  event_name: string;
  linked_to: number;
  inputs_number: number;
  inputs_duration: number;
  api_key: string;
}

export interface IRob0Event {
  event_id?: number;
  event_name: string;
  linked_to?: number;
  inputs_number?: number;
  inputs_duration?: number;
  timestamp?: number;
}

export interface Rob0GameSession {
  events: Array<IRob0PushEventsRequest>;
  eventsCount: number;
  frames: Array<IRob0Frame>;
  framesCount: number;
  recordingInterval: NodeJS.Timeout | undefined;
  uploadingInterval: NodeJS.Timeout | undefined;
  canvas: HTMLCanvasElement;
  credentials: Array<IRob0ConfigurationCredential>;
  fps: number;
}

export interface IConfigurationRob0 {
  sessionId: string;
  deviceId: string;
  momentId: string;
  username: string;
}
