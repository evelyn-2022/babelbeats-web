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

export interface Music {
  id: number;
  ytbId: string;
  lyrics: string;
}
