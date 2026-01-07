import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { StudyPlanService } from './study-plan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CreateStudyPlanDto, UpdateStudyPlanStatusDto } from './dto/study-plan.dto';

@ApiTags('study-plans')
@ApiBearerAuth()
@Controller('study-plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudyPlanController {
    constructor(private readonly studyPlanService: StudyPlanService) { }

    @Post()
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    @ApiOperation({ summary: 'Teacher creates a study plan for a student' })
    @ApiBody({ type: CreateStudyPlanDto })
    create(@Request() req, @Body() createDto: CreateStudyPlanDto) {
        return this.studyPlanService.create(req.user.sub, createDto);
    }

    @Get('student')
    @Roles(Role.STUDENT)
    @ApiOperation({ summary: 'Student views their study plans' })
    getMyPlans(@Request() req) {
        return this.studyPlanService.findAllForStudent(req.user.sub);
    }

    @Get('teacher')
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    @ApiOperation({ summary: 'Teacher views plans they created' })
    getCreatedPlans(@Request() req) {
        return this.studyPlanService.findAllByTeacher(req.user.sub);
    }

    @Patch(':id/status')
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    @ApiOperation({ summary: 'Update study plan status (Behind, On Track, Ahead)' })
    @ApiBody({ type: UpdateStudyPlanStatusDto })
    updateStatus(@Param('id') id: string, @Body() updateDto: UpdateStudyPlanStatusDto) {
        return this.studyPlanService.updateStatus(id, updateDto.status);
    }
}
