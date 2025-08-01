import { useContext, useEffect, useState } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import { useParams } from 'react-router-dom';

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string; // ✅ agregamos imagen porque el context lo requiere
};

const DetalleProducto = () => {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const carritoContext = useContext(CarritoContext);

  useEffect(() => {
    fetch(`http://localhost:3000/productos/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data))
      .catch(err => console.error('Error al cargar el producto:', err));
  }, [id]);

  const handleAgregar = () => {
    if (producto && carritoContext) {
        carritoContext.agregarAlCarrito(producto); // ✅ corregido
  }
 };


  if (!producto) {
    return <div className="text-center mt-20 text-xl">Cargando producto...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <img src={producto.imagen} alt={producto.nombre} className="w-full h-64 object-cover rounded-lg mb-4" />
      <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>
      <p className="text-gray-600 mb-4">{producto.descripcion}</p>
      <p className="text-xl font-semibold mb-6">Precio: S/ {producto.precio.toFixed(2)}</p>
      <button
        onClick={handleAgregar}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Añadir al carrito
      </button>
    </div>
  );
};

export default DetalleProducto;
