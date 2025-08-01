import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class CarritoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (usuario) => usuario.carrito)
  usuario: User;

  @ManyToOne(() => Producto)
  producto: Producto;

  @Column()
  cantidad: number;
}
