import config from '../config';
import { ConnectionToken } from '../types';
import { getTokens, removeTokens, storeTokens, isTokenExpired } from '../utils';
import { useApiService } from '../hooks';
import { useError, useAuth } from '../context';

export const useSpotifyService = () => {
  const {
    spotify: { clientId, redirectUri, scope },
  } = config;
  const { authState } = useAuth();
  const { spotifySigninCallback, refreshSpotifyAccessToken, getDBUserById } =
    useApiService();
  const { addError } = useError();

  const spotifySignin = () => {
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;
    window.location.assign(spotifyAuthUrl);
  };

  const handleSpotifySigninCallback = async (code: string, userId: number) => {
    try {
      const res = await spotifySigninCallback(code, userId);
      if (!res) return;

      await storeTokens('SpotifyToken', res);
      window.location.assign('/account');
    } catch (error) {
      window.location.assign('/');
    }
  };

  const checkSpotifyConnection = async (): Promise<boolean> => {
    let tokens = getTokens('SpotifyToken') as ConnectionToken;
    if (!tokens) {
      const id = authState.user?.id;
      if (!id) return false;

      const currentUser = await getDBUserById(id);
      if (
        !currentUser ||
        !currentUser.spotifyAccessToken ||
        !currentUser.spotifyRefreshToken
      )
        return false;
      tokens = {
        accessToken: currentUser.spotifyAccessToken,
        refreshToken: currentUser.spotifyRefreshToken,
      };
      storeTokens('SpotifyToken', tokens);
    }

    if (isTokenExpired(tokens.accessToken)) {
      try {
        await handleRefreshSpotifyAccessToken(tokens.refreshToken);
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return true;
    }
  };

  const handleRefreshSpotifyAccessToken = async (refreshToken: string) => {
    const id = authState.user?.id;
    if (!id) return;

    try {
      const res = await refreshSpotifyAccessToken(id, refreshToken);
      if (!res) return;

      await storeTokens('SpotifyToken', {
        accessToken: res,
        refreshToken: refreshToken,
      });
    } catch (error) {
      addError({
        message:
          'Failed to refresh Spotify access token, please reconnect your spotify account.',
        displayType: 'toast',
        category: 'auth',
      });
      window.location.assign('/account');
    }
  };

  const fetchWithToken = async (url: string, options: RequestInit = {}) => {
    const tokens = getTokens('SpotifyToken');
    if (!tokens) {
      addError({
        message: 'You need to sign in to Spotify',
        displayType: 'toast',
        category: 'auth',
      });
      return;
    }

    const makeRequest = async () => {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });

      if (response.status === 401) {
        // Access token expired, refresh it
        await handleRefreshSpotifyAccessToken(tokens.refreshToken);
        return makeRequest();
      }

      return response;
    };

    return makeRequest();
  };

  const spotifySignout = () => {
    removeTokens('SpotifyToken');
    window.location.assign('/account');
  };

  return {
    spotifySignin,
    handleSpotifySigninCallback,
    checkSpotifyConnection,
    handleRefreshSpotifyAccessToken,
    fetchWithToken,
    spotifySignout,
  };
};
