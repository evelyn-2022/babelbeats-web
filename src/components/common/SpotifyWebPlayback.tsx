import React, { useEffect, useState, useRef } from 'react';
import { useSpotifyService } from '../../hooks';
import { useError } from '../../context';

const SpotifyWebPlayback: React.FC = () => {
  const { addError } = useError();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { checkSpotifyConnection } = useSpotifyService();
  const accessTokenRef = useRef<string | null>(null); // Use ref to store accessToken

  useEffect(() => {
    const loadSpotifySDK = () => {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
      console.log('Spotify SDK loaded');
    };

    const initializePlayer = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log('Spotify Web Playback SDK Ready');
        const accessToken = accessTokenRef.current; // Access token from ref
        if (!accessToken) {
          console.error('Access token not found');
          return;
        }

        const player = new Spotify.Player({
          name: 'Your Web Player',
          getOAuthToken: cb => {
            cb(accessToken);
          },
          volume: 0.5,
        });
        console.log('Player created');

        player.addListener('initialization_error', ({ message }) => {
          console.error(message);
        });
        player.addListener('authentication_error', ({ message }) => {
          console.error(message);
        });
        player.addListener('account_error', ({ message }) => {
          console.error(message);
        });
        player.addListener('playback_error', ({ message }) => {
          console.error(message);
        });

        // player.addListener('player_state_changed', state => {
        //   console.log(state);
        // });

        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setPlayer(player);
          setDeviceId(device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        player.connect().then(success => {
          if (success) {
            console.log(
              'The Web Playback SDK successfully connected to Spotify!'
            );
          }
        });
      };
    };

    const setupSpotify = async () => {
      try {
        const { connected, isPremium, accessToken } =
          await checkSpotifyConnection();
        console.log(
          'connected',
          connected,
          'isPremium',
          isPremium,
          'accessToken',
          accessToken
        );
        setIsPremium(isPremium);

        if (connected && isPremium && accessToken) {
          accessTokenRef.current = accessToken; // Set accessToken in ref

          // Now load the Spotify SDK and initialize the player
          loadSpotifySDK();

          // Wait for the SDK to load and then initialize the player
          initializePlayer();
        } else if (!connected) {
          addError({
            message: 'Please connect to Spotify first',
            displayType: 'toast',
            category: 'auth',
          });
        } else if (!isPremium) {
          addError({
            message: 'Please upgrade to a Spotify Premium account',
            displayType: 'toast',
            category: 'auth',
          });
        } else {
          addError({
            message: 'An unknown error occurred while connecting to Spotify',
            displayType: 'toast',
            category: 'auth',
          });
        }
      } catch (error) {
        console.error('Error during Spotify setup', error);
        addError({
          message: 'An error occurred while setting up Spotify',
          displayType: 'toast',
          category: 'auth',
        });
      }
    };

    setupSpotify();
  }, []);

  const checkPlayerState = async () => {
    console.log(player);
    const state = await player.getCurrentState();
    if (state) {
      console.log('Player state:', state);
      if (state.loading) {
        console.log('Music is loading');
      } else {
        console.log('Player is loaded');
      }
    } else {
      console.log('No state found, player might not be connected properly');
    }
  };

  const setActiveDevice = async (deviceId: string) => {
    await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      body: JSON.stringify({
        device_ids: [deviceId],
        play: true,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessTokenRef.current}`,
      },
    });
  };

  const playTrack = async (spotifyUri: string) => {
    console.log('Play track');
    if (player && deviceId) {
      await setActiveDevice(deviceId);
      try {
        const res = await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotifyUri] }),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessTokenRef.current}`,
            },
          }
        );
        setIsPlaying(true);
        console.log('Play track response', res);
        // Call this function after attempting to play a track
        checkPlayerState();
      } catch (error) {
        console.error('Error playing track', error);
      }
    } else {
      console.error('Player or deviceId not found', player, deviceId);
    }
  };

  const pauseTrack = async () => {
    if (player && deviceId) {
      await fetch(
        `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessTokenRef.current}`,
          },
        }
      );
      setIsPlaying(false);
    }
  };

  return (
    <div>
      {isPremium ? (
        <div>
          {isPlaying ? (
            <button onClick={pauseTrack}>Pause</button>
          ) : (
            <button
              onClick={() => playTrack('spotify:track:4tfIMhIhRWWDEMFuK13HQx')}
            >
              Play Track
            </button>
          )}
        </div>
      ) : (
        <> </>
      )}
    </div>
  );
};

export default SpotifyWebPlayback;
