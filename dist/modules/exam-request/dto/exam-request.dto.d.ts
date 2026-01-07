import { ExamRequestStatus } from '@prisma/client';
export declare class CreateExamRequestDto {
    courseId: string;
}
export declare class UpdateExamRequestStatusDto {
    status: ExamRequestStatus;
}
