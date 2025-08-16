import { Controller, Post, Body, Get, UseGuards, Query, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DashboardQueryDto, OrderHistoryQueryDto } from './dto/dashboard.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequestUser } from '../common/types/user.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Ruta pública para registrar usuarios
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Ruta protegida que retorna datos del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: RequestUser) {
    return {
      message: 'Este es tu perfil',
      user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  getAdminContent(@GetUser() user: RequestUser) {
    return {
      message: 'Contenido exclusivo para administradores',
      user,
    };
  }

  // Dashboard del usuario - obtener datos completos del dashboard
  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboard(@GetUser() user: RequestUser, @Query() query: DashboardQueryDto) {
    return this.usersService.getDashboard(user.id);
  }

  // Historial de órdenes con paginación
  @UseGuards(JwtAuthGuard)
  @Get('orders')
  async getOrderHistory(
    @GetUser() user: RequestUser,
    @Query() query: OrderHistoryQueryDto
  ) {
    const { page = 1, limit = 10 } = query;
    return this.usersService.getOrderHistory(user.id, page, limit);
  }

  // Dashboard de usuario específico (solo admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':userId/dashboard')
  async getUserDashboard(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.getDashboard(userId);
  }

  // Historial de órdenes de usuario específico (solo admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':userId/orders')
  async getUserOrderHistory(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: OrderHistoryQueryDto
  ) {
    const { page = 1, limit = 10 } = query;
    return this.usersService.getOrderHistory(userId, page, limit);
  }
}
