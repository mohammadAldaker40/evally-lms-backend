import { PrismaService } from '../../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Lesson } from '@prisma/client';
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(courseId: string, createLessonDto: CreateLessonDto): Promise<Lesson>;
    findAll(courseId: string): Promise<Lesson[]>;
    findOne(id: string): Promise<Lesson>;
    update(id: string, data: any): Promise<Lesson>;
    remove(id: string): Promise<Lesson>;
}
