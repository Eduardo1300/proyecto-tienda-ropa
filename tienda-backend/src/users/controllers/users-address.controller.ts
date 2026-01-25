import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { RequestUser } from '../../common/types/user.types';
import { UsersService } from '../users.service';
import { CreateAddressDto, UpdateAddressDto } from '../dto/address.dto';
import { UpdatePreferencesDto } from '../dto/preferences.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersAddressController {
  constructor(private usersService: UsersService) {}

  // ===================== DIRECCIONES =====================

  @Get('addresses')
  async getAddresses(@GetUser() user: RequestUser) {
    try {
      const addresses = await this.usersService.getAddresses(user.id);
      return {
        success: true,
        data: addresses,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('addresses/:id')
  async getAddress(@GetUser() user: RequestUser, @Param('id') id: number) {
    try {
      const address = await this.usersService.getAddress(user.id, id);
      return {
        success: true,
        data: address,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('addresses')
  async createAddress(
    @GetUser() user: RequestUser,
    @Body() createAddressDto: CreateAddressDto
  ) {
    try {
      const address = await this.usersService.createAddress(user.id, createAddressDto);
      return {
        success: true,
        data: address,
        message: 'Dirección creada exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Put('addresses/:id')
  async updateAddress(
    @GetUser() user: RequestUser,
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddressDto
  ) {
    try {
      const address = await this.usersService.updateAddress(user.id, id, updateAddressDto);
      return {
        success: true,
        data: address,
        message: 'Dirección actualizada exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete('addresses/:id')
  async deleteAddress(@GetUser() user: RequestUser, @Param('id') id: number) {
    try {
      await this.usersService.deleteAddress(user.id, id);
      return {
        success: true,
        message: 'Dirección eliminada exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('addresses/:id/set-default')
  async setDefaultAddress(@GetUser() user: RequestUser, @Param('id') id: number) {
    try {
      const address = await this.usersService.setDefaultAddress(user.id, id);
      return {
        success: true,
        data: address,
        message: 'Dirección establecida como predeterminada',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // ===================== PREFERENCIAS =====================

  @Get('preferences')
  async getPreferences(@GetUser() user: RequestUser) {
    try {
      const preferences = await this.usersService.getPreferences(user.id);
      return {
        success: true,
        data: preferences,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Put('preferences')
  async updatePreferences(
    @GetUser() user: RequestUser,
    @Body() updatePreferencesDto: UpdatePreferencesDto
  ) {
    try {
      const preferences = await this.usersService.updatePreferences(
        user.id,
        updatePreferencesDto
      );
      return {
        success: true,
        data: preferences,
        message: 'Preferencias actualizadas exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // ===================== INFORMACIÓN DE PERFIL =====================

  @Put('profile')
  async updateProfile(@GetUser() user: RequestUser, @Body() profileData: any) {
    try {
      const updatedUser = await this.usersService.updateProfileInfo(user.id, profileData);
      return {
        success: true,
        data: updatedUser,
        message: 'Perfil actualizado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
