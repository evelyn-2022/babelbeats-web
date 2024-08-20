import { SearchBar } from '../components';
import config from '../config';
import { SearchResult, YouTubePlaylist, YouTubeVideo } from '../types';

const { GOOGLE_API_KEY } = config;

const SearchPage: React.FC = () => {
  const handleSearch = async (url: string): Promise<SearchResult> => {
    const videoId = extractParameterFromUrl(url, 'v');
    const playlistId = extractParameterFromUrl(url, 'list');

    const result: SearchResult = {};

    if (videoId) {
      const videoDetails = await fetchYouTubeVideoDetails(videoId);
      console.log('Video Details:', videoDetails);
      result.music = videoDetails; // Add video details under 'music'
    }

    if (playlistId) {
      const playlistDetails = await fetchYouTubePlaylistDetails(playlistId);
      console.log('Playlist Details:', playlistDetails);
      result.playlist = playlistDetails; // Add playlist details under 'playlist'
    }

    return result;
  };

  // Helper function to extract parameters from the URL
  const extractParameterFromUrl = (
    input: string,
    parameter: string
  ): string | null => {
    let url: URL;

    try {
      // Attempt to create a new URL object
      url = new URL(input);
    } catch (error) {
      // If the input isn't a full URL, assume it's a video ID or similar
      // You might want to add additional logic here to handle different cases
      console.error('Invalid URL:', input);
      return null;
    }

    // Return the parameter value if it exists
    return url.searchParams.get(parameter);
  };

  // Function to fetch video details from YouTube API
  const fetchYouTubeVideoDetails = async (
    videoId: string
  ): Promise<YouTubeVideo> => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${GOOGLE_API_KEY}&part=snippet,contentDetails,statistics`
    );
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('No video found for the provided ID');
    }

    const video = {
      id: videoId,
      title: data.items[0].snippet.title,
      channelTitle: data.items[0].snippet.channelTitle,
      description: data.items[0].snippet.description,
      thumbnail: data.items[0].snippet.thumbnails.default.url,
    };

    return video;
  };

  const fetchYouTubePlaylistDetails = async (
    playlistId: string
  ): Promise<YouTubePlaylist> => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?id=${playlistId}&key=${GOOGLE_API_KEY}&part=snippet,contentDetails`
    );
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('No playlist found for the provided ID');
    }

    const playlist = {
      id: playlistId,
      title: data.items[0].snippet.title,
      channelTitle: data.items[0].snippet.channelTitle,
      description: data.items[0].snippet.description,
      thumbnail: data.items[0].snippet.thumbnails.default.url,
      itemCount: data.items[0].contentDetails.itemCount,
    };

    return playlist;
  };

  return (
    <div className='h-full flex flex-col my-2 items-center gap-2'>
      <h1 className='text-2xl'>Search for a song or playlist</h1>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
};

export default SearchPage;
