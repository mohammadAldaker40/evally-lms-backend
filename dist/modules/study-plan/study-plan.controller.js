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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlanController = void 0;
const common_1 = require("@nestjs/common");
const study_plan_service_1 = require("./study-plan.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const study_plan_dto_1 = require("./dto/study-plan.dto");
let StudyPlanController = class StudyPlanController {
    constructor(studyPlanService) {
        this.studyPlanService = studyPlanService;
    }
    create(req, createDto) {
        return this.studyPlanService.create(req.user.sub, createDto);
    }
    getMyPlans(req) {
        return this.studyPlanService.findAllForStudent(req.user.sub);
    }
    getCreatedPlans(req) {
        return this.studyPlanService.findAllByTeacher(req.user.sub);
    }
    updateStatus(id, updateDto) {
        return this.studyPlanService.updateStatus(id, updateDto.status);
    }
};
exports.StudyPlanController = StudyPlanController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.INSTRUCTOR, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Teacher creates a study plan for a student' }),
    (0, swagger_1.ApiBody)({ type: study_plan_dto_1.CreateStudyPlanDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, study_plan_dto_1.CreateStudyPlanDto]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('student'),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Student views their study plans' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "getMyPlans", null);
__decorate([
    (0, common_1.Get)('teacher'),
    (0, roles_decorator_1.Roles)(client_1.Role.INSTRUCTOR, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Teacher views plans they created' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "getCreatedPlans", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.INSTRUCTOR, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update study plan status (Behind, On Track, Ahead)' }),
    (0, swagger_1.ApiBody)({ type: study_plan_dto_1.UpdateStudyPlanStatusDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, study_plan_dto_1.UpdateStudyPlanStatusDto]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "updateStatus", null);
exports.StudyPlanController = StudyPlanController = __decorate([
    (0, swagger_1.ApiTags)('study-plans'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('study-plans'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [study_plan_service_1.StudyPlanService])
], StudyPlanController);
//# sourceMappingURL=study-plan.controller.js.map