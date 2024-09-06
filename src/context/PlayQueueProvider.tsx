import React, { useState, createContext, useEffect } from 'react';
import { YouTubeVideo } from '../types';
import { useAuth } from './useAuth';

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
  showPlayer: boolean;
  setShowPlayer: (showPlayer: boolean) => void;
  playlistId: string;
  setPlaylistId: (playlistId: string) => void;
  nextPageToken: string | null;
  setNextPageToken: (nextPageToken: string | null) => void;
}

export const PlayQueueContext = createContext<
  PlayQueueContextProps | undefined
>(undefined);

const getInitialPlayQueue = (userId: string | undefined): YouTubeVideo[] => {
  if (!userId) return [];
  const savedData = localStorage.getItem('playQueue');
  if (!savedData) return [];
  try {
    const parsedData = JSON.parse(savedData);
    return parsedData[userId]?.queue || [];
  } catch {
    return [];
  }
};

const getInitialCurrentVideoIndex = (userId: string | undefined): number => {
  if (!userId) return 0;
  const savedData = localStorage.getItem('playQueue');
  if (!savedData) return 0;
  try {
    const parsedData = JSON.parse(savedData);
    return parsedData[userId]?.index || 0;
  } catch {
    return 0;
  }
};

export const PlayQueueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { authState } = useAuth();
  const userId = authState.user?.id;

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [playQueue, setPlayQueue] = useState<YouTubeVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [playlistId, setPlaylistId] = useState<string>('');
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  // Load play queue and current video index when userId is available
  useEffect(() => {
    if (userId) {
      // Load the play queue and current index when the user logs in
      setPlayQueue(getInitialPlayQueue(userId));
      setCurrentVideoIndex(getInitialCurrentVideoIndex(userId));
      setIsLoaded(true); // Set loading to true after data is loaded
    } else {
      setIsLoaded(true); // If no user, still set as loaded to render children
    }
  }, [userId]);

  // Save queue to local storage whenever playQueue or currentVideoIndex changes
  useEffect(() => {
    if (isLoaded) {
      saveQueueToLocal();
    }
  }, [playQueue, currentVideoIndex, isLoaded]);

  const saveQueueToLocal = () => {
    if (!userId) return;
    const savedData = localStorage.getItem('playQueue');
    const parsedData = savedData ? JSON.parse(savedData) : {};

    parsedData[userId] = {
      queue: playQueue,
      index: currentVideoIndex,
    };

    localStorage.setItem('playQueue', JSON.stringify(parsedData));
  };

  const addVideoToTopOfQueue = (video: YouTubeVideo) => {
    setPlayQueue(prevQueue => [video, ...prevQueue]);

    if (currentVideoIndex >= 0) {
      setCurrentVideoIndex(prevIndex => prevIndex + 1);
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
    setCurrentVideoIndex(prevIndex => prevIndex + 1);
  };

  const removeVideoFromQueue = (videoId: string) => {
    setPlayQueue(prevQueue => prevQueue.filter(video => video.id !== videoId));
  };

  const clearQueue = () => {
    setPlayQueue([]);
    setCurrentVideoIndex(0);
  };

  // Show loading state or render the provider if loaded
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

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
        showPlayer,
        setShowPlayer,
        playlistId,
        setPlaylistId,
        nextPageToken,
        setNextPageToken,
      }}
    >
      {children}
    </PlayQueueContext.Provider>
  );
};
