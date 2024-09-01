import React, { useEffect } from 'react';
import { LuSearch } from 'react-icons/lu';
import { RxCrossCircled } from 'react-icons/rx';
import InputField from './InputField';
import { SearchResult } from '../../types';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  handleClearInput: () => void;
  onSearch: (query: string) => Promise<SearchResult>;
  setResults: (result: SearchResult | null) => void;
  setSearchInitiated: (searchInitiated: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  inputRef,
  handleClearInput,
  onSearch,
}) => {
  useEffect(() => {
    if (query.length > 0) {
      const delayDebounceFn = setTimeout(async () => {
        await onSearch(query);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [query]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className='w-full max-w-md'>
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
            onClick={handleClearInput}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
