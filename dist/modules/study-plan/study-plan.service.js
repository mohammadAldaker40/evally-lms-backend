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
exports.StudyPlanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StudyPlanService = class StudyPlanService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(teacherId, data) {
        return this.prisma.studyPlan.create({
            data: Object.assign(Object.assign({}, data), { teacherId, status: client_1.StudyPlanStatus.ON_TRACK })
        });
    }
    async findAllForStudent(studentId) {
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
    async findAllByTeacher(teacherId) {
        return this.prisma.studyPlan.findMany({
            where: { teacherId },
            include: {
                student: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    }
    async updateStatus(id, status) {
        return this.prisma.studyPlan.update({
            where: { id },
            data: { status }
        });
    }
};
exports.StudyPlanService = StudyPlanService;
exports.StudyPlanService = StudyPlanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudyPlanService);
//# sourceMappingURL=study-plan.service.js.map