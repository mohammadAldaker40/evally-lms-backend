import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StudyPlanStatus, ExamRequestStatus, EnrollmentStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStudentDashboard(studentId: string) {
        // 1. Study Plan Status
        const studyPlans = await this.prisma.studyPlan.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' }
        });

        // 2. Course Progress
        const enrollments = await this.prisma.enrollment.findMany({
            where: { userId: studentId },
            include: {
                course: {
                    select: { id: true, title: true }
                },
                progress: true
            }
        });

        // Calculate progress percentage manually if needed or just return raw
        const courses = enrollments.map(e => {
            const completed = e.progress.filter(p => p.isCompleted).length;
            // Assuming we can get total lessons, but for now we just show completed count
            return {
                courseId: e.course.id,
                title: e.course.title,
                status: e.status,
                completedLessons: completed
            };
        });

        // 3. Exam Requests (Weakness indicator logic could be here)
        const examRequests = await this.prisma.examRequest.findMany({
            where: { studentId },
            include: { course: { select: { title: true } } }
        });

        // Weakness indicator: multiple requests for same course or many rejections?
        // Simple logic: if attemptCount > 1 for any pending/approved request
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

    async getTeacherDashboard(teacherId: string) {
        // 1. Pending Exam Requests
        const examRequests = await this.prisma.examRequest.findMany({
            where: {
                course: { instructorId: teacherId },
                status: ExamRequestStatus.PENDING
            },
            include: {
                student: { select: { name: true } },
                course: { select: { title: true } }
            }
        });

        // 2. Students Behind Schedule (Alerts)
        const behindStudents = await this.prisma.studyPlan.findMany({
            where: {
                teacherId,
                status: StudyPlanStatus.BEHIND
            },
            include: {
                student: { select: { name: true } }
            }
        });

        // 3. General Stats (Total Students, etc.)
        // This can be complex, for now returning the alerts
        return {
            alerts: {
                pendingExams: examRequests.length,
                studentsBehind: behindStudents.length
            },
            requests: examRequests,
            attentionNeeded: behindStudents
        };
    }
}
