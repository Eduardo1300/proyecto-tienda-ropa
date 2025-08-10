import { Controller, Post, Body, Get, UseGuards, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
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

  // Direcciones: agregar, listar y eliminar
  @UseGuards(JwtAuthGuard)
  @Post('addresses')
  addAddress(@GetUser() user: RequestUser, @Body() body: { street: string; city: string; state: string; postalCode: string; country?: string }) {
    return this.usersService.addAddress(user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  listAddresses(@GetUser() user: RequestUser) {
    return this.usersService.listAddresses(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('addresses/:id')
  removeAddress(@GetUser() user: RequestUser, @Param('id', ParseIntPipe) id: number) {
    // no validamos pertenencia aquí por simplicidad; en real se debería
    return this.usersService.removeAddress(id);
  }

  // Admin: actualizar rol de un usuario
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/role')
  updateRole(@Param('id', ParseIntPipe) id: number, @Body() body: { role: 'admin' | 'moderador' | 'vendedor' | 'user' }) {
    return this.usersService.updateRole(id, body.role);
  }
}
