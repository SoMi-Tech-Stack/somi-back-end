import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLessonDto } from 'src/lessons/dto/create-lesson.dto';

export class FeedbackDto {
  @IsNumber()
  @IsNotEmpty()
  feedbackRate: number;

  @IsString()
  feedbackText: string;

  @ValidateNested()
  @Type(() => CreateLessonDto)
  lesson: CreateLessonDto;
}
