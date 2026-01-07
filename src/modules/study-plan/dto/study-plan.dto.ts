import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StudyPlanStatus } from '@prisma/client';

export class CreateStudyPlanDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID of the student' })
    @IsUUID()
    studentId: string;

    @ApiProperty({ example: 'Mathematics Recovery Plan', description: 'Title of the study plan' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Focus on Algebra and Geometry basics before the mid-term.', description: 'Detailed description (optional)', required: false })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateStudyPlanStatusDto {
    @ApiProperty({ example: 'ON_TRACK', enum: StudyPlanStatus, description: 'Current status of the student' })
    @IsEnum(StudyPlanStatus)
    status: StudyPlanStatus;
}
