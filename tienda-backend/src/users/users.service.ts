import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Crear usuario con contraseña encriptada
  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('🆕 UsersService.create called with:', { email: createUserDto.email, username: createUserDto.username });
    
    // Normalizar email: trim y toLowerCase
    const normalizedEmail = createUserDto.email.trim().toLowerCase();
    
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const user = this.userRepository.create({
      username: createUserDto.username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      firstName: createUserDto.firstName?.trim(),
      lastName: createUserDto.lastName?.trim(),
      role: createUserDto.role || 'customer', // Asignar rol o 'customer' por defecto
    });

    const savedUser = await this.userRepository.save(user);
    console.log('✅ User created successfully with ID:', savedUser.id, 'email:', normalizedEmail);
    return savedUser;
  }

  // Buscar por email
  async findByEmail(email: string): Promise<User | null> {
    // Normalizar email: trim y toLowerCase
    const normalizedEmail = email.trim().toLowerCase();
    console.log('🔍 UsersService.findByEmail called with email:', email, '-> normalized:', normalizedEmail);
    
    const user = await this.userRepository.findOne({
      where: { email: normalizedEmail },
      select: ['id', 'username', 'email', 'password', 'role', 'refreshToken', 'passwordResetToken', 'firstName', 'lastName'],
    });
    
    console.log('📝 User found:', user ? 'YES' : 'NO');
    if (user) {
      console.log('👤 User details:', { 
        id: user.id, 
        email: user.email, 
        username: user.username,
        hasPassword: !!user.password 
      });
    }
    return user;
  }

  // Buscar por username
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  // Buscar por ID
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'username', 'email', 'password', 'role', 'refreshToken', 'passwordResetToken'],
    });
  }

  // Actualizar refresh token
  async updateRefreshToken(
    userId: number,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  // Eliminar refresh token
  async removeRefreshToken(userId: number): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  // Actualizar usuario
  async update(id: number, updateData: Partial<User>): Promise<void> {
    await this.userRepository.update(id, updateData);
  }

  // Actualizar token de reset de contraseña
  async updatePasswordResetToken(
    userId: number,
    resetToken: string | null,
  ): Promise<void> {
    await this.userRepository.update(userId, { passwordResetToken: resetToken });
  }

  // Actualizar contraseña
  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: hashedPassword });
  }
}
