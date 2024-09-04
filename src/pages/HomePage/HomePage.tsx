import { useState, useRef } from 'react';
import { SearchBar, MusicCard } from '../../components';
import { SearchResult, YouTubePlaylist, YouTubeVideo } from '../../types';
import { usePlayQueue, useError } from '../../context';
import {
  extractParameterFromUrl,
  fetchYouTubeVideoDetails,
  fetchYouTubePlaylistDetails,
  fetchPlaylistItems,
} from '../../services';

const HomePage: React.FC = () => {
  const {
    playQueue,
    currentVideoIndex,
    playNext,
    setAutoplay,
    setShowPlayer,
    addVideoToBottomOfQueue,
    clearQueue,
    setPlaylistId,
    setNextPageToken,
  } = usePlayQueue();
  const { addError } = useError();
  const [results, setResults] = useState<SearchResult | null>(null);
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClearInput = () => {
    setQuery('');
    setResults(null);
    setSearchInitiated(false);

    // Move cursor back to input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = async (url: string): Promise<SearchResult> => {
    setSearchInitiated(true);
    setIsLoading(true);
    const videoId = extractParameterFromUrl(url, 'v');
    const playlistId = extractParameterFromUrl(url, 'list');
    setAutoplay(true);

    const result: SearchResult = {};

    if (videoId) {
      const videoDetails = await fetchYouTubeVideoDetails(videoId);
      if (videoDetails) {
        result.music = videoDetails;
      }
    }

    if (playlistId) {
      const playlistDetails = await fetchYouTubePlaylistDetails(playlistId);
      if (playlistDetails) {
        result.playlist = playlistDetails;
      }
    }

    setResults(result);
    setIsLoading(false);
    return result;
  };

  const handleResultClick = async (
    type: string,
    result: YouTubeVideo | YouTubePlaylist
  ) => {
    if (type === 'song') {
      if (result.id === playQueue[currentVideoIndex]?.id) {
        setShowPlayer(true);
      } else if (playQueue.length === 0) {
        setAutoplay(true);
        addVideoToBottomOfQueue(result);
      } else {
        playNext(result);
      }
    } else if (type === 'playlist') {
      try {
        clearQueue();
        setPlaylistId(result.id);
        const { items, nextPageToken: newNextPageToken } =
          await fetchPlaylistItems(result.id);

        setNextPageToken(newNextPageToken);

        items.forEach(video => {
          addVideoToBottomOfQueue(video);
        });
      } catch (error) {
        addError({
          message: 'Error fetching playlist contents, please try again later',
          displayType: 'toast',
          category: 'general',
        });
      }
    }

    handleClearInput();
  };

  return (
    <div className='h-full flex flex-col my-2 items-center gap-10'>
      <div
        className={`flex flex-col gap-8 w-full max-w-xl items-center ${
          results ? 'mt-10' : 'mt-56'
        } transition-all duration-300`}
      >
        <h1 className='text-3xl font-bold'>What's on your playlist today?</h1>
        <SearchBar
          query={query}
          setQuery={setQuery}
          inputRef={inputRef}
          handleClearInput={handleClearInput}
          onSearch={handleSearch}
          setResults={setResults}
          setSearchInitiated={setSearchInitiated}
        />
      </div>

      {/* Display search results */}
      {results && results.music && (
        <MusicCard
          data={results.music}
          type='song'
          handleResultClick={handleResultClick}
        />
      )}

      {results && results.playlist && (
        <MusicCard
          data={results.playlist}
          type='playlist'
          handleResultClick={handleResultClick}
        />
      )}
      {isLoading && <div>Loading...</div>}
      {searchInitiated && !isLoading && !results && <div>No result found</div>}
    </div>
  );
};

export default HomePage;
