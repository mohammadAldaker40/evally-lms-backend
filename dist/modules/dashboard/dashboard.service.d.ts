import { PrismaService } from '../../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStudentDashboard(studentId: string): Promise<{
        studyPlans: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            status: import(".prisma/client").$Enums.StudyPlanStatus;
            studentId: string;
            teacherId: string;
        }[];
        courses: {
            courseId: string;
            title: string;
            status: import(".prisma/client").$Enums.EnrollmentStatus;
            completedLessons: number;
        }[];
        examRequests: ({
            course: {
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ExamRequestStatus;
            courseId: string;
            studentId: string;
            attemptCount: number;
        })[];
        indicators: {
            weakness: {
                course: string;
                message: string;
            }[];
        };
    }>;
    getTeacherDashboard(teacherId: string): Promise<{
        alerts: {
            pendingExams: number;
            studentsBehind: number;
        };
        requests: ({
            course: {
                title: string;
            };
            student: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ExamRequestStatus;
            courseId: string;
            studentId: string;
            attemptCount: number;
        })[];
        attentionNeeded: ({
            student: {
                name: string;
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
        })[];
    }>;
}
