import { useContext } from 'react';
import { PlayQueueContext, PlayQueueContextProps } from './PlayQueueProvider';

export const usePlayQueue = (): PlayQueueContextProps => {
  const context = useContext(PlayQueueContext);
  if (!context) {
    throw new Error('usePlayQueue must be used within a PlayQueueProvider');
  }
  return context;
};
