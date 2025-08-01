import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoController } from './carrito.controller';
import { CarritoService } from './carrito.service';
import { CarritoItem } from './entities/carrito-item.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarritoItem, Producto, User])],
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule {}
