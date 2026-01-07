import { PrismaService } from '../../prisma/prisma.service';
import { StudyPlanStatus } from '@prisma/client';
export declare class StudyPlanService {
    private prisma;
    constructor(prisma: PrismaService);
    create(teacherId: string, data: {
        studentId: string;
        title: string;
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.StudyPlanStatus;
        studentId: string;
        teacherId: string;
    }>;
    findAllForStudent(studentId: string): Promise<({
        teacher: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.StudyPlanStatus;
        studentId: string;
        teacherId: string;
    })[]>;
    findAllByTeacher(teacherId: string): Promise<({
        student: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.StudyPlanStatus;
        studentId: string;
        teacherId: string;
    })[]>;
    updateStatus(id: string, status: StudyPlanStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.StudyPlanStatus;
        studentId: string;
        teacherId: string;
    }>;
}
