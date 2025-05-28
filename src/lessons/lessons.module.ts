import { Module } from '@nestjs/common';
import { LessonService } from './lessons.service';
import { PromptModule } from 'src/prompt/prompt.module';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { LessonController } from './lessons.controller';
import { YoutubeService } from 'src/youtube/youtube.service';

@Module({
  imports: [OpenAiModule, PromptModule],
  controllers: [LessonController],
  providers: [LessonService, YoutubeService],
})
export class LessonModule {}
