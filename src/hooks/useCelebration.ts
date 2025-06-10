
import { useState, useCallback } from 'react';
import { soundManager } from '@/utils/soundEffects';

type CelebrationType = 'task-complete' | 'milestone' | 'achievement' | 'task-created' | 'task-deleted';

export function useCelebration() {
  const [celebration, setCelebration] = useState<{
    show: boolean;
    type: CelebrationType;
  }>({ show: false, type: 'task-complete' });

  const celebrate = useCallback((type: CelebrationType) => {
    // Play sound effect
    switch (type) {
      case 'task-complete':
        soundManager.play('taskComplete');
        break;
      case 'milestone':
      case 'achievement':
        soundManager.play('celebration');
        break;
      case 'task-created':
        soundManager.play('taskCreated');
        break;
      case 'task-deleted':
        soundManager.play('taskDeleted');
        break;
    }

    // Show celebration animation for certain types
    if (type === 'task-complete' || type === 'milestone' || type === 'achievement') {
      setCelebration({ show: true, type });
    }
  }, []);

  const hideCelebration = useCallback(() => {
    setCelebration(prev => ({ ...prev, show: false }));
  }, []);

  const playTickSound = useCallback(() => {
    soundManager.play('tick');
  }, []);

  const toggleSound = useCallback(() => {
    return soundManager.toggle();
  }, []);

  const isSoundEnabled = useCallback(() => {
    return soundManager.isEnabled();
  }, []);

  return {
    celebration,
    celebrate,
    hideCelebration,
    playTickSound,
    toggleSound,
    isSoundEnabled,
  };
}
