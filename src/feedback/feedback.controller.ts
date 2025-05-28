import { Body, Controller, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackDto } from './dto/feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('create')
  createFeedback(@Body() feedbakcDto: FeedbackDto) {
    return this.feedbackService.createFeedback(feedbakcDto);
  }
}
