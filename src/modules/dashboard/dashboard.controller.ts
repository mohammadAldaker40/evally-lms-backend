import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('student')
    @Roles(Role.STUDENT)
    @ApiOperation({ summary: 'Get student dashboard stats (Progress, Plans, Indicators)' })
    getStudentDashboard(@Request() req) {
        return this.dashboardService.getStudentDashboard(req.user.sub);
    }

    @Get('teacher')
    @Roles(Role.INSTRUCTOR, Role.ADMIN)
    @ApiOperation({ summary: 'Get teacher dashboard stats (Alerts, Requests)' })
    getTeacherDashboard(@Request() req) {
        return this.dashboardService.getTeacherDashboard(req.user.sub);
    }
}
