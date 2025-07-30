// src/auth/controllers/refresh.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

@Controller('auth')
export class RefreshController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findById(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Token inválido');
      }

      const newAccessToken = this.jwtService.sign(
        { username: user.username, sub: user.id },
        { expiresIn: '15m' },
      );

      return { access_token: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
