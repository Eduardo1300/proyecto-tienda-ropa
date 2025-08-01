export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

export interface ProductoCarrito extends Producto {
  cantidad: number;
}
