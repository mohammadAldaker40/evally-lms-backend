import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from '@prisma/client';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createCourseDto: CreateCourseDto): Promise<Course>;
    findAll(): Promise<Course[]>;
    findAllForInstructor(instructorId: string): Promise<Course[]>;
    findOne(id: string): Promise<Course>;
    update(id: string, data: any): Promise<Course>;
    remove(id: string): Promise<Course>;
}
