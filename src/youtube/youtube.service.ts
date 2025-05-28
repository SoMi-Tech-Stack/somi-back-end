import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface YoutubeVideo {
  title: string;
  videoId: string;
  url: string;
}

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('YOUTUBE_API_KEY', '');
  }

  async searchVideos(query: string, maxResults = 5): Promise<YoutubeVideo[]> {
    try {
      const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: this.apiKey,
          q: query,
          part: 'snippet',
          type: 'video',
          maxResults,
          safeSearch: 'strict',
        },
      });

      const items = searchRes.data.items;

      if (!items.length) {
        this.logger.warn(`No search results for query: "${query}"`);
        return [];
      }

      const videoIds = items.map((item) => item.id.videoId).join(',');

      const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          key: this.apiKey,
          part: 'snippet,contentDetails',
          id: videoIds,
        },
      });

      const filtered = detailsRes.data.items.filter((item) => {
        const duration = this.parseDuration(item.contentDetails.duration);
        return duration >= 60;
      });

      if (!filtered.length) {
        this.logger.warn(`No suitable videos found for query: "${query}"`);
      }

      return filtered.map((item) => ({
        title: item.snippet.title,
        videoId: item.id,
        url: `https://www.youtube.com/watch?v=${item.id}`,
      }));
    } catch (error) {
      this.logger.error('YouTube API error', error);
      throw new Error('Failed to fetch videos from YouTube');
    }
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const [, h, m, s] = match.map((v) => parseInt(v || '0', 10));
    return h * 3600 + m * 60 + s;
  }
}
