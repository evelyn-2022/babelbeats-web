import React, { useState, createContext } from 'react';
import { YouTubeVideo } from '../types';

export interface PlayQueueContextProps {
  playQueue: YouTubeVideo[];
  currentVideoIndex: number;
  addVideoToTopOfQueue: (video: YouTubeVideo) => void;
  addVideoToBottomOfQueue: (video: YouTubeVideo) => void;
  playNext: (video: YouTubeVideo) => void;
  removeVideoFromQueue: (videoId: string) => void;
  setCurrentVideoIndex: (index: number) => void;
  clearQueue: () => void;
  autoplay: boolean;
  setAutoplay: (autoplay: boolean) => void;
}

export const PlayQueueContext = createContext<
  PlayQueueContextProps | undefined
>(undefined);

export const PlayQueueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playQueue, setPlayQueue] = useState<YouTubeVideo[]>([
    {
      id: '0Q7w7gk1JhQ',
      title: 'Nina Simone - Ne Me Quitte Pas',
      channelTitle: 'aaa',
      description: 'aaa',
      thumbnail: 'https://i.ytimg.com/vi/0Q7w7gk1JhQ/default.jpg',
    },
    {
      id: '8AHCfZTRGiI',
      title: 'Johnny Cash - Hurt',
      channelTitle: 'aaa',
      description: 'aaa',
      thumbnail: 'https://i.ytimg.com/vi/8AHCfZTRGiI/default.jpg',
    },
    {
      id: 'uhvrvsiQqbI',
      title: 'Soldier Of Fortune',
      channelTitle: 'aaa',
      description: 'aaa',
      thumbnail: 'https://i.ytimg.com/vi/uhvrvsiQqbI/default.jpg',
    },
  ]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [autoplay, setAutoplay] = useState<boolean>(false);

  const addVideoToTopOfQueue = (video: YouTubeVideo) => {
    setPlayQueue(prevQueue => [video, ...prevQueue]);
    // Adjust the current video index if needed
    if (currentVideoIndex >= 0) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const addVideoToBottomOfQueue = (video: YouTubeVideo) => {
    setPlayQueue(prevQueue => [...prevQueue, video]);
  };

  const playNext = (video: YouTubeVideo) => {
    setPlayQueue(prevQueue => [
      ...prevQueue.slice(0, currentVideoIndex + 1),
      video,
      ...prevQueue.slice(currentVideoIndex + 1),
    ]);
    setCurrentVideoIndex(currentVideoIndex + 1);
  };

  const removeVideoFromQueue = (videoId: string) => {
    setPlayQueue(prevQueue => prevQueue.filter(video => video.id !== videoId));
  };

  const clearQueue = () => {
    setPlayQueue([]);
    setCurrentVideoIndex(0);
  };

  return (
    <PlayQueueContext.Provider
      value={{
        playQueue,
        currentVideoIndex,
        addVideoToTopOfQueue,
        addVideoToBottomOfQueue,
        playNext,
        removeVideoFromQueue,
        setCurrentVideoIndex,
        clearQueue,
        autoplay,
        setAutoplay,
      }}
    >
      {children}
    </PlayQueueContext.Provider>
  );
};
