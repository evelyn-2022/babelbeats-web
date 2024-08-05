import config from '../config';
import { spotifySigninCallback } from '../services';

const {
  spofity: { clientId, redirectUri, scope },
} = config;

export const spotifySignin = () => {
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}`;
  window.location.assign(spotifyAuthUrl);
};

export const handleSpotifySigninCallback = async (code: string) => {
  try {
    const res = await spotifySigninCallback(code);
    console.log(res);
    //   window.location.assign('/account');
  } catch (error) {
    window.location.assign('/');
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await fetch('http://localhost:8080/spotify/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) throw new Error('Failed to refresh access token');

  const data = await response.json();
  localStorage.setItem('spotify_access_token', data.access_token);
  return data.access_token;
};

export const fetchWithToken = async (
  url: string,
  options: RequestInit = {}
) => {
  let accessToken = localStorage.getItem('spotify_access_token');

  const makeRequest = async () => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      // Access token expired, refresh it
      accessToken = await refreshAccessToken();
      return makeRequest();
    }

    return response;
  };

  return makeRequest();
};
