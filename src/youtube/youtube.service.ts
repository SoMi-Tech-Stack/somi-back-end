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

  async searchVideos(query: string, maxResults = 3): Promise<YoutubeVideo[]> {
    try {
      // Первый запрос - поиск видео
      const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: this.apiKey,
          q: query,
          part: 'snippet',
          type: 'video',
          maxResults, // Уменьшено с 5 до 3 по умолчанию
          safeSearch: 'strict',
        },
        timeout: 8000, // 8 секунд таймаут для поиска
      });

      const items = searchRes.data.items;

      if (!items.length) {
        this.logger.warn(`No search results for query: "${query}"`);
        return [];
      }

      const videoIds = items.map((item) => item.id.videoId).join(',');

      // Второй запрос - детали видео
      const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          key: this.apiKey,
          part: 'snippet,contentDetails',
          id: videoIds,
        },
        timeout: 7000, // 7 секунд таймаут для деталей
      });

      const filtered = detailsRes.data.items.filter((item) => {
        const duration = this.parseDuration(item.contentDetails.duration);
        return duration >= 60; // Минимум 1 минута
      });

      if (!filtered.length) {
        this.logger.warn(`No suitable videos found for query: "${query}"`);
        // Возвращаем первое видео даже если оно короче 1 минуты
        return items.slice(0, 1).map((item) => ({
          title: item.snippet.title,
          videoId: item.id.videoId,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }));
      }

      return filtered.map((item) => ({
        title: item.snippet.title,
        videoId: item.id,
        url: `https://www.youtube.com/watch?v=${item.id}`,
      }));
    } catch (error) {
      this.logger.error('YouTube API error', error);
      // Не бросаем ошибку, возвращаем пустой массив
      return [];
    }
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const [, h, m, s] = match.map((v) => parseInt(v || '0', 10));
    return h * 3600 + m * 60 + s;
  }
}
