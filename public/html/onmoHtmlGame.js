class OnmoHtmlGame extends EventEmitter {
  sendEvent(name, data = {}) {
    this.emitEvent(name, [data]);
  }

  init(callbacks) {
    this.callbacks = callbacks;
  }

  soundOn() {
    this.callbacks.soundOn && this.callbacks.soundOn();
  }

  soundOff() {
    this.callbacks.soundOff && this.callbacks.soundOff();
  }

  unload() {
    this.callbacks.unload && this.callbacks.unload();
  }

  seed() {
    this.callbacks.seed && this.callbacks.seed();
  }

  pause() {
    this.callbacks.pause && this.callbacks.pause();
  }

  resume() {
    this.callbacks.resume && this.callbacks.resume();
  }

  momentData() {
    this.callbacks.momentData && this.callbacks.momentData();
  }
}

OnmoHtmlGame.EVENTS = {
  DATA: "DATA",
  LOADING: "LOADING",
  LOADED: "LOADED",
  UNLOADED: "UNLOADED",
  END_GAME: "END_GAME",
  DOM: "DOM",
};
