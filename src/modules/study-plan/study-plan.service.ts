import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StudyPlanStatus, Prisma } from '@prisma/client';

@Injectable()
export class StudyPlanService {
    constructor(private prisma: PrismaService) { }

    async create(teacherId: string, data: { studentId: string; title: string; description?: string }) {
        return this.prisma.studyPlan.create({
            data: {
                ...data,
                teacherId,
                status: StudyPlanStatus.ON_TRACK // Default
            }
        });
    }

    async findAllForStudent(studentId: string) {
        return this.prisma.studyPlan.findMany({
            where: { studentId },
            include: {
                teacher: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findAllByTeacher(teacherId: string) {
        return this.prisma.studyPlan.findMany({
            where: { teacherId },
            include: {
                student: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    }

    async updateStatus(id: string, status: StudyPlanStatus) {
        return this.prisma.studyPlan.update({
            where: { id },
            data: { status }
        });
    }
}
