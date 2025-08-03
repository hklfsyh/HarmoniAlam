class IdleTimer {
  constructor(timeout = 3600000, onTimeout) { // 1 hour = 3600000ms
    this.timeout = timeout;
    this.onTimeout = onTimeout;
    this.timer = null;
    this.events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    this.resetTimer = this.resetTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  startTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.onTimeout();
    }, this.timeout);
  }

  resetTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.startTimer();
  }

  start() {
    this.events.forEach(event => {
      document.addEventListener(event, this.resetTimer, true);
    });
    this.startTimer();
  }

  stop() {
    this.events.forEach(event => {
      document.removeEventListener(event, this.resetTimer, true);
    });
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export default IdleTimer;