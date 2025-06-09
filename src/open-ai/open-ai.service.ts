import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { LessonActivity } from './types/lesson-activity';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateChatCompletion(
    prompt: string,
    yearGroup: string,
    theme: string,
    activityType: string,
  ): Promise<LessonActivity> {
    const res = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const message = res.choices[0].message.content ?? '';

    return this.parseOpenAiLessonResponse(message, yearGroup, theme, activityType);
  }

  parseOpenAiLessonResponse(
    rawContent: string,
    yearGroup: string,
    theme: string,
    activityType: string,
  ) {
    try {
      const parsedContent = JSON.parse(rawContent) as LessonActivity;
      const lessonActivity = {
        ...parsedContent,
        yearGroup: yearGroup,
        theme: theme,
        energyLevel: activityType,
      };
      return lessonActivity;
    } catch (e) {
      console.log('Error parsing OpenAI response:', e);
      throw new Error('Invalid JSON format from OpenAI response');
    }
  }
}
