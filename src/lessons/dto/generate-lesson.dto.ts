import { IsString } from 'class-validator';

export class GenerateLessonDto {
  @IsString()
  theme: string;

  @IsString()
  yearGroup: string;

  @IsString()
  energyLevel: string;
}
