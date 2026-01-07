import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('lessons')
@ApiBearerAuth()
@Controller('courses/:courseId/lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) { }

    @Post()
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    create(@Param('courseId') courseId: string, @Body() createLessonDto: CreateLessonDto) {
        return this.lessonsService.create(courseId, createLessonDto);
    }

    @Get()
    findAll(@Param('courseId') courseId: string) {
        return this.lessonsService.findAll(courseId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.lessonsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    update(@Param('id') id: string, @Body() updateLessonDto: any) {
        return this.lessonsService.update(id, updateLessonDto);
    }

    @Delete(':id')
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.lessonsService.remove(id);
    }
}
