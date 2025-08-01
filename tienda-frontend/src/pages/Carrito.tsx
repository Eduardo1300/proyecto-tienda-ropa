import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";


const Carrito = () => {
  const { carrito, eliminarDelCarrito } = useCarrito();

  const total = carrito.reduce((sum, producto) => sum + producto.precio, 0);

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">🛒 Tu Carrito</h2>

      {carrito.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay productos en el carrito.{" "}
          <Link to="/productos" className="text-blue-600 underline">
            Ver productos
          </Link>
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {carrito.map((producto, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                    <p className="text-sm text-gray-600">
                      S/ {producto.precio.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => eliminarDelCarrito(producto.id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-right">
            <p className="text-xl font-semibold">
              Total: S/ {total.toFixed(2)}
            </p>
            <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
              Proceder a pagar
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Carrito;
