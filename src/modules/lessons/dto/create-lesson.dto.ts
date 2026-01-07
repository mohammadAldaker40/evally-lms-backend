import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum } from 'class-validator';
import { LessonType } from '@prisma/client';

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(LessonType)
    @IsOptional()
    type?: LessonType;

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    videoUrl?: string;

    @IsInt()
    order: number;
}
