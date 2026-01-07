import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    create(@Request() req, @Body() createCourseDto: CreateCourseDto) {
        return this.coursesService.create(req.user.userId, createCourseDto);
    }

    @Get()
    findAll() {
        return this.coursesService.findAll();
    }

    @Get('my-courses')
    @Roles(Role.INSTRUCTOR)
    findMyCourses(@Request() req) {
        return this.coursesService.findAllForInstructor(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coursesService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    update(@Param('id') id: string, @Body() updateCourseDto: any) {
        return this.coursesService.update(id, updateCourseDto);
    }

    @Delete(':id')
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.coursesService.remove(id);
    }
}
