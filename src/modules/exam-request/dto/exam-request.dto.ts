import { IsString, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExamRequestStatus } from '@prisma/client';

export class CreateExamRequestDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID of the course' })
    @IsUUID()
    courseId: string;
}

export class UpdateExamRequestStatusDto {
    @ApiProperty({ example: 'APPROVED', enum: ExamRequestStatus, description: 'New status for the request' })
    @IsEnum(ExamRequestStatus)
    status: ExamRequestStatus;
}
