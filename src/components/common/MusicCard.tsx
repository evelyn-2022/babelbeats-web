import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { YouTubePlaylist, YouTubeVideo } from '../../types';

interface MusicCardProps {
  data: YouTubePlaylist | YouTubeVideo;
  type: 'song' | 'playlist';
  handleResultClick: (
    type: 'song' | 'playlist',
    data: YouTubePlaylist | YouTubeVideo
  ) => void;
}

const MusicCard: React.FC<MusicCardProps> = ({
  data,
  type,
  handleResultClick,
}) => {
  return (
    <div className='flex flex-row w-full items-start gap-6 bg-customWhite/5 p-6 rounded-lg cursor-pointer hover:bg-customWhite/10 transition-all duration-300 group relative max-w-[600px]'>
      <div className='w-32 h-32 overflow-hidden cursor-pointer relative'>
        <img
          src={data.thumbnail}
          alt={data.title}
          className='w-full h-[calc(100%+8px)] object-cover object-center'
        />
        <div
          className='absolute top-0 left-0 hidden group-hover:flex bg-customBlack/80 w-full h-full items-center justify-center'
          onClick={() => handleResultClick(type, data)}
        >
          <FaPlay className='text-2xl text-customWhite/90' />
        </div>
      </div>
      <div>
        <p>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
        <p className='font-bold text-xl max-w-96'>
          {data.title.length > 36
            ? data.title.slice(0, 36) + '...'
            : data.title}
        </p>
        <p className='text-customWhite/70'>{data.channelTitle}</p>
        {data.description && (
          <p className='text-customWhite/70 mt-8 flex flex-row items-center text-sm max-w-96'>
            {data.description.length > 56
              ? data.description.slice(0, 56) + '...'
              : data.description}
          </p>
        )}
      </div>
      <BsThreeDotsVertical className='absolute right-3 top-8 self-start text-2xl text-customWhite/20 hover:text-customWhite/80 transition-all duration-300' />
    </div>
  );
};

export default MusicCard;
