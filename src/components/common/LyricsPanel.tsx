import React, { useState, useEffect, useRef } from 'react';
import { FaAngleLeft } from 'react-icons/fa6';
import { useApiService } from '../../hooks';
import { usePlayQueue } from '../../context';
import { InputField, Button } from '../../components';
import {
  processTextWithBreaks,
  getLyricsApi,
  postLyricsApi,
} from '../../services';

const LyricsPanel: React.FC = () => {
  const { playQueue, currentVideoIndex } = usePlayQueue();
  const { searchGeniusSongs, searchGeniusLyrics } = useApiService();
  const [songTitle, setSongTitle] = useState<string>(
    playQueue.length === 0 ? '' : playQueue[currentVideoIndex]?.title
  );
  const [artist, setArtist] = useState<string>(
    playQueue.length === 0 ? '' : playQueue[currentVideoIndex].channelTitle
  );
  const [album, setAlbum] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
  const [advancedSearch, setAdvancedSearch] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [lyric, setLyric] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLyricsSaved, setIsLyricsSaved] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lyric || !scrollRef.current) return;

    const handleScroll = () => {
      setIsScrolling(true);
      // Hide scrollbar after scrolling stops
      const timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
      return () => clearTimeout(timeout);
    };

    const currentRef = scrollRef.current;
    currentRef.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [lyric, currentVideoIndex, playQueue]);

  useEffect(() => {
    const fetchLyrics = async () => {
      const id = playQueue[currentVideoIndex]?.id;
      if (!id) return;

      try {
        const data = await getLyricsApi(id);
        if (!data) return;

        setLyric(data.lyrics);

        setIsLyricsSaved(true);
      } catch (error) {
        console.error('Error fetching lyrics:', error);
      }
    };

    fetchLyrics();
  }, [currentVideoIndex, playQueue]);

  useEffect(() => {
    setIsLyricsSaved(false);
  }, [currentVideoIndex, playQueue]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchInitiated]);

  useEffect(() => {
    if (playQueue.length > 0 && currentVideoIndex !== -1) {
      setSongTitle(playQueue[currentVideoIndex]?.title || '');
      setArtist(playQueue[currentVideoIndex]?.channelTitle || '');
      setAlbum('');
      setYear('');
      setLyric('');
      setSearchInitiated(false);
    }
  }, [currentVideoIndex, playQueue]);

  const textToHtml = (text: string) => {
    return text
      .split('\n\n\n') // Paragraphs
      .map(paragraph => paragraph.split('\n').join('<br />')) // Line breaks within paragraphs
      .join('</p><br /><p classMame="text-md">');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!songTitle || !artist) return;

    setIsLoading(true);

    try {
      const response = await searchGeniusSongs(songTitle, artist);

      if (response.response.hits.length === 0) {
        setError('No matching songs found. Please check your input.');
        return;
      }
      const song = response.response.hits[0]?.result;

      const data = await searchGeniusLyrics(song?.id);

      if (!data) {
        setError('No lyrics found.');
        return;
      }

      const processedData = processTextWithBreaks(data);

      setLyric(processedData);
    } catch (error) {
      console.error('Error searching for lyrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full h-full'>
      {!searchInitiated && !lyric && (
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

      {searchInitiated && !lyric && (
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
            id='songTitle'
            type='text'
            label='Song Title'
            width='w-full'
            value={songTitle}
            values={{ songTitle, artist, album, year }}
            ref={inputRef}
            onChange={e => setSongTitle(e.target.value)}
            bgColor='bg-black'
            requireValidation={true}
          />
          <InputField
            id='artist'
            type='text'
            label='Artist'
            width='w-full'
            value={artist}
            values={{ songTitle, artist, album, year }}
            onChange={e => setArtist(e.target.value)}
            bgColor='bg-black'
            requireValidation={true}
          />

          {advancedSearch && (
            <InputField
              key='album'
              id='album'
              type='text'
              label='Album'
              width='w-full'
              value={album}
              values={{ songTitle, artist, album, year }}
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
              values={{ songTitle, artist, album, year }}
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
          {error && <div className='text-red-500'>{error}</div>}
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

      {lyric && (
        <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
          <div
            ref={scrollRef}
            className={`text-customWhite/70 overflow-y-auto overflow-x-hidden w-full flex items-center justify-center ${
              isScrolling ? 'scrollbar-custom' : 'scrollbar-hidden'
            }`}
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            <div>
              <p
                className='lyrics h-full'
                dangerouslySetInnerHTML={{ __html: textToHtml(lyric) }}
              />
            </div>
          </div>
          {!isLyricsSaved && (
            <div
              className='cursor-pointer text-costomWhite/70 link text-customWhite/70 -mt-4 self-start ml-40'
              onClick={() => {
                postLyricsApi(playQueue[currentVideoIndex].id, lyric);
                setIsLyricsSaved(true);
              }}
            >
              Contribute
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LyricsPanel;
