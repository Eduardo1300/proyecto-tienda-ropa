import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserAddress } from './entities/user-address.entity';
import { UserPreferences } from './entities/user-preferences.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { UpdatePreferencesDto } from './dto/preferences.dto';
import { 
  DashboardQueryDto, 
  OrderHistoryQueryDto, 
  UserDashboardResponse, 
  OrderHistoryResponse 
} from './dto/dashboard.dto';
import { Order } from '../ordenes/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CartItem } from '../carrito/entities/cart-item.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAddress)
    private readonly addressRepository: Repository<UserAddress>,
    @InjectRepository(UserPreferences)
    private readonly preferencesRepository: Repository<UserPreferences>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
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

  // Método getDashboard - obtener datos completos del dashboard del usuario
  async getDashboard(userId: number): Promise<UserDashboardResponse> {
    // Obtener usuario con relaciones necesarias
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wishlist', 'wishlist')
      .leftJoinAndSelect('wishlist.product', 'wishlistProduct')
      .leftJoinAndSelect('wishlistProduct.images', 'wishlistImages')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Obtener órdenes recientes
    const recentOrders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('product.images', 'images')
      .where('order.userId = :userId', { userId })
      .orderBy('order.createdAt', 'DESC')
      .limit(5)
      .getMany();

    // Obtener productos favoritos (más comprados)
    const favoriteProducts = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'items')
      .innerJoin('items.product', 'product')
      .leftJoin('product.images', 'images')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.discount',
        'images.url',
        'SUM(items.quantity) as totalPurchased'
      ])
      .where('order.userId = :userId', { userId })
      .groupBy('product.id, product.name, product.price, product.discount, images.url')
      .orderBy('totalPurchased', 'DESC')
      .limit(4)
      .getRawMany();

    // Obtener productos recientemente vistos (simulado con productos de órdenes recientes)
    const recentlyViewedProducts = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'items')
      .innerJoin('items.product', 'product')
      .leftJoin('product.images', 'images')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.discount',
        'images.url'
      ])
      .where('order.userId = :userId', { userId })
      .orderBy('order.createdAt', 'DESC')
      .limit(4)
      .getMany();

    // Calcular estadísticas
    const orderStats = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'COUNT(*) as totalOrders',
        'SUM(order.total) as totalSpent'
      ])
      .where('order.userId = :userId', { userId })
      .getRawOne();

    // Obtener pedidos pendientes
    const pendingOrders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.userId = :userId', { userId })
      .andWhere('order.status IN (:...statuses)', { 
        statuses: ['pending', 'processing', 'shipped'] 
      })
      .orderBy('order.createdAt', 'DESC')
      .getMany();

    // Preparar respuesta
    return {
      user: {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        email: user.email,
        avatarUrl: user.avatarUrl || undefined,
        loyaltyPoints: user.loyaltyPoints || 0,
        memberSince: user.createdAt,
      },
      stats: {
        totalOrders: parseInt(orderStats?.totalOrders) || 0,
        totalSpent: parseFloat(orderStats?.totalSpent) || 0,
        loyaltyPoints: user.loyaltyPoints || 0,
        wishlistItems: 0,
      },
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber || `ORD-${order.id}`,
        status: order.status,
        total: order.total,
        date: order.createdAt,
        itemCount: order.items?.length || 0,
      })),
      wishlist: [],
      favoriteProducts: favoriteProducts.map(item => ({
        id: item.product_id,
        name: item.product_name,
        price: item.product_price,
        discount: 0, // Product entity doesn't have discount property
        imageUrl: item.images_url || undefined,
        totalPurchased: parseInt(item.totalPurchased),
      })),
      recentlyViewed: recentlyViewedProducts.map(order => 
        order.items?.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          discount: 0, // Product entity doesn't have discount property
          imageUrl: item.product.images?.[0]?.url || undefined,
        }))
      ).flat().slice(0, 4) || [],
      pendingOrders: pendingOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber || `ORD-${order.id}`,
        status: order.status,
        total: order.total,
        date: order.createdAt,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 días
      })),
    };
  }

  // Método para obtener historial de órdenes con paginación
  async getOrderHistory(userId: number, page: number = 1, limit: number = 10): Promise<OrderHistoryResponse> {
    const skip = (page - 1) * limit;

    const [orders, total] = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('product.images', 'images')
      .where('order.userId = :userId', { userId })
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const pages = Math.ceil(total / limit);

    return {
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber || `ORD-${order.id}`,
        status: order.status,
        total: order.total,
        date: order.createdAt,
        items: order.items?.map(item => ({
          id: item.id,
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.product.images?.[0]?.url || undefined,
        })) || [],
      })),
      total,
      pages,
      currentPage: page,
    };
  }

  // ===================== DIRECCIONES =====================

  async createAddress(userId: number, createAddressDto: CreateAddressDto): Promise<UserAddress> {
    // Si isDefault es true, desactivar otros como default
    if (createAddressDto.isDefault) {
      await this.addressRepository.update(
        { user: { id: userId } },
        { isDefault: false }
      );
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      user: { id: userId } as any,
    });

    return await this.addressRepository.save(address);
  }

  async getAddresses(userId: number): Promise<UserAddress[]> {
    return await this.addressRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getAddress(userId: number, addressId: number): Promise<UserAddress> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('Dirección no encontrada');
    }

    return address;
  }

  async updateAddress(
    userId: number,
    addressId: number,
    updateAddressDto: UpdateAddressDto
  ): Promise<UserAddress> {
    const address = await this.getAddress(userId, addressId);

    // Si isDefault es true, desactivar otros como default
    if (updateAddressDto.isDefault) {
      await this.addressRepository.update(
        { user: { id: userId }, id: { $ne: addressId } as any },
        { isDefault: false }
      );
    }

    Object.assign(address, updateAddressDto);
    return await this.addressRepository.save(address);
  }

  async deleteAddress(userId: number, addressId: number): Promise<void> {
    const result = await this.addressRepository.delete({
      id: addressId,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Dirección no encontrada');
    }
  }

  async setDefaultAddress(userId: number, addressId: number): Promise<UserAddress> {
    // Desactivar todas las direcciones del usuario
    await this.addressRepository.update(
      { user: { id: userId } },
      { isDefault: false }
    );

    // Activar la nueva dirección como default
    const address = await this.getAddress(userId, addressId);
    address.isDefault = true;
    return await this.addressRepository.save(address);
  }

  // ===================== PREFERENCIAS =====================

  async getPreferences(userId: number): Promise<UserPreferences> {
    let preferences = await this.preferencesRepository.findOne({
      where: { user: { id: userId } },
    });

    // Si no existen, crear con valores por defecto
    if (!preferences) {
      preferences = this.preferencesRepository.create({
        user: { id: userId } as any,
      });
      preferences = await this.preferencesRepository.save(preferences);
    }

    return preferences;
  }

  async updatePreferences(
    userId: number,
    updatePreferencesDto: UpdatePreferencesDto
  ): Promise<UserPreferences> {
    let preferences = await this.getPreferences(userId);
    Object.assign(preferences, updatePreferencesDto);
    return await this.preferencesRepository.save(preferences);
  }

  async updateProfileInfo(
    userId: number,
    profileData: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      birthDate?: string;
      gender?: string;
      bio?: string;
    }
  ): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    Object.assign(user, profileData);
    return await this.userRepository.save(user);
  }
}

