import { LessonType } from '@prisma/client';
export declare class CreateLessonDto {
    title: string;
    type?: LessonType;
    content?: string;
    videoUrl?: string;
    order: number;
}
