import React, { useState, createContext } from 'react';

export interface VideoContextProps {
  currentVideoId: string;
  setCurrentVideoId: (videoId: string) => void;
}

export const VideoContext = createContext<VideoContextProps | undefined>(
  undefined
);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentVideoId, setCurrentVideoId] = useState<string>('0Q7w7gk1JhQ'); // Default video ID

  return (
    <VideoContext.Provider value={{ currentVideoId, setCurrentVideoId }}>
      {children}
    </VideoContext.Provider>
  );
};
