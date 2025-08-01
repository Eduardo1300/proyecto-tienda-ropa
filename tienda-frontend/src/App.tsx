import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import CarritoPage from './pages/CarritoPage'; // usa este componente wrapper

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/producto/:id" element={<DetalleProducto />} />
      <Route path="/carrito" element={<CarritoPage />} />
    </Routes>
  );
}

export default App;
