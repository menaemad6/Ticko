
// Sound effect URLs - using web-based sound libraries
const SOUND_URLS = {
  taskComplete: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  taskCreated: 'https://www.soundjay.com/misc/sounds/success-1.wav',
  taskDeleted: 'https://www.soundjay.com/misc/sounds/button-09.wav',
  tick: 'https://www.soundjay.com/misc/sounds/click-1.wav',
  celebration: 'https://www.soundjay.com/misc/sounds/ta-da.wav'
};

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    // Preload sounds
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      try {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.volume = 0.3; // Set moderate volume
        // Use a simple tick sound as fallback
        audio.src = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSqBzvLZiTgHGGi57OeeUAwPUarm7bNyKAYsks/u24xJCwZUq+Puz2kmBSV+ye/eizYIGGe96+OTTgsKT6ni8MDPLAYrktDw3ItHDAZSq+Puw2kjAyo+n/jzxcM8CwTf4xY9Hfw+pnDsNHTkOYXOTDqwJWyLlNHHQ3HwIyZJ2ewJUXsNW6D1WQk2OQVM3VopTdEZQF8GWZGvKpZEH0FBFLKJVSjUTDkTaGiQgiwP1x44Q32RkwYlcJjO54FJPl1qY4L7hh8AJ3XTYhYG9KBPQxH7gDfL7xIXAHyMNX4fBxBzn0V/cKZE+wHO/w8+5Y5L3EFhTBdX4Owr3kQPd+s4d3q1HQTdGj9G+jBcO8j9JjANfWRrbnT0KdJH8h6aYqECQEm7hMOH/hLlzKFJ/xVrPXc6q8BfNHUjLmnB3vHPGK1HfW0g0sCfBECm8YeBrfNS3DQKFGKoqkEaS7xJKQLHHLZFMj/FWs9dzqrwVzR1Iy5qwd7xzxitR31tINLAnwRApvGHga3zUtw0ChRiqKpBGku8SS0Cxxy2RTI/xVrPXc6q8Fc0dSMuasHe8c8YrUd9bSDSwJ8EQKbxh4Gt81LcNAoUYqiqQRpLvEktAscctk`;
        this.sounds.set(key, audio);
      } catch (error) {
        console.warn(`Failed to load sound: ${key}`, error);
      }
    });
  }

  play(soundKey: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundKey);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.warn(`Failed to play sound: ${soundKey}`, error);
      });
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();
