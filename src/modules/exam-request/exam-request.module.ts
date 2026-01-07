import { Module } from '@nestjs/common';
import { ExamRequestController } from './exam-request.controller';
import { ExamRequestService } from './exam-request.service';

@Module({
  controllers: [ExamRequestController],
  providers: [ExamRequestService]
})
export class ExamRequestModule {}
