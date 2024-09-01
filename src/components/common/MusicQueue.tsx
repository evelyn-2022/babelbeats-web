import React, { useState, useEffect, useRef } from 'react';
import { YouTubeVideo } from '../../types';
import MusicItem from './MusicItem';
import { usePlayQueue } from '../../context';
import { fetchPlaylistItems } from '../../services';

const MusicQueue: React.FC<{
  playQueue: YouTubeVideo[];
  maxHeight: string;
}> = ({ playQueue, maxHeight }) => {
  const {
    autoplay,
    currentVideoIndex,
    setCurrentVideoIndex,
    addVideoToBottomOfQueue,
    nextPageToken,
    setNextPageToken,
    playlistId,
  } = usePlayQueue();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentItemRef = useRef<HTMLDivElement | null>(null);

  // Fetch playlist items when scrolling to the bottom
  const handleFetchPlaylistItems = async () => {
    if (!playlistId || isLoading || nextPageToken === null) return;

    setIsLoading(true);

    try {
      const response = await fetchPlaylistItems(playlistId, nextPageToken);
      const { items, nextPageToken: token } = response;

      items.map((item: YouTubeVideo) => addVideoToBottomOfQueue(item));
      setNextPageToken(token || null);
    } catch (error) {
      console.error('Error fetching playlist items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle scroll event to fetch more items
  useEffect(() => {
    const handleScroll = () => {
      const ulElement = document.querySelector('#playlist-ul');
      if (!ulElement) return;

      const { scrollTop, scrollHeight, clientHeight } = ulElement;
      if (scrollHeight - scrollTop === clientHeight && !isLoading) {
        handleFetchPlaylistItems();
      }
    };

    const ulElement = document.querySelector('#playlist-ul');
    if (ulElement) {
      ulElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (ulElement) {
        ulElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [nextPageToken, isLoading]);

  useEffect(() => {
    if (currentItemRef.current) {
      currentItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentVideoIndex, autoplay]);

  return (
    <div className='w-full flex flex-col gap-2'>
      <h2 className='font-bold text-2xl'>Now playing</h2>
      <div
        className={`flex flex-col w-full overflow-y-auto`}
        style={{
          maxHeight: maxHeight,
        }}
        id='playlist-ul'
      >
        {playQueue.map((video, index) => (
          <div
            className='border-b-[1px] last:border-b-0 border-customWhite/20'
            key={index}
            ref={index === currentVideoIndex ? currentItemRef : null} // Set ref to the current item
          >
            <MusicItem
              key={index.toString()}
              data={video}
              type='music'
              nowPlaying={index === currentVideoIndex}
              handleResultClick={() => {
                setCurrentVideoIndex(index);
              }}
              maxTitleLength={80}
            />
          </div>
        ))}
        {isLoading && (
          <div className='text-center text-customWhite/40'>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default MusicQueue;
