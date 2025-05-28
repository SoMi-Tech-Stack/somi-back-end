import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Lesson } from './lesson.schema';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ required: true })
  feedbackText: string;

  @Prop()
  feedbackRate: number;

  @Prop({ type: Types.ObjectId, ref: Lesson.name, required: true })
  lessonId: Types.ObjectId;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
