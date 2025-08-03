import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './carrito/carrito.module';
import { OrderModule } from './ordenes/order.module';

// Import entities explicitly
import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { CartItem } from './carrito/entities/cart-item.entity';
import { Order } from './ordenes/entities/order.entity';
import { OrderItem } from './ordenes/entities/order-item.entity';

@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configuración dinámica de TypeORM con variables .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Product, CartItem, Order, OrderItem],
        synchronize: true, // Solo para desarrollo
        // dropSchema: true, // ⚠️ Solo para desarrollo - comentado para preservar datos
        logging: true, // Para ver las consultas SQL
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    AdminModule,
    ProductsModule,
    CartModule,
    OrderModule,
  ],
})
export class AppModule {}
