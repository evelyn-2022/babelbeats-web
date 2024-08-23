import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TbPlayerSkipForward, TbPlayerSkipBack } from 'react-icons/tb';
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from 'react-icons/ai';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';
import axios from 'axios';
import config from '../../config';
import { YouTubeVideo } from '../../types';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

const YtbMusicPlayer: React.FC<{ videoId: string }> = ({ videoId }) => {
  const playerRef = useRef<YT.Player | null>(null);
  const durationRef = useRef<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [videoInfo, setVideoInfo] = useState<YouTubeVideo | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const userInteractedRef = useRef<boolean>(false);
  const location = useLocation();
  const apiKey = config.GOOGLE_API_KEY;

  useEffect(() => {
    // Hide the player when the URL path changes
    setShowPlayer(false);
  }, [location.pathname]);

  useEffect(() => {
    // Pause the current video if playing
    if (playerRef.current && isPlaying) {
      playerRef.current.pauseVideo();
    }

    // Reset states when videoId changes
    setCurrentTime('0:00');
    setProgress(0);
    setIsPlaying(false);
    setIsPlayerReady(false); // Reset player readiness

    // Fetch video details for the new video
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails`
        );
        const info = response.data.items[0].snippet;
        console.log(response.data.items[0]);

        const title =
          info.title.length > 30 ? info.title.slice(0, 30) + '...' : info.title;
        const channelTitle = info.channelTitle.split('-')[0].trim();
        const thumbnail = info.thumbnails.medium
          ? info.thumbnails.medium.url
          : info.thumbnails.default.url;

        setVideoInfo({
          id: videoId,
          title,
          channelTitle,
          description: info.description,
          thumbnail,
        });
      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };

    fetchVideoDetails();

    // Load the IFrame Player API code asynchronously if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Create a YouTube player when the API code downloads
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: videoId,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    // If the player is already initialized, cue the video and load metadata
    if (playerRef.current) {
      playerRef.current.cueVideoById(videoId);
    }

    // Cleanup on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videoId]);

  const onPlayerReady = (event: YT.PlayerEvent) => {
    const player = event.target;
    const playerDuration = player.getDuration();
    if (playerDuration) {
      durationRef.current = playerDuration - 1;
      setIsPlayerReady(true);
      setCurrentTime(numberToTime(0));
      setProgress(0);
      setIsPlaying(false);
    }

    if (userInteractedRef.current) {
      playVideo(); // Auto-play if user has interacted
    }
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === YT.PlayerState.CUED) {
      // Video is cued and metadata is loaded
      const playerDuration = playerRef.current?.getDuration();
      if (playerDuration) {
        durationRef.current = playerDuration - 1;
        setIsPlayerReady(true);
        setProgress(0); // Reset progress bar
      }

      if (userInteractedRef.current && !isPlaying) {
        playVideo(); // Autoplay video if user has interacted
      }
    }

    if (event.data === YT.PlayerState.PLAYING) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Set interval to update progress every second
      intervalRef.current = setInterval(updateProgressBar, 1000);
      setIsPlaying(true); // Update playing state
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (
        event.data === YT.PlayerState.PAUSED ||
        event.data === YT.PlayerState.ENDED
      ) {
        setIsPlaying(false); // Update playing state
      }
    }
  };

  const updateProgressBar = () => {
    if (playerRef.current && durationRef.current > 0) {
      const currentTime = playerRef.current.getCurrentTime();
      const progressPercentage = (currentTime / durationRef.current) * 100;
      setProgress(progressPercentage * 10);
      setCurrentTime(numberToTime(currentTime));
    }
  };

  const playVideo = () => {
    playerRef.current?.playVideo();
    setIsPlaying(true);
    setShowPlayer(true);
  };

  const pauseVideo = () => {
    playerRef.current?.pauseVideo();
    setIsPlaying(false);
  };

  const onProgressBarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(event.target.value);
    const newTime = (newProgress / 1000) * durationRef.current;
    playerRef.current?.seekTo(newTime, true);
    setProgress(newProgress);
    setCurrentTime(numberToTime(newTime));
  };

  const handleUserInteraction = () => {
    if (!userInteractedRef.current) {
      userInteractedRef.current = true;
    }
  };

  const numberToTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      className={`relative flex flex-col justify-between transition-all duration-300 ${
        showPlayer
          ? 'h-screen bg-black'
          : 'h-[80px] bg-customBlack/50 backdrop-blur-lg'
      } `}
      onClick={handleUserInteraction}
    >
      <div
        className={`w-full flex flex-row gap-36 transition-all duration-300 ${
          showPlayer ? 'h-full' : 'hidden'
        }`}
      >
        <div className='w-7/12 h-full flex items-center justify-center p-4'>
          <div id='player' />
        </div>

        <div className='w-5/12 p-4'>lyrics</div>
      </div>

      <div className='absolute bottom-0 flex flex-row gap-12 w-full items-center px-6 py-2'>
        {videoInfo && (
          <div className='flex flex-row gap-4 items-center'>
            <div className='w-16 h-16 overflow-hidden cursor-pointer'>
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className='w-full h-[calc(100%+24px)] object-cover object-center -mt-2.5'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <h3 className='font-bold'>{videoInfo.title}</h3>
              <p className=''>{videoInfo.channelTitle}</p>
            </div>
          </div>
        )}
        <div className='flex items-center h-5 grow gap-2'>
          <span>
            {isPlayerReady && playerRef.current ? currentTime : '0:00'}
          </span>
          <input
            className='cursor-pointer w-full'
            type='range'
            id='progressBar'
            min='0'
            max='993'
            step='1'
            value={Math.round(progress)}
            onChange={onProgressBarChange}
          />
          <span>{numberToTime(durationRef.current)}</span>
        </div>
        <div className='flex flew-row items-center gap-6'>
          <TbPlayerSkipBack className='w-6 h-6' />
          <button
            onClick={isPlaying ? pauseVideo : playVideo}
            className='outline-none'
          >
            {isPlaying ? (
              <AiOutlinePauseCircle className='w-10 h-10' />
            ) : (
              <AiOutlinePlayCircle className='w-10 h-10' />
            )}
          </button>

          <TbPlayerSkipForward className='w-6 h-6' />
          <div
            className='cursor-pointer'
            onClick={() => setShowPlayer(!showPlayer)}
          >
            {showPlayer ? (
              <FaCaretDown className='w-6 h-6' />
            ) : (
              <FaCaretUp className='w-6 h-6' />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YtbMusicPlayer;
