import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaPlay } from 'react-icons/fa';
import { SearchBar } from '../components';
import { SearchResult, YouTubePlaylist, YouTubeVideo } from '../types';
import { usePlayQueue } from '../context';
import {
  extractParameterFromUrl,
  fetchYouTubeVideoDetails,
  fetchYouTubePlaylistDetails,
} from '../services';

const SearchPage: React.FC = () => {
  const { playQueue, currentVideoIndex, playNext, setAutoplay, setShowPlayer } =
    usePlayQueue();
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
      if (result.id === playQueue[currentVideoIndex].id) {
        setShowPlayer(true);
        return;
      }

      playNext(result);
    } else if (type === 'playlist') {
      console.log('Add playlist to queue:', result);
    }
    setResults(null);
    setSearchInitiated(false);
  };

  return (
    <div className='h-full flex flex-col my-2 items-center gap-12'>
      <div className='flex flex-col gap-4 w-full max-w-md items-center'>
        <h1 className='text-2xl font-bold'>Search for a song or playlist</h1>
        <SearchBar
          onSearch={handleSearch}
          setResults={setResults}
          setSearchInitiated={setSearchInitiated}
        />
      </div>

      {/* Display search results here */}
      {results && results.music && (
        <div className='w-full max-w-md cursor-pointer flex flex-col gap-4'>
          <h3 className='text-xl font-fold'>Song</h3>
          <div className='flex flex-row justify-between items-center group'>
            <div className='flex flex-row gap-4 items-center'>
              <div className='w-16 h-16 overflow-hidden cursor-pointer relative'>
                <img
                  src={results.music.thumbnail}
                  alt='thumbnail'
                  className='w-full h-[calc(100%+8px)] object-cover object-center -mt-2.5'
                />
                <div
                  className='absolute top-0 left-0 hidden group-hover:flex bg-customBlack/80 w-full h-full items-center justify-center'
                  onClick={() => handleResultClick('music', results.music!)}
                >
                  <FaPlay className='text-2xl text-customWhite/90' />
                </div>
              </div>

              <div className='flex flex-col gap-1'>
                <span className='font-bold text-nowrap'>
                  {results.music.title.length > 36
                    ? results.music.title.slice(0, 36) + '...'
                    : results.music.title}
                </span>
                <span>{results.music.channelTitle.split('-')[0].trim()}</span>
              </div>
            </div>
            <BsThreeDotsVertical className='text-2xl text-customWhite/40 hover:text-customWhite/80 transition-all duration-300' />
          </div>
        </div>
      )}
      {results && results.playlist && (
        <div className='w-full max-w-md cursor-pointer flex flex-col gap-4'>
          <h3 className='text-xl font-fold'>Playlist</h3>
          <div className='flex flex-row justify-between items-center group'>
            <div className='flex flex-row gap-4 items-center'>
              <div className='w-16 h-16 overflow-hidden cursor-pointer relative'>
                <img
                  src={results.playlist.thumbnail}
                  alt='thumbnail'
                  className='w-full h-[calc(100%+8px)] object-cover object-center -mt-2.5'
                />
                <div
                  className='absolute top-0 left-0 hidden group-hover:flex bg-customBlack/80 w-full h-full items-center justify-center'
                  onClick={() =>
                    handleResultClick('playlist', results.playlist!)
                  }
                >
                  <FaPlay className='text-2xl text-customWhite/90' />
                </div>
              </div>

              <div className='flex flex-col gap-1 py-1'>
                <span className='font-bold text-nowrap'>
                  {results.playlist.title.length > 36
                    ? results.playlist.title.slice(0, 36) + '...'
                    : results.playlist.title}
                </span>
                <span>{results.playlist.channelTitle}</span>
              </div>
            </div>
            <BsThreeDotsVertical className='text-2xl text-customWhite/40 hover:text-customWhite/80 transition-all duration-300' />
          </div>
        </div>
      )}
      {searchInitiated && !results && <div>No result found</div>}
    </div>
  );
};

export default SearchPage;
