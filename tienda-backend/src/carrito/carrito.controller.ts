import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CreateCarritoItemDto } from './dto/create-carrito-item.dto';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post()
  async agregar(@Body() dto: CreateCarritoItemDto) {
    return this.carritoService.agregarAlCarrito(dto);
  }

  @Get(':usuarioId')
  async obtener(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.carritoService.obtenerCarrito(usuarioId);
  }

  @Delete(':id')
async eliminar(@Param('id') id: string) {
  return this.carritoService.eliminarDelCarrito(Number(id));
}
}
