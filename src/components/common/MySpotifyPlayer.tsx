import React, { useEffect, useState } from 'react';

const MySpotifyPlayer: React.FC<{ accessToken: string }> = ({
  accessToken,
}) => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const initializePlayer = () => {
      if (window.Spotify !== undefined) {
        const player = new window.Spotify.Player({
          name: 'My Spotify Player',
          getOAuthToken: cb => {
            cb(accessToken);
          },
          volume: 0.5,
        });

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

        player.addListener('player_state_changed', state => {
          console.log(state);
          if (state) {
            setIsPlaying(!state.paused);
          }
        });

        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setPlayer(player);
          setDeviceId(device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        player.connect();

        return () => {
          player.disconnect();
        };
      }
    };

    if (window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }
  }, [accessToken]);

  const setActiveDevice = async (deviceId: string) => {
    await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      body: JSON.stringify({
        device_ids: [deviceId],
        play: true,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  };

  const playTrack = async (spotifyUri: string) => {
    if (player && deviceId) {
      await setActiveDevice(deviceId);
      await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ uris: [spotifyUri] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      setIsPlaying(true);
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
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      setIsPlaying(false);
    }
  };

  return (
    <div>
      {isPlaying ? (
        <button onClick={pauseTrack}>Pause</button>
      ) : (
        <button
          onClick={() =>
            playTrack(
              'spotify:track:4tfIMhIhRWWDEMFuK13HQx?si=8b883180e4524db7'
            )
          }
        >
          Play Track
        </button>
      )}
    </div>
  );
};

export default MySpotifyPlayer;
