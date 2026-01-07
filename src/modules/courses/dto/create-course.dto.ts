import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { CourseStatus } from '@prisma/client';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    level?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsEnum(CourseStatus)
    @IsOptional()
    status?: CourseStatus;
}
