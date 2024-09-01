import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { YouTubeVideo, YouTubePlaylist } from '../../types';

// Define the type for the component props
interface MusicItemProps {
  nowPlaying?: boolean;
  data: YouTubePlaylist | YouTubeVideo;
  type: 'music' | 'playlist';
  handleResultClick: (
    type: 'music' | 'playlist',
    data: YouTubePlaylist | YouTubeVideo
  ) => void;
}

const MusicItem: React.FC<MusicItemProps> = ({
  nowPlaying,
  data,
  type,
  handleResultClick,
}) => {
  return (
    <div
      className={`flex flex-row justify-between items-center group ${
        nowPlaying && 'bg-customBlack-light'
      }`}
    >
      <div className='flex flex-row gap-4 items-center'>
        <div className='w-16 h-16 overflow-hidden cursor-pointer relative'>
          {data.thumbnail ? (
            <img
              src={data.thumbnail}
              alt='thumbnail'
              className='w-full h-[calc(100%+8px)] object-cover object-center'
            />
          ) : (
            <div className='w-full h-full bg-transparent' />
          )}

          <div
            className='absolute top-0 left-0 hidden group-hover:flex bg-customBlack/80 w-full h-full items-center justify-center'
            onClick={() => handleResultClick(type, data)}
          >
            <FaPlay className='text-2xl text-customWhite/90' />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <span className='font-bold text-nowrap'>
            {data.title.length > 36
              ? data.title.slice(0, 36) + '...'
              : data.title}
          </span>
          <span>{data.channelTitle.split('-')[0].trim()}</span>
        </div>
      </div>
      <BsThreeDotsVertical className='text-2xl text-customWhite/20 hover:text-customWhite/80 transition-all duration-300' />
    </div>
  );
};

export default MusicItem;
