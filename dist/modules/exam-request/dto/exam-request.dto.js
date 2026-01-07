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
exports.UpdateExamRequestStatusDto = exports.CreateExamRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateExamRequestDto {
}
exports.CreateExamRequestDto = CreateExamRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID of the course' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateExamRequestDto.prototype, "courseId", void 0);
class UpdateExamRequestStatusDto {
}
exports.UpdateExamRequestStatusDto = UpdateExamRequestStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'APPROVED', enum: client_1.ExamRequestStatus, description: 'New status for the request' }),
    (0, class_validator_1.IsEnum)(client_1.ExamRequestStatus),
    __metadata("design:type", String)
], UpdateExamRequestStatusDto.prototype, "status", void 0);
//# sourceMappingURL=exam-request.dto.js.map