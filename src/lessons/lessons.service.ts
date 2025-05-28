import { Injectable } from '@nestjs/common';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { PromptService } from 'src/prompt/prompt.service';
import { listeningActivityTemplate } from 'src/prompt/templates/listening-activity.template';
import { YoutubeService } from 'src/youtube/youtube.service';
import { LessonActivity } from 'src/open-ai/types/lesson-activity'; // якщо є тип LessonActivity
import { YoutubeVideo } from './types/youtubeVideo';

@Injectable()
export class LessonService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly promptService: PromptService,
    private readonly youtubeService: YoutubeService,
  ) {}

  async generateLesson(
    themeReq: string,
    yearGroupReq: string,
    energyLevel: string,
  ): Promise<LessonActivity & { youtubeVideo: YoutubeVideo | null }> {
    const { prompt, yearGroup, theme } = this.promptService.generatePrompt(
      listeningActivityTemplate,
      { theme: themeReq, yearGroup: yearGroupReq, energyLevel },
    );

    const generatedLesson = await this.openAiService.generateChatCompletion(
      prompt,
      yearGroup,
      theme,
      energyLevel,
    );

    const searchQuery = `${generatedLesson.piece.title} ${generatedLesson.piece.composer}`;

    const videoResults: YoutubeVideo[] =
      await this.youtubeService.searchVideos(searchQuery);

    return {
      ...generatedLesson,
      youtubeVideo: videoResults[0] ?? null,
    };
  }
}
