import { Injectable } from '@nestjs/common';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { PromptService } from 'src/prompt/prompt.service';
import { listeningActivityTemplate } from 'src/prompt/templates/listening-activity.template';
import { YoutubeService } from 'src/youtube/youtube.service';
import { LessonActivity } from 'src/open-ai/types/lesson-activity';
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
    try {
      console.log('Step 1: Generating prompt...');
      const { prompt, yearGroup, theme } = this.promptService.generatePrompt(
        listeningActivityTemplate,
        { theme: themeReq, yearGroup: yearGroupReq, energyLevel },
      );
      console.log('Prompt generated:', prompt);

      console.log('Step 2: Sending prompt to OpenAI...');
      const generatedLesson = await this.openAiService.generateChatCompletion(
        prompt,
        yearGroup,
        theme,
        energyLevel,
      );
      console.log('OpenAI response:', generatedLesson);

      const searchQuery = `${generatedLesson.piece.title} ${generatedLesson.piece.composer}`;
      console.log('Step 3: Searching YouTube with query:', searchQuery);

      const videoResults: YoutubeVideo[] =
        await this.youtubeService.searchVideos(searchQuery);
      console.log('YouTube results:', videoResults);

      return {
        ...generatedLesson,
        youtubeVideo: videoResults[0] ?? null,
      };
    } catch (error) {
      console.error('❌ Error in generateLesson:', error);
      throw error;
    }
  }
}
