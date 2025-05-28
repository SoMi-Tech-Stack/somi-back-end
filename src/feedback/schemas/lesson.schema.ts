import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LessonDocument = Lesson & Document;

@Schema({ timestamps: true })
export class Lesson {
  @Prop({
    type: {
      title: String,
      composer: String,
      youtubeLink: String,
      details: {
        instruments: [String],
        yearComposed: String,
        about: String,
        sheetMusicUrl: String,
        wikipediaUrl: String,
      },
    },
    required: true,
  })
  piece: {
    title: string;
    composer: string;
    youtubeLink: string;
    details: {
      instruments: string[];
      yearComposed: string;
      about: string;
      sheetMusicUrl: string;
      wikipediaUrl: string;
    };
  };

  @Prop({ required: true })
  reason: string;

  @Prop({ type: [String], required: true })
  questions: string[];

  @Prop({ required: true })
  teacherTip: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
