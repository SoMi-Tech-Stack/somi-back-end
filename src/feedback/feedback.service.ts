import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedbackDto } from './dto/feedback.dto';
import { Lesson, LessonDocument } from './schemas/lesson.schema';
import { Feedback, FeedbackDocument } from './schemas/feedback.schema';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
  ) {}

  async createFeedback(feedbackData: FeedbackDto) {
    const { feedbackRate, feedbackText, lesson } = feedbackData;

    const createdLesson = await this.lessonModel.create(lesson);

    const feedback = new this.feedbackModel({
      feedbackRate,
      feedbackText,
      lessonId: createdLesson._id,
    });

    await feedback.save();

    return {
      message: 'Feedback created successfully',
      feedbackId: feedback._id,
      lessonId: createdLesson._id,
    };
  }
}
