import { IsArray, IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PieceDetailsDto {
  @IsString()
  @IsNotEmpty()
  yearComposed: string;

  @IsString()
  @IsNotEmpty()
  about: string;

  @IsString()
  @IsNotEmpty()
  sheetMusicUrl: string;

  @IsString()
  @IsNotEmpty()
  wikipediaUrl: string;
}

class PieceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  composer: string;

  @IsString()
  @IsNotEmpty()
  youtubeLink: string;

  @ValidateNested()
  @Type(() => PieceDetailsDto)
  details: PieceDetailsDto;
}

export class CreateLessonDto {
  @ValidateNested()
  @Type(() => PieceDto)
  piece: PieceDto;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  questions: string[];

  @IsString()
  @IsNotEmpty()
  teacherTip: string;
}
