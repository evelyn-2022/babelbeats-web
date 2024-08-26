import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

interface PlaylistItem {
  title: string;
  videoId: string;
  thumbnail: string;
}

const YouTubePlaylistFetcher: React.FC<{ playlistId: string }> = ({
  playlistId,
}) => {
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(false);
  const apiKey = config.GOOGLE_API_KEY;

  const fetchPlaylistItems = async () => {
    if (!playlistId || loading || nextPageToken === null) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems`,
        {
          params: {
            part: 'snippet',
            playlistId: playlistId,
            maxResults: 50,
            pageToken: nextPageToken,
            key: apiKey,
          },
        }
      );

      const { items: fetchedItems, nextPageToken: token } = response.data;

      const mappedItems = fetchedItems.map((item: any) => ({
        title: item.snippet.title,
        videoId: item.snippet.resourceId.videoId,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));

      setPlaylistItems(prevItems => [...prevItems, ...mappedItems]);
      setNextPageToken(token || null);
    } catch (error) {
      console.error('Error fetching playlist items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistItems();
  }, [playlistId]);

  useEffect(() => {
    const handleScroll = () => {
      const ulElement = document.querySelector('#playlist-ul');
      if (!ulElement) return;

      const { scrollTop, scrollHeight, clientHeight } = ulElement;

      if (scrollHeight - scrollTop === clientHeight && !loading) {
        fetchPlaylistItems();
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
  }, [nextPageToken, loading]);

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>Playing next</h1>
      <ul className='max-h-64 overflow-y-auto'>
        {playlistItems.map(item => (
          <li
            key={item.videoId}
            className='flex items-center py-3 border-b border-customWhite/20 last:border-b-0'
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className='w-15 h-11 mr-4 object-cover'
            />
            <p className='text-sm font-medium'>{item.title}</p>
          </li>
        ))}
        {loading && (
          <li className='text-center text-sm font-medium text-gray-500'>
            Loading...
          </li>
        )}
      </ul>
    </div>
  );
};

export default YouTubePlaylistFetcher;
