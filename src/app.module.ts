import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FeedbackModule } from './feedback/feedback.module';
import { LessonModule } from './lessons/lessons.module';
import { PromptModule } from './prompt/prompt.module';
import { OpenAiModule } from './open-ai/open-ai.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    FeedbackModule,
    LessonModule,
    PromptModule,
    OpenAiModule,
  ],
})
export class AppModule {}
