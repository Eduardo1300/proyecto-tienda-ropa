import { useEffect, useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import type { Producto } from '../types/Producto';


const ProductList = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    fetch('http://localhost:3000/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error cargando productos:', error));
  }, []);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Productos Destacados 🛍️
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {productos.map(producto => (
          <div
            key={producto.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{producto.nombre}</h2>
              <p className="text-gray-600 text-sm mb-2">{producto.descripcion}</p>
              <p className="text-green-600 font-bold text-lg mb-4">S/ {producto.precio.toFixed(2)}</p>

              <button
                onClick={() =>{
                    console.log('🛒 Clic en Añadir al carrito:', producto);
                
                    agregarAlCarrito({
                        ...producto,
                        cantidad: 1
                    } as Producto & { cantidad: number })
                    }}

                className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-full transition"
              >
                Añadir al carrito 🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
