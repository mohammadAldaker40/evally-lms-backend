import { CourseStatus } from '@prisma/client';
export declare class CreateCourseDto {
    title: string;
    description?: string;
    price?: number;
    level?: string;
    category?: string;
    status?: CourseStatus;
}
