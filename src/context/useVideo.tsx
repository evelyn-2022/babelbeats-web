import { useContext } from 'react';
import { VideoContext, VideoContextProps } from './VideoProvider';

export const useVideo = (): VideoContextProps => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
