import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';


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
  getProfile(@GetUser() user: any) {
    return {
      message: 'Este es tu perfil',
      user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin-only')
getAdminContent(@GetUser() user: any) {
  return {
    message: 'Contenido exclusivo para administradores',
    user,
  };
}
}
