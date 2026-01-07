"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStudentDashboard(studentId) {
        const studyPlans = await this.prisma.studyPlan.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' }
        });
        const enrollments = await this.prisma.enrollment.findMany({
            where: { userId: studentId },
            include: {
                course: {
                    select: { id: true, title: true }
                },
                progress: true
            }
        });
        const courses = enrollments.map(e => {
            const completed = e.progress.filter(p => p.isCompleted).length;
            return {
                courseId: e.course.id,
                title: e.course.title,
                status: e.status,
                completedLessons: completed
            };
        });
        const examRequests = await this.prisma.examRequest.findMany({
            where: { studentId },
            include: { course: { select: { title: true } } }
        });
        const weaknessIndicators = examRequests
            .filter(r => r.attemptCount > 1)
            .map(r => ({
            course: r.course.title,
            message: `You have requested an exam ${r.attemptCount} times. Need help?`
        }));
        return {
            studyPlans,
            courses,
            examRequests,
            indicators: {
                weakness: weaknessIndicators
            }
        };
    }
    async getTeacherDashboard(teacherId) {
        const examRequests = await this.prisma.examRequest.findMany({
            where: {
                course: { instructorId: teacherId },
                status: client_1.ExamRequestStatus.PENDING
            },
            include: {
                student: { select: { name: true } },
                course: { select: { title: true } }
            }
        });
        const behindStudents = await this.prisma.studyPlan.findMany({
            where: {
                teacherId,
                status: client_1.StudyPlanStatus.BEHIND
            },
            include: {
                student: { select: { name: true } }
            }
        });
        return {
            alerts: {
                pendingExams: examRequests.length,
                studentsBehind: behindStudents.length
            },
            requests: examRequests,
            attentionNeeded: behindStudents
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map