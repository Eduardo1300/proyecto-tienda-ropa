import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { RequestUser } from '../common/types/user.types';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  @Get('dashboard')
  getDashboard(@GetUser() user: RequestUser) {
    return {
      message: 'Admin dashboard',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
