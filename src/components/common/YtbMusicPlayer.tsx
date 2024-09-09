import React, { useEffect, useRef, useState } from 'react';
import { TbPlayerSkipForward, TbPlayerSkipBack } from 'react-icons/tb';
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from 'react-icons/ai';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';
import { RxShuffle, RxLoop } from 'react-icons/rx';
import { YouTubeVideo } from '../../types';
import { fetchVideoDetails } from '../../services';
import { usePlayQueue } from '../../context';
import { MusicQueue, LyricsPanel } from '../../components';

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
  const [showVideo, setShowVideo] = useState<boolean>(true);

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
  const currentIndexRef = useRef(currentVideoIndex);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(0); // 0: no loop, 1: loop all, 2: loop one
  const shuffleRef = useRef(false);
  const loopRef = useRef(0);

  useEffect(() => {
    autoplayRef.current = autoplay;
  }, [autoplay]);

  useEffect(() => {
    currentIndexRef.current = currentVideoIndex;
  }, [currentVideoIndex]);

  useEffect(() => {
    shuffleRef.current = shuffle;
  }, [shuffle]);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (!videoInfo) return;

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

    if (autoplayRef.current) {
      playVideo();
    }
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === YT.PlayerState.CUED) {
      const playerDuration = playerRef.current?.getDuration();
      if (playerDuration) {
        durationRef.current = playerDuration - 1;
        setIsPlayerReady(true);
        setProgress(0);
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
      setIsPlaying(true);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (
        event.data === YT.PlayerState.PAUSED ||
        event.data === YT.PlayerState.ENDED
      ) {
        setIsPlaying(false);
      }
      if (event.data === YT.PlayerState.ENDED) {
        playNextSong();
      }
    }
  };

  const playNextSong = () => {
    const shuffle = shuffleRef.current;
    const loop = loopRef.current;

    let nextIndex: number;
    const currentVideoIndex = currentIndexRef.current;

    if (loop === 2) {
      // Loop one
      nextIndex = currentVideoIndex;
    } else if (shuffle) {
      nextIndex = getRandomIndex(currentVideoIndex, playQueue.length);
    } else if (currentVideoIndex < playQueue.length - 1) {
      nextIndex = currentVideoIndex + 1;
    } else {
      // If at the end of the queue
      if (loop === 1) {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return; // Exit if not looping
      }
    }

    setTimeout(() => {
      playVideo();
    }, 1000);

    setCurrentVideoIndex(nextIndex);
  };

  const getRandomIndex = (currentIndex: number, queueLength: number) => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * queueLength);
    } while (randomIndex === currentIndex && queueLength > 1); // Ensure not the same as the current index
    return randomIndex;
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
      className={`relative flex flex-col justify-between transition-all duration-300 ${
        showPlayer
          ? 'h-screen bg-black'
          : 'h-[80px] bg-customBlack/50 backdrop-blur-lg'
      } `}
      onClick={() => setAutoplay(true)}
    >
      <div
        className={`w-full flex flex-row gap-6 p-6 transition-all duration-300 ${
          showPlayer ? 'h-full' : 'hidden'
        }`}
      >
        <div className='w-7/12 h-full flex flex-col items-center'>
          <div
            className={`w-full ${
              showVideo ? 'h-fit mb-4' : 'h-0 mb-2'
            } transition-all duration-300 overflow-hidden`}
          >
            <div id='player' className='w-full' />
          </div>
          <div className='w-full relative'>
            <div
              className='absolute top-2 right-1 cursor-pointer text-customWhite/40 hover:text-customWhite'
              onClick={() => {
                setShowVideo(!showVideo);
              }}
            >
              {showVideo ? (
                <FaCaretUp className='w-4 h-4' />
              ) : (
                <FaCaretDown className='w-4 h-4' />
              )}
            </div>
          </div>
          <MusicQueue
            playQueue={playQueue}
            maxHeight={
              showVideo ? 'calc(100vh - 528px)' : 'calc(100vh - 160px)'
            }
          />
        </div>

        <div className='w-5/12'>
          <LyricsPanel />
        </div>
      </div>

      <div className='absolute bottom-0 flex flex-row gap-16 w-full items-center px-6 py-2'>
        <div className='flex flex-row gap-4 items-center w-3/12 min-w-72'>
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

        <div className='flex flew-row items-center gap-6'>
          <TbPlayerSkipBack
            className={`w-6 h-6 ${
              currentVideoIndex === 0
                ? 'text-customWhite/20 pointer-events-none'
                : 'cursor-pointer'
            }`}
            onClick={() => {
              if (currentVideoIndex === 0) return;
              setCurrentVideoIndex(currentVideoIndex - 1);
            }}
          />
          <button
            onClick={isPlaying ? pauseVideo : playVideo}
            className={`outline-none ${
              videoInfo
                ? 'text-primary cursor-pointer '
                : 'text-customWhite/20 cursor-default pointer-events-none'
            }`}
          >
            {isPlaying ? (
              <AiOutlinePauseCircle className='w-10 h-10' />
            ) : (
              <AiOutlinePlayCircle className='w-10 h-10' />
            )}
          </button>

          <TbPlayerSkipForward
            className={`w-6 h-6 ${
              currentVideoIndex === playQueue.length - 1 ||
              playQueue.length === 0
                ? 'text-customWhite/20 pointer-events-none'
                : 'cursor-pointer'
            }`}
            onClick={playNextSong}
          />
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
          <RxShuffle
            className={`w-6 h-6 cursor-pointer ${
              shuffle ? 'text-customWhite' : 'text-customWhite/40'
            }`}
            onClick={() => setShuffle(prev => !prev)}
          />
          <div className='relative'>
            <RxLoop
              className={`w-6 h-6 cursor-pointer ${
                loop === 0 ? 'text-customWhite/40' : `text-customWhite`
              }`}
              onClick={() => {
                loop === 2 ? setLoop(0) : setLoop(loop + 1);
              }}
            />
            <span
              className={`${
                loop === 2
                  ? 'text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer'
                  : 'hidden'
              }`}
            >
              1
            </span>
          </div>

          <div
            className={`${
              videoInfo
                ? 'cursor-pointer'
                : 'text-customWhite/20 pointer-events-none'
            }`}
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
