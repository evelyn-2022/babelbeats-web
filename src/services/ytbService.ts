import { YouTubePlaylist, YouTubeVideo } from '../types';
import config from '../config';
import axios from 'axios';

const { GOOGLE_API_KEY } = config;

export const extractParameterFromUrl = (
  input: string,
  parameter: string
): string | null => {
  let url: URL;

  try {
    // Attempt to create a new URL object
    url = new URL(input);
  } catch (error) {
    return null;
  }

  return url.searchParams.get(parameter);
};

export const fetchYouTubeVideoDetails = async (
  videoId: string
): Promise<YouTubeVideo | null> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${GOOGLE_API_KEY}&part=snippet,contentDetails,statistics`
  );
  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }

  const snippet = data.items[0].snippet;

  const video = {
    id: videoId,
    title: snippet.title,
    channelTitle: snippet.channelTitle,
    description: snippet.description,
    thumbnail: snippet.thumbnails.medium
      ? snippet.thumbnails.medium.url
      : snippet.thumbnails.default.url,
  };

  return video;
};

export const fetchYouTubePlaylistDetails = async (
  playlistId: string
): Promise<YouTubePlaylist | null> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlists?id=${playlistId}&key=${GOOGLE_API_KEY}&part=snippet,contentDetails`
  );
  const data = await response.json();

  if (!data.items || data.items.length === 0) return null;

  const info = data.items[0].snippet;

  const playlist = {
    id: playlistId,
    title: info.title,
    channelTitle: info.channelTitle,
    description: info.description,
    thumbnail: info.thumbnails.medium
      ? info.thumbnails.medium.url
      : info.thumbnails.default.url,
    itemCount: data.items[0].contentDetails.itemCount,
  };

  return playlist;
};

export const fetchVideoDetails = async (
  videoId: string
): Promise<YouTubeVideo | null> => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${GOOGLE_API_KEY}&part=snippet,contentDetails`
    );

    const info = response.data.items[0].snippet;

    const title =
      info.title.length > 30 ? info.title.slice(0, 30) + '...' : info.title;
    const channelTitle = info.channelTitle.split('-')[0].trim();
    const thumbnail = info.thumbnails.medium
      ? info.thumbnails.medium.url
      : info.thumbnails.default.url;

    return {
      id: videoId,
      title,
      channelTitle,
      description: info.description,
      thumbnail,
    };
  } catch (error) {
    return null;
  }
};

export const fetchPlaylistItems = async (
  playlistId: string,
  pageToken = ''
): Promise<{ items: YouTubeVideo[]; nextPageToken: string | null }> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${pageToken}&key=${GOOGLE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch playlist items');
    }

    const data = await response.json();
    console.log(data);

    const playlistItems: YouTubeVideo[] = data.items.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium
        ? item.snippet.thumbnails.medium.url
        : item.snippet.thumbnails.default?.url,
    }));

    return { items: playlistItems, nextPageToken: data.nextPageToken };
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    return { items: [], nextPageToken: null };
  }
};
