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
  ): Promise<{ valid: boolean; isPremium: boolean }> => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      const isPremium = data.product === 'premium';
      return { valid: true, isPremium };
    } else if (response.status === 403) {
      return { valid: false, isPremium: false };
    } else {
      return { valid: false, isPremium: false };
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

  const checkSpotifyConnection = async (): Promise<{
    connected: boolean;
    isPremium: boolean;
    accessToken: string | null;
  }> => {
    let tokens = getTokens('SpotifyToken') as ConnectionToken;
    if (!tokens) {
      const id = authState.user?.id;
      if (!id) return { connected: false, isPremium: false, accessToken: null };

      const currentUser = await getDBUserById(id);
      if (
        !currentUser ||
        !currentUser.spotifyAccessToken ||
        !currentUser.spotifyRefreshToken
      )
        return { connected: false, isPremium: false, accessToken: null };

      tokens = {
        accessToken: currentUser.spotifyAccessToken,
        refreshToken: currentUser.spotifyRefreshToken,
      };
      await storeTokens('SpotifyToken', tokens, false);
    }

    const { valid, isPremium } = await checkSpotifyTokenValidity(
      tokens.accessToken
    );
    if (!valid) {
      try {
        const newAccessToken = await handleRefreshSpotifyAccessToken(
          tokens.refreshToken
        );
        return { connected: true, isPremium, accessToken: newAccessToken };
      } catch (error) {
        return {
          connected: false,
          isPremium: false,
          accessToken: tokens.accessToken,
        };
      }
    } else {
      return { connected: true, isPremium, accessToken: tokens.accessToken };
    }
  };

  const handleRefreshSpotifyAccessToken = async (
    refreshToken: string
  ): Promise<string | null> => {
    const id = authState.user?.id;
    if (!id) return null;

    try {
      const res = await refreshSpotifyAccessToken(id, refreshToken);
      if (!res) return null;

      await storeTokens(
        'SpotifyToken',
        {
          accessToken: res,
          refreshToken: refreshToken,
        },
        false
      );
      return res;
    } catch (error) {
      addError({
        message:
          'Failed to refresh Spotify access token, please reconnect your spotify account.',
        displayType: 'toast',
        category: 'auth',
      });
      return null;
    }
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
    spotifySignout,
  };
};
