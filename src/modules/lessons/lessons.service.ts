import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Lesson } from '@prisma/client';

@Injectable()
export class LessonsService {
    constructor(private prisma: PrismaService) { }

    async create(courseId: string, createLessonDto: CreateLessonDto): Promise<Lesson> {
        // Verify course exists
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            throw new NotFoundException('Course not found');
        }

        return this.prisma.lesson.create({
            data: {
                ...createLessonDto,
                courseId,
            },
        });
    }

    async findAll(courseId: string): Promise<Lesson[]> {
        return this.prisma.lesson.findMany({
            where: { courseId },
            orderBy: { order: 'asc' },
        });
    }

    async findOne(id: string): Promise<Lesson> {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: { attachments: true },
        });
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
        return lesson;
    }

    async update(id: string, data: any): Promise<Lesson> {
        return this.prisma.lesson.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Lesson> {
        return this.prisma.lesson.delete({
            where: { id },
        });
    }
}
