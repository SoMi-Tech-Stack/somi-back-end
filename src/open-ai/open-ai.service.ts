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
      timeout: 20000, // 20 секунд таймаут
    });
  }

  async generateChatCompletion(
    prompt: string,
    yearGroup: string,
    theme: string,
    activityType: string,
  ): Promise<LessonActivity> {
    try {
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Быстрее и качественнее чем gpt-3.5-turbo
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, // Снижено для стабильности и скорости
        max_tokens: 1500, // Ограничиваем длину ответа
        stream: true, // Включаем стриминг
      });

      let fullContent = '';
      
      // Собираем контент из стрима
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullContent += content;
      }

      return this.parseOpenAiLessonResponse(fullContent, yearGroup, theme, activityType);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate lesson from OpenAI');
    }
  }

  parseOpenAiLessonResponse(
    rawContent: string,
    yearGroup: string,
    theme: string,
    activityType: string,
  ) {
    try {
      // Extract JSON content from markdown code blocks if present
      let jsonContent = rawContent.trim();
      
      // Check if content is wrapped in markdown code blocks
      if (jsonContent.startsWith('```json') && jsonContent.endsWith('```')) {
        // Remove the markdown code block wrapper
        jsonContent = jsonContent.slice(7, -3).trim(); // Remove ```json and ```
      } else if (jsonContent.startsWith('```') && jsonContent.endsWith('```')) {
        // Handle case where it's wrapped in code blocks without 'json' specifier
        jsonContent = jsonContent.slice(3, -3).trim(); // Remove ``` and ```
      }
      
      const parsedContent = JSON.parse(jsonContent) as LessonActivity;
      const lessonActivity = {
        ...parsedContent,
        yearGroup: yearGroup,
        theme: theme,
        energyLevel: activityType,
      };
      return lessonActivity;
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      console.error('Raw content:', rawContent);
      throw new Error('Invalid JSON format from OpenAI response');
    }
  }
}
