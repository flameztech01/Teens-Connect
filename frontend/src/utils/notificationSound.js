// utils/notificationSound.js
class NotificationSound {
  constructor() {
    this.audio = null;
    this.isEnabled = true;
    this.loadPreferences();
  }

  async loadPreferences() {
    try {
      const preferences = localStorage.getItem('notificationPreferences');
      if (preferences) {
        const parsed = JSON.parse(preferences);
        this.isEnabled = parsed.soundEnabled !== false;
      }
    } catch (error) {
      console.error('Error loading sound preferences:', error);
    }
  }

  play() {
    if (!this.isEnabled) return;
    
    try {
      // Create audio context for better browser support
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create oscillator for "ping" sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 880; // A5 note
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch (error) {
      // Fallback to simple beep if Web Audio API not supported
      console.log('Web Audio API not supported, using fallback');
      this.fallbackBeep();
    }
  }

  fallbackBeep() {
    try {
      // Simple beep using Audio element with data URI
      const beep = new Audio('data:audio/wav;base64,U3RlYWx0aCBzb3VuZA==');
      beep.play().catch(e => console.log('Could not play beep:', e));
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    localStorage.setItem('notificationSoundEnabled', enabled);
  }
}

export const notificationSound = new NotificationSound();