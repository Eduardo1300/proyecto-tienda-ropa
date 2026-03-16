import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserPayload } from '../common/types/user.types';
import { AnalyticsService } from '../analytics/services/analytics.service';
import { EventType } from '../analytics/entities/analytics-event.entity';
import { LoyaltyService } from '../loyalty/services/loyalty.service';

interface ValidatedUser {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface JwtVerifyResult {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private analyticsService: AnalyticsService,
    private loyaltyService: LoyaltyService,
    private configService: ConfigService,
  ) {}

  // Validar email y contraseña
  async validateUser(
    email: string,
    password: string,
  ): Promise<ValidatedUser | null> {
    console.log('🔍 AuthService.validateUser called with email:', email);
    
    try {
      // Buscar usuario por email (ya normalizado en UsersService)
      const user = await this.usersService.findByEmail(email);
      
      if (!user) {
        console.log('❌ User not found for email:', email);
        return null;
      }
      
      console.log('👤 User found, validating password...');
      
      // Verificar que el usuario tenga contraseña
      if (!user.password) {
        console.log('❌ User found but no password hash stored');
        return null;
      }
      
      // Comparar contraseña plana con hash
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('🔒 Password validation result:', isValidPassword);
      
      if (isValidPassword) {
        // Remover password del objeto de retorno por seguridad
        const { password: _password, refreshToken, passwordResetToken, ...validatedUser } = user;
        console.log('✅ User validated successfully:', validatedUser.email);
        return validatedUser;
      } else {
        console.log('❌ Invalid password for user:', email);
        return null;
      }
    } catch (error) {
      console.error('💥 Error in validateUser:', error);
      return null;
    }
  }

  // Registro de nuevo usuario
  async register(createUserDto: CreateUserDto) {
    console.log('📝 AuthService.register called for email:', createUserDto.email);
    
    try {
      // Verificar si el usuario ya existe (la búsqueda ya normaliza el email)
      const existingUser = await this.usersService.findByEmail(createUserDto.email);
      
      if (existingUser) {
        console.log('❌ Email already exists:', createUserDto.email);
        throw new ConflictException('Email is already in use');
      }

      // Crear el usuario (el UsersService ya maneja la normalización y el hash de la contraseña)
      const newUser = await this.usersService.create(createUserDto);

      // Track user registration in analytics
      try {
        await this.analyticsService.trackEvent({
          eventType: EventType.USER_REGISTRATION,
          userId: newUser.id,
          eventData: { email: newUser.email, username: newUser.username },
        });
        console.log('✅ Analytics event tracked for user registration:', newUser.id);
      } catch (error) {
        console.error('⚠️ Failed to track analytics event:', error);
      }

      // Create loyalty program and welcome bonus
      try {
        await this.loyaltyService.createProgram(newUser.id);
        console.log('✅ Loyalty program created for new user:', newUser.id);
      } catch (error) {
        console.error('⚠️ Failed to create loyalty program:', error);
      }

      console.log('✅ User registered successfully:', newUser.email);
      return {
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      };
    } catch (error) {
      console.error('💥 Error in register:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Registration failed');
    }
  }

  // Login: genera y guarda el refreshToken
  async login(user: ValidatedUser) {
    const payload: UserPayload = {
      username: user.username,
      sub: user.id,
      role: user.role,
      email: user.email,
    };

    const jwtSecret = this.configService.get<string>('JWT_SECRET') || 'clave_secreta_acceso';
    const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'claverefresh456';
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';

    const access_token = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: jwtExpiresIn,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: jwtRefreshSecret,
      expiresIn: '7d',
    });

    await this.usersService.updateRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  // Refrescar el access_token usando refresh_token
  async getNewAccessToken(refreshToken: string) {
    try {
      const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'claverefresh456';
      const jwtSecret = this.configService.get<string>('JWT_SECRET') || 'clave_secreta_acceso';
      const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';

      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtRefreshSecret,
      });

      const user = await this.usersService.findById(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { sub: user.id, username: user.username, email: user.email, role: user.role },
        {
          secret: jwtSecret,
          expiresIn: jwtExpiresIn,
        },
      );

      return { access_token: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Logout (opcional): elimina el refreshToken de la DB
  async logout(userId: number) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  // Solicitar recuperación de contraseña
  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generar token de reset
    const jwtSecret = this.configService.get<string>('JWT_SECRET') || 'clave_secreta_acceso';
    const resetToken = this.jwtService.sign(
      { sub: user.id, purpose: 'password-reset' },
      {
        secret: jwtSecret,
        expiresIn: '1h', // Token válido por 1 hora
      },
    );

    // En una aplicación real, aquí enviarías un email con el token
    // Para el demo, simplemente guardamos el token en la base de datos
    await this.usersService.updatePasswordResetToken(user.id, resetToken);

    return { 
      message: 'If the email exists, a reset link has been sent',
      // En desarrollo, devolvemos el token para poder probarlo
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    };
  }

  // Resetear contraseña con token
  async resetPassword(token: string, newPassword: string) {
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET') || 'clave_secreta_acceso';
      const payload = this.jwtService.verify(token, {
        secret: jwtSecret,
      });

      if (payload.purpose !== 'password-reset') {
        throw new UnauthorizedException('Invalid reset token');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user || user.passwordResetToken !== token) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }

      // Hashear nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Actualizar contraseña y limpiar token de reset
      await this.usersService.updatePassword(user.id, hashedPassword);
      await this.usersService.updatePasswordResetToken(user.id, null);

      return { message: 'Password has been reset successfully' };
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }
}
