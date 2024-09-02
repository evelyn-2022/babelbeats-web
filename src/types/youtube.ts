export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  thumbnail: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  thumbnail: string;
  itemCount: number;
}

export interface SearchResult {
  playlist?: YouTubePlaylist;
  music?: YouTubeVideo;
}

export interface Song {
  id?: string;
  title: string;
  artist: string;
  album?: string;
  thumbnail: string;
  releaseDate: string;
  lyricsId?: string;
  lyrics?: string;
}
