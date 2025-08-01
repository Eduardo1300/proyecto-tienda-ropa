import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/entities/user.entity';
import { CarritoItem } from 'src/carrito/entities/carrito-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(CarritoItem) private carritoRepo: Repository<CarritoItem>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async crearOrden(dto: CreateOrderDto): Promise<Order> {
    const usuario = await this.userRepo.findOne({ where: { id: dto.usuarioId } });
    const carrito = await this.carritoRepo.find({
      where: { usuario: { id: dto.usuarioId } },
      relations: ['producto'],
    });

    if (!usuario || carrito.length === 0) {
      throw new Error('Usuario no válido o carrito vacío');
    }

    const items: OrderItem[] = carrito.map(item => {
      const orderItem = this.orderItemRepo.create({
        producto: item.producto,
        cantidad: item.cantidad,
        precio: Number(item.producto.precio),
      });
      return orderItem;
    });

    const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const orden = this.orderRepo.create({
      usuario,
      items,
      total,
    });

    // Guardar la orden
    const savedOrder = await this.orderRepo.save(orden);

    // Vaciar carrito (opcional)
    await this.carritoRepo.remove(carrito);

    return savedOrder;
  }
}
