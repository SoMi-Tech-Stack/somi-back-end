import { Body, Controller, Post } from '@nestjs/common';
import { GenerateLessonDto } from './dto/generate-lesson.dto';
import { LessonService } from './lessons.service';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonsService: LessonService) {}

  @Post('generate')
  generateLesson(@Body() dto: GenerateLessonDto) {
    return this.lessonsService.generateLesson(dto.theme, dto.yearGroup, dto.energyLevel);
  }
}
