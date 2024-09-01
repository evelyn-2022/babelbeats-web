import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TbPlayerSkipForward, TbPlayerSkipBack } from 'react-icons/tb';
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from 'react-icons/ai';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';
import { YouTubeVideo } from '../../types';
import { searchSong, fetchVideoDetails } from '../../services';
import { usePlayQueue } from '../../context';
import MusicQueue from './MusicQueue';

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
  const location = useLocation();
  const {
    playQueue,
    currentVideoIndex,
    setCurrentVideoIndex,
    autoplay,
    setAutoplay,
    showPlayer,
    setShowPlayer,
  } = usePlayQueue();
  const autoplayRef = useRef(autoplay);

  useEffect(() => {
    autoplayRef.current = autoplay;
  }, [autoplay]);

  useEffect(() => {
    // Hide the player when the URL path changes
    setShowPlayer(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (isPlaying) {
          pauseVideo();
        } else {
          playVideo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  useEffect(() => {
    const fetchAndSetupVideo = async () => {
      // Reset states when videoId changes
      setCurrentTime('0:00');
      setProgress(0);
      setIsPlaying(false);
      setIsPlayerReady(false);

      // Fetch video details and update state
      const videoInfo = await fetchVideoDetails(videoId);

      setVideoInfo(videoInfo);

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
          playerVars: {
            controls: 0, // Hides all player controls
            modestbranding: 1, // Reduces YouTube branding
            iv_load_policy: 3, // Hides video annotations
            rel: 0, // Prevents showing related videos at the end
          },
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
    };

    fetchAndSetupVideo();

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

    // Auto-play if autoplay is true
    if (autoplayRef.current) {
      playVideo();
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

      if (autoplayRef.current) {
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

  const numberToTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      className={`relative flex flex-col justify-between  transition-all duration-300 ${
        showPlayer
          ? 'h-screen bg-black'
          : 'h-[80px] bg-customBlack/50 backdrop-blur-lg'
      } `}
      onClick={() => setAutoplay(true)}
    >
      <div
        className={`w-full flex flex-row gap-36 p-6 transition-all duration-300 ${
          showPlayer ? 'h-full' : 'hidden'
        }`}
      >
        <div className='w-7/12 h-full flex flex-col items-center gap-4'>
          <div id='player' className='w-full' />
          <MusicQueue playQueue={playQueue} />
        </div>

        <div className='w-5/12'>
          <button onClick={() => searchSong('Ne Me Quitte Pas', 'Nina Simone')}>
            Search for lyrics
          </button>
        </div>
      </div>

      <div className='absolute bottom-0 flex flex-row gap-12 w-full items-center px-6 py-2'>
        <div className='flex flex-row gap-4 items-center'>
          <div
            className='w-16 h-16 overflow-hidden cursor-pointer'
            onClick={() => setShowPlayer(!showPlayer)}
          >
            {videoInfo?.thumbnail ? (
              <img
                src={videoInfo.thumbnail}
                alt='thumbnail'
                className='w-full h-[calc(100%+8px)] object-cover object-center'
              />
            ) : (
              <div className='w-full h-full bg-transparent' />
            )}
          </div>

          <div className='flex flex-col gap-1 min-w-20'>
            <h3 className='font-bold'>{videoInfo?.title}</h3>
            <p className=''>{videoInfo?.channelTitle}</p>
          </div>
        </div>

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
          <span>{videoInfo ? numberToTime(durationRef.current) : '0:00'}</span>
        </div>
        <div className='flex flew-row items-center gap-6'>
          <TbPlayerSkipBack
            className={`w-6 h-6 ${
              currentVideoIndex === 0 ? 'text-customWhite/20' : 'cursor-pointer'
            }`}
            onClick={() => {
              if (currentVideoIndex === 0) return;
              setCurrentVideoIndex(currentVideoIndex - 1);
            }}
          />
          <button
            onClick={isPlaying ? pauseVideo : playVideo}
            className='outline-none'
          >
            {isPlaying ? (
              <AiOutlinePauseCircle className='w-10 h-10 text-primary' />
            ) : (
              <AiOutlinePlayCircle className='w-10 h-10 text-primary' />
            )}
          </button>

          <TbPlayerSkipForward
            className={`w-6 h-6 ${
              currentVideoIndex === playQueue.length - 1
                ? 'text-customWhite/20'
                : 'cursor-pointer'
            }`}
            onClick={() => {
              if (currentVideoIndex === playQueue.length - 1) return;
              setCurrentVideoIndex(currentVideoIndex + 1);
            }}
          />
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
