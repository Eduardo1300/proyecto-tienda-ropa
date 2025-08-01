import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { ProductosModule } from './productos/productos.module';
import { CarritoModule } from './carrito/carrito.module';
import { OrderModule } from './ordenes/order.module'; // 👈 Asegúrate de que el path sea correcto


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
        autoLoadEntities: true,
        synchronize: true, // Solo para desarrollo
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    AdminModule,
    ProductosModule,
    CarritoModule,
    OrderModule,
  ],
})
export class AppModule {}
