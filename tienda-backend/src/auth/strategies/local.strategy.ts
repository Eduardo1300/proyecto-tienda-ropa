import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    console.log('🔐 LocalStrategy.validate called with email:', email);
    
    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      console.log('🚫 LocalStrategy: Authentication failed for email:', email);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    console.log('✅ LocalStrategy: Authentication successful for email:', user.email);
    return user;
  }
}
