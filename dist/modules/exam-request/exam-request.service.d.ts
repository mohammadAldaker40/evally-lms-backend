import { PrismaService } from '../../prisma/prisma.service';
import { ExamRequestStatus } from '@prisma/client';
export declare class ExamRequestService {
    private prisma;
    constructor(prisma: PrismaService);
    create(studentId: string, courseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ExamRequestStatus;
        courseId: string;
        studentId: string;
        attemptCount: number;
    }>;
    findAll(teacherId: string): Promise<({
        course: {
            id: string;
            title: string;
        };
        student: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ExamRequestStatus;
        courseId: string;
        studentId: string;
        attemptCount: number;
    })[]>;
    updateStatus(id: string, status: ExamRequestStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ExamRequestStatus;
        courseId: string;
        studentId: string;
        attemptCount: number;
    }>;
}
