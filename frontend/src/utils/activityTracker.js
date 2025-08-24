import { apiService } from '../services/api.js';

class ActivityTracker {
  constructor() {
    this.inactivityTimer = null;
    this.nudgeDelay = 60000; // 1 minute
    this.onInactivityCallback = null;
    this.isTracking = false;
  }

  startTracking(onInactivity) {
    if (this.isTracking) return;
    
    this.onInactivityCallback = onInactivity;
    this.isTracking = true;
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.handleActivity();
      });
    });
    
    this.resetTimer();
  }

  stopTracking() {
    this.isTracking = false;
    this.clearTimer();
    this.onInactivityCallback = null;
  }

  handleActivity() {
    this.updateActivityOnServer();
    this.resetTimer();
  }

  resetTimer() {
    this.clearTimer();
    this.inactivityTimer = setTimeout(() => {
      if (this.onInactivityCallback) {
        this.onInactivityCallback();
      }
    }, this.nudgeDelay);
  }

  clearTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  async updateActivityOnServer() {
    try {
      await apiService.updateActivity();
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  }

  setNudgeDelay(delay) {
    this.nudgeDelay = delay;
  }
}

export const activityTracker = new ActivityTracker();
