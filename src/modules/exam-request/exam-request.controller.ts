import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ExamRequestService } from './exam-request.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CreateExamRequestDto, UpdateExamRequestStatusDto } from './dto/exam-request.dto';

@ApiTags('exam-requests')
@ApiBearerAuth()
@Controller('exam-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamRequestController {
    constructor(private readonly examRequestService: ExamRequestService) { }

    @Post()
    @Roles(Role.STUDENT)
    @ApiOperation({ summary: 'Student requests a mid-exam for a course' })
    @ApiBody({ type: CreateExamRequestDto })
    create(@Request() req, @Body() createDto: CreateExamRequestDto) {
        return this.examRequestService.create(req.user.sub, createDto.courseId);
    }

    @Get()
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    @ApiOperation({ summary: 'Teacher views exam requests' })
    findAll(@Request() req) {
        // If admin, maybe pass null or handle differently, but here we assume instructor context
        return this.examRequestService.findAll(req.user.sub);
    }

    @Patch(':id/status')
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    @ApiOperation({ summary: 'Teacher approves/rejects exam request' })
    @ApiBody({ type: UpdateExamRequestStatusDto })
    updateStatus(@Param('id') id: string, @Body() updateDto: UpdateExamRequestStatusDto) {
        return this.examRequestService.updateStatus(id, updateDto.status);
    }
}
