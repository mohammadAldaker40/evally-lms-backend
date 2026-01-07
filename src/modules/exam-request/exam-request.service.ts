import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExamRequestStatus } from '@prisma/client';

@Injectable()
export class ExamRequestService {
    constructor(private prisma: PrismaService) { }

    async create(studentId: string, courseId: string) {
        // Check if there is already a pending request
        const existing = await this.prisma.examRequest.findFirst({
            where: {
                studentId,
                courseId,
                status: ExamRequestStatus.PENDING
            }
        });

        if (existing) {
            throw new BadRequestException('You already have a pending request for this course.');
        }

        // Check previous attempts/requests to track "Weakness"
        const attempts = await this.prisma.examRequest.count({
            where: {
                studentId,
                courseId
            }
        });

        // Create the request
        return this.prisma.examRequest.create({
            data: {
                studentId,
                courseId,
                attemptCount: attempts + 1
            }
        });
    }

    async findAll(teacherId: string) {
        // Get requests for courses taught by this teacher
        // Assuming teacherId is used to filter queries if we want to be strict,
        // or just return all for admin/teachers. 
        // For V1, let's return all requests for courses the teacher owns
        return this.prisma.examRequest.findMany({
            where: {
                course: {
                    instructorId: teacherId
                }
            },
            include: {
                student: {
                    select: { id: true, name: true, email: true }
                },
                course: {
                    select: { id: true, title: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async updateStatus(id: string, status: ExamRequestStatus) {
        const request = await this.prisma.examRequest.findUnique({
            where: { id }
        });

        if (!request) {
            throw new NotFoundException('Exam request not found');
        }

        return this.prisma.examRequest.update({
            where: { id },
            data: { status }
        });
    }
}
