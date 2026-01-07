import { StudyPlanStatus } from '@prisma/client';
export declare class CreateStudyPlanDto {
    studentId: string;
    title: string;
    description?: string;
}
export declare class UpdateStudyPlanStatusDto {
    status: StudyPlanStatus;
}
