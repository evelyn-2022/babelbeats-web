import React, { useState, useEffect, useRef } from 'react';
import { LuSearch } from 'react-icons/lu';
import { RxCrossCircled } from 'react-icons/rx';
import InputField from './InputField';
import { SearchResult, YouTubePlaylist, YouTubeVideo } from '../../types';
import { usePlayQueue } from '../../context';

interface SearchBarProps {
  onSearch: (query: string) => Promise<SearchResult>; // A function that returns a promise of search results
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { playNext } = usePlayQueue();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (query.length > 0) {
      const delayDebounceFn = setTimeout(async () => {
        const searchResults = await onSearch(query);
        setResults(searchResults);
        setShowDropdown(true);
      }, 300); // Adjust the debounce delay as needed

      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults(null);
      setShowDropdown(false);
    }
  }, [query, onSearch]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleResultClick = (
    type: string,
    result: YouTubeVideo | YouTubePlaylist
  ) => {
    setQuery('');
    setShowDropdown(false);
    if (type === 'music') {
      playNext(result);
    } else if (type === 'playlist') {
      console.log('Add playlist to queue:', result);
    }
  };

  return (
    <div className='relative w-full max-w-md  mt-4'>
      <div className='relative flex items-center'>
        <LuSearch className='absolute left-4 z-10 text-white' />
        <InputField
          type='text'
          value={query}
          onChange={handleInputChange}
          padding='px-12'
          width='w-full'
          placeholder='Paste YouTube link here...'
          ref={inputRef}
        />
        {query && (
          <RxCrossCircled
            className='absolute right-4 z-10 text-white cursor-pointer'
            onClick={() => setQuery('')}
          />
        )}
      </div>
      {showDropdown && results && (
        <ul className='absolute z-10 w-full text-black bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-60 overflow-y-auto'>
          {results.music && (
            <li
              className='p-2 cursor-pointer hover:bg-blue-500 hover:text-white'
              onClick={() => handleResultClick('music', results.music)}
            >
              Music: {results.music.title}
            </li>
          )}
          {results.playlist && (
            <li
              className='p-2 cursor-pointer hover:bg-blue-500 hover:text-white'
              onClick={() => handleResultClick('playlist', results.playlist)}
            >
              Playlist: {results.playlist.title}
            </li>
          )}
          {!results.music && !results.playlist && <div>No result found</div>}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
