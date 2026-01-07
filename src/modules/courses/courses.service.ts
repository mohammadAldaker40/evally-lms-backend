import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course, Role } from '@prisma/client';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createCourseDto: CreateCourseDto): Promise<Course> {
        return this.prisma.course.create({
            data: {
                ...createCourseDto,
                instructorId: userId,
            },
        });
    }

    async findAll(): Promise<Course[]> {
        return this.prisma.course.findMany({
            where: { status: 'PUBLISHED' },
            include: { instructor: { select: { name: true, avatar: true } } },
        });
    }

    async findAllForInstructor(instructorId: string): Promise<Course[]> {
        return this.prisma.course.findMany({
            where: { instructorId },
        });
    }

    async findOne(id: string): Promise<Course> {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                lessons: { orderBy: { order: 'asc' } },
                instructor: { select: { name: true, avatar: true } }
            },
        });
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }

    async update(id: string, data: any): Promise<Course> {
        return this.prisma.course.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Course> {
        return this.prisma.course.delete({
            where: { id },
        });
    }
}
