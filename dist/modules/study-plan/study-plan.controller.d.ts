import { StudyPlanService } from './study-plan.service';
import { CreateStudyPlanDto, UpdateStudyPlanStatusDto } from './dto/study-plan.dto';
export declare class StudyPlanController {
    private readonly studyPlanService;
    constructor(studyPlanService: StudyPlanService);
    create(req: any, createDto: CreateStudyPlanDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.StudyPlanStatus;
        studentId: string;
        teacherId: string;
    }>;
    getMyPlans(req: any): Promise<({
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
    getCreatedPlans(req: any): Promise<({
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
    updateStatus(id: string, updateDto: UpdateStudyPlanStatusDto): Promise<{
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
