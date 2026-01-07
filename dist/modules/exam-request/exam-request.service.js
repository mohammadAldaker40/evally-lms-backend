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
exports.ExamRequestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ExamRequestService = class ExamRequestService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(studentId, courseId) {
        const existing = await this.prisma.examRequest.findFirst({
            where: {
                studentId,
                courseId,
                status: client_1.ExamRequestStatus.PENDING
            }
        });
        if (existing) {
            throw new common_1.BadRequestException('You already have a pending request for this course.');
        }
        const attempts = await this.prisma.examRequest.count({
            where: {
                studentId,
                courseId
            }
        });
        return this.prisma.examRequest.create({
            data: {
                studentId,
                courseId,
                attemptCount: attempts + 1
            }
        });
    }
    async findAll(teacherId) {
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
    async updateStatus(id, status) {
        const request = await this.prisma.examRequest.findUnique({
            where: { id }
        });
        if (!request) {
            throw new common_1.NotFoundException('Exam request not found');
        }
        return this.prisma.examRequest.update({
            where: { id },
            data: { status }
        });
    }
};
exports.ExamRequestService = ExamRequestService;
exports.ExamRequestService = ExamRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamRequestService);
//# sourceMappingURL=exam-request.service.js.map