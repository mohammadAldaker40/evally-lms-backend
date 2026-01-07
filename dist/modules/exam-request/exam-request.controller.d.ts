import { ExamRequestService } from './exam-request.service';
import { CreateExamRequestDto, UpdateExamRequestStatusDto } from './dto/exam-request.dto';
export declare class ExamRequestController {
    private readonly examRequestService;
    constructor(examRequestService: ExamRequestService);
    create(req: any, createDto: CreateExamRequestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ExamRequestStatus;
        courseId: string;
        studentId: string;
        attemptCount: number;
    }>;
    findAll(req: any): Promise<({
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
    updateStatus(id: string, updateDto: UpdateExamRequestStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ExamRequestStatus;
        courseId: string;
        studentId: string;
        attemptCount: number;
    }>;
}
