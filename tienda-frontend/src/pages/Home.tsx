import { useEffect, useState } from "react";
import axios from "axios";
import { useCarrito } from "../context/CarritoContext";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}



const Home = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    axios
      .get("http://localhost:3000/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  return (
    <section className="p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados 🛍️</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{producto.nombre}</h3>
              <p className="text-sm text-gray-600">{producto.descripcion}</p>
              <p className="text-lg font-bold mt-2">S/ {producto.precio.toFixed(2)}</p>
              <button
                onClick={() => agregarAlCarrito(producto)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                Añadir al carrito
               </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;
