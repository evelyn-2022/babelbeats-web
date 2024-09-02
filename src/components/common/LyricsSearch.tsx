import React, { useState, useEffect, useRef } from 'react';
import { FaAngleLeft } from 'react-icons/fa6';
import { MdCalendarMonth } from 'react-icons/md';
import { useApiService } from '../../hooks';
import { usePlayQueue } from '../../context';
import { InputField, Button } from '../../components';
import { Song } from '../../types';

interface LyricsSearchProps {
  lyrics: string;
  setLyrics: (lyrics: string) => void;
}

const LyricsSearch: React.FC<LyricsSearchProps> = ({ lyrics, setLyrics }) => {
  const { playQueue, currentVideoIndex } = usePlayQueue();
  const { searchGeniusSongs } = useApiService();
  const [songTitle, setSongTitle] = useState<string>(
    playQueue.length === 0 ? '' : playQueue[currentVideoIndex]?.title
  );
  const [artist, setArtist] = useState<string>(
    playQueue.length === 0 ? '' : playQueue[currentVideoIndex].channelTitle
  );
  const [album, setAlbum] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
  const [advancedSearch, setAdvancedSearch] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchInitiated]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!songTitle || !artist) return;

    setIsLoading(true);

    try {
      const response = await searchGeniusSongs(songTitle, artist);
      console.log(response);
      const songs = response.response.hits.map((hit: any) => {
        const {
          id,
          title,
          primary_artist,
          header_image_thumbnail_url,
          release_date_components,
        } = hit.result;
        return {
          lyricsId: id,
          title,
          artist: primary_artist?.name,
          thumbnail: header_image_thumbnail_url,
          releaseDate: release_date_components?.year,
        };
      });
      console.log(songs);
      setSearchResults(songs);
    } catch (error) {
      console.error('Error searching for lyrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full h-full'>
      {!searchInitiated && (
        <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
          <div className='text-xl font-bold'>No lyrics found</div>
          <div
            className='link'
            onClick={() => {
              setSearchInitiated(true);
            }}
          >
            Search for lyrics
          </div>
        </div>
      )}

      {searchInitiated && searchResults.length === 0 && (
        <form
          className='w-full h-full flex flex-col justify-center items-center gap-6 px-20'
          onSubmit={handleSearch}
        >
          <div
            className='self-start flex flex-row items-center gap-1 cursor-pointer'
            onClick={() => {
              setSearchInitiated(false);
              setIsLoading(false);
            }}
          >
            <FaAngleLeft className='hover:-translate-x-1 transition-all duration-300' />
            <span>Go back</span>
          </div>
          <InputField
            key='title'
            id='title'
            type='text'
            label='Song Title'
            width='w-full'
            value={songTitle}
            ref={inputRef}
            onChange={e => setSongTitle(e.target.value)}
            bgColor='bg-black'
            requireValidation={true}
          />
          <InputField
            type='text'
            label='Artist'
            width='w-full'
            value={artist}
            onChange={e => setArtist(e.target.value)}
            bgColor='bg-black'
          />

          {advancedSearch && (
            <InputField
              key='album'
              id='album'
              type='text'
              label='Album'
              width='w-full'
              value={album}
              onChange={e => setAlbum(e.target.value)}
              bgColor='bg-black'
            />
          )}
          {advancedSearch && (
            <InputField
              type='text'
              id='year'
              label='Release Year'
              width='w-full'
              value={year}
              onChange={e => setYear(e.target.value)}
              bgColor='bg-black'
            />
          )}
          <div
            className='link self-start -mt-4'
            onClick={() => setAdvancedSearch(prev => !prev)}
          >
            {advancedSearch ? 'Less info' : 'More info'}
          </div>
          <div className='flex flex-row justify-between items-center w-full'>
            <Button
              type='submit'
              disabled={isLoading}
              width='w-full'
              variant='outlined'
            >
              {isLoading ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-solid border-t-transparent rounded-full animate-spin mr-2'></div>
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </form>
      )}

      {searchResults.length > 0 && (
        <>
          <div className='flex flex-col gap-2 mb-4'>
            <span className='text-xl font-bold'>Top result</span>
            <div className='flex flex-row items-center gap-6 bg-customBlack-light p-6 rounded-lg cursor-pointer hover:bg-customWhite/15 transition-all duration-300'>
              <div className='w-32 h-32 overflow-hidden '>
                <img
                  src={searchResults[0].thumbnail}
                  alt={searchResults[0].title}
                />
              </div>
              <div>
                <p className='font-bold text-xl'>{searchResults[0].title}</p>
                <p className='text-customWhite/70'>{searchResults[0].artist}</p>
                {searchResults[0].releaseDate && (
                  <p className='text-customWhite/70 mt-7 flex flex-row items-center gap-1 text-sm'>
                    <MdCalendarMonth />
                    {searchResults[0].releaseDate}
                  </p>
                )}
              </div>
            </div>
          </div>
          <ul className='flex flex-col gap-2'>
            <span className='text-xl font-bold'>All results</span>
            <div
              className='overflow-y-auto'
              style={{ maxHeight: 'calc(100vh - 368px)' }}
            >
              {searchResults.map((song, index) => (
                <li
                  key={index}
                  className='flex flex-row border-b-[1px] last:border-b-0 border-customWhite/20 items-center gap-4 cursor-pointer hover:bg-customBlack-light transition-all duration-300'
                >
                  <div className='w-16 h-16 overflow-hidden cursor-pointer relative'>
                    <img src={song.thumbnail} alt={song.title} />
                  </div>
                  <div>
                    <p className='font-bold'>{song.title}</p>
                    <p className='text-customWhite/70'>{song.artist}</p>
                  </div>
                </li>
              ))}
            </div>
          </ul>
        </>
      )}
    </div>
  );
};

export default LyricsSearch;
