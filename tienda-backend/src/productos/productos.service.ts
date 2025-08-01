import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  private productos: Producto[] = [];
  private idCounter = 1;

  create(createProductoDto: CreateProductoDto): Producto {
    const nuevoProducto: Producto = {
      id: this.idCounter++,
      ...createProductoDto,
    };
    this.productos.push(nuevoProducto);
    return nuevoProducto;
  }

  findAll(): Producto[] {
    return this.productos;
  }

  findOne(id: number): Producto {
    const producto = this.productos.find(p => p.id === id);
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }
    
  update(id: number, updateProductoDto: UpdateProductoDto): Producto {
    const index = this.productos.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    const productoActualizado: Producto = {
      ...this.productos[index],
      ...updateProductoDto,
    };

    this.productos[index] = productoActualizado;
    return productoActualizado;
  }

  remove(id: number): Producto {
    const index = this.productos.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    const productoEliminado = this.productos[index];
    this.productos.splice(index, 1);
    return productoEliminado;
  }
}
