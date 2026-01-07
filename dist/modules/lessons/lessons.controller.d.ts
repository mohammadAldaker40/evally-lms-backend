import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
    create(courseId: string, createLessonDto: CreateLessonDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        content: string | null;
        type: import(".prisma/client").$Enums.LessonType;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }>;
    findAll(courseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        content: string | null;
        type: import(".prisma/client").$Enums.LessonType;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        content: string | null;
        type: import(".prisma/client").$Enums.LessonType;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }>;
    update(id: string, updateLessonDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        content: string | null;
        type: import(".prisma/client").$Enums.LessonType;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        content: string | null;
        type: import(".prisma/client").$Enums.LessonType;
        order: number;
        videoUrl: string | null;
        duration: number | null;
    }>;
}
