import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarritoItem } from './entities/carrito-item.entity';
import { CreateCarritoItemDto } from './dto/create-carrito-item.dto';
import { Producto } from 'src/productos/entities/producto.entity';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common'; 

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(CarritoItem)
    private carritoRepository: Repository<CarritoItem>,
    
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,

    @InjectRepository(User)
    private usuarioRepository: Repository<User>,
  ) {}

  async agregarAlCarrito(dto: CreateCarritoItemDto): Promise<CarritoItem> {
    const usuario = await this.usuarioRepository.findOneBy({ id: dto.usuarioId });
    const producto = await this.productoRepository.findOneBy({ id: dto.productoId });

    if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
    }

    if (!producto) {
    throw new NotFoundException('Producto no encontrado');
    }

    const item = this.carritoRepository.create({
      usuario,
      producto,
      cantidad: dto.cantidad,
    });

    return this.carritoRepository.save(item);
  }

  async obtenerCarrito(usuarioId: number): Promise<CarritoItem[]> {
    return this.carritoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['producto'],
    });
  }

  async eliminarDelCarrito(id: number): Promise<void> {
  const item = await this.carritoRepository.findOne({ where: { id } });
  if (!item) {
    throw new NotFoundException('Producto en carrito no encontrado');
  }
  await this.carritoRepository.remove(item);
  }
}
