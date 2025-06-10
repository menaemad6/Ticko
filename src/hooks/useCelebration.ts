
import { useState, useCallback } from 'react';

type CelebrationType = 'task-complete' | 'milestone' | 'achievement' | 'task-created' | 'task-deleted';

export function useCelebration() {
  const [celebration, setCelebration] = useState<{
    show: boolean;
    type: CelebrationType;
  }>({ show: false, type: 'task-complete' });

  const celebrate = useCallback((type: CelebrationType) => {
    // Show celebration animation for certain types
    if (type === 'task-complete' || type === 'milestone' || type === 'achievement') {
      setCelebration({ show: true, type });
    }
  }, []);

  const hideCelebration = useCallback(() => {
    setCelebration(prev => ({ ...prev, show: false }));
  }, []);

  return {
    celebration,
    celebrate,
    hideCelebration,
  };
}
