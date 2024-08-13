declare global {
  interface Window {
    Spotify: typeof Spotify;
    onSpotifyWebPlaybackSDKReady: (() => void) | undefined;
  }

  namespace Spotify {
    class Player {
      constructor(options: PlayerOptions);

      connect(): Promise<boolean>;
      disconnect(): void;

      addListener(event: PlayerEvent, callback: (data: any) => void): boolean;
      removeListener(event: PlayerEvent): boolean;

      getCurrentState(): Promise<PlaybackState | null>;

      // other methods and properties...
    }

    interface PlayerOptions {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    }

    interface PlaybackState {
      // Define the properties of the playback state...
    }

    type PlayerEvent =
      | 'initialization_error'
      | 'authentication_error'
      | 'account_error'
      | 'playback_error'
      | 'player_state_changed'
      | 'ready'
      | 'not_ready';

    interface ErrorType {
      message: string;
    }

    interface ReadyType {
      device_id: string;
    }

    // Add other relevant interfaces here...
  }
}

export {};
