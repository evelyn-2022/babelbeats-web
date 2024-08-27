import { useState } from 'react';
import { SearchBar } from '../components';
import { SearchResult, YouTubePlaylist, YouTubeVideo } from '../types';
import { usePlayQueue } from '../context';
import {
  extractParameterFromUrl,
  fetchYouTubeVideoDetails,
  fetchYouTubePlaylistDetails,
} from '../services';

const SearchPage: React.FC = () => {
  const { playNext, setAutoplay, autoplay } = usePlayQueue();
  const [results, setResults] = useState<SearchResult | null>(null);
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);

  const handleSearch = async (url: string): Promise<SearchResult> => {
    setSearchInitiated(true);
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
    return result;
  };

  const handleResultClick = async (
    type: string,
    result: YouTubeVideo | YouTubePlaylist
  ) => {
    if (type === 'music') {
      playNext(result);
    } else if (type === 'playlist') {
      console.log('Add playlist to queue:', result);
    }
    console.log(autoplay);
  };

  return (
    <div className='h-full flex flex-col my-2 items-center gap-2'>
      <h1 className='text-2xl'>Search for a song or playlist</h1>
      <SearchBar
        onSearch={handleSearch}
        setResults={setResults}
        setSearchInitiated={setSearchInitiated}
      />

      {/* Display search results here */}
      {results && results.music && (
        <div
          className='p-2 cursor-pointer hover:bg-blue-500 hover:text-white'
          onClick={() => handleResultClick('music', results.music)}
        >
          <h3>Song</h3>
          {results.music.title}
          {results.music.channelTitle}
          <img src={results.music.thumbnail} alt='thumbnail' />
        </div>
      )}
      {results && results.playlist && (
        <div
          className='p-2 cursor-pointer hover:bg-blue-500 hover:text-white'
          onClick={() => handleResultClick('playlist', results.playlist)}
        >
          <h3>Playlist</h3>
          {results.playlist.title}
        </div>
      )}
      {searchInitiated && !results && <div>No result found</div>}
    </div>
  );
};

export default SearchPage;
