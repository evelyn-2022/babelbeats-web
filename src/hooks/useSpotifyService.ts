import config from '../config';
import { ConnectionToken } from '../types';
import { getTokens, removeTokens, storeTokens } from '../utils';
import { useApiService } from '../hooks';
import { useError, useAuth } from '../context';

export const useSpotifyService = () => {
  const {
    spotify: { clientId, redirectUri, scope },
  } = config;
  const { authState } = useAuth();
  const {
    spotifySigninCallback,
    refreshSpotifyAccessToken,
    getDBUserById,
    partialUpdateDBUser,
  } = useApiService();
  const { addError } = useError();

  const spotifySignin = () => {
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;
    window.location.assign(spotifyAuthUrl);
  };

  const checkSpotifyTokenValidity = async (
    accessToken: string
  ): Promise<boolean> => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      return true;
    } else if (response.status === 401) {
      return false;
    } else {
      return false;
    }
  };

  const handleSpotifySigninCallback = async (code: string, userId: number) => {
    try {
      const res = await spotifySigninCallback(code, userId);
      if (!res) return;

      await storeTokens('SpotifyToken', res, false);
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
      storeTokens('SpotifyToken', tokens, false);
    }

    const isTokenvalid = await checkSpotifyTokenValidity(tokens.accessToken);
    if (!isTokenvalid) {
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

      await storeTokens(
        'SpotifyToken',
        {
          accessToken: res,
          refreshToken: refreshToken,
        },
        false
      );
    } catch (error) {
      addError({
        message:
          'Failed to refresh Spotify access token, please reconnect your spotify account.',
        displayType: 'toast',
        category: 'auth',
      });
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

    const userId = authState.user?.id;
    if (!userId) return;

    partialUpdateDBUser(userId, {
      spotifyRefreshToken: null,
      spotifyAccessToken: null,
    });
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
