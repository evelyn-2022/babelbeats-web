import React, { useState, useEffect } from 'react';
import { LuSearch } from 'react-icons/lu';
import { RxCrossCircled } from 'react-icons/rx';
import InputField from './InputField';
import { SearchResult } from '../../types';
import { useVideo } from '../../context';

interface SearchBarProps {
  onSearch: (query: string) => Promise<SearchResult>; // A function that returns a promise of search results
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { setCurrentVideoId } = useVideo();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleResultClick = (type: string, id: string) => {
    setQuery('');
    setShowDropdown(false);
    if (type === 'music') {
      setCurrentVideoId(id);
    }
  };

  return (
    <div className='relative w-full max-w-md  mt-4'>
      <div className='relative flex items-center'>
        <LuSearch className='absolute left-4 z-50 text-white' />
        <InputField
          type='text'
          value={query}
          onChange={handleInputChange}
          padding='px-12'
          width='w-full'
          placeholder='Paste YouTube link here...'
        />
        {query && (
          <RxCrossCircled
            className='absolute right-4 z-50 text-white cursor-pointer'
            onClick={() => setQuery('')}
          />
        )}
      </div>
      {showDropdown && results && (
        <ul className='absolute z-10 w-full text-black bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-60 overflow-y-auto'>
          {results.music && (
            <li
              className='p-2 cursor-pointer hover:bg-blue-500 hover:text-white'
              onClick={() => handleResultClick('music', results.music!.id)}
            >
              Music: {results.music.title}
            </li>
          )}
          {results.playlist && (
            <li
              className='p-2 cursor-pointer hover:bg-blue-500 hover:text-white'
              onClick={() =>
                handleResultClick('playllist', results.playlist!.id)
              }
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
