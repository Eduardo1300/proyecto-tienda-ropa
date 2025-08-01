import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto)
  producto: Producto;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @ManyToOne(() => Order, order => order.items)
  order: Order;
}
