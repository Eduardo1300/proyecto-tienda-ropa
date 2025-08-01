import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import "./index.css"; // Asegúrate de tener estilos globales si los usas

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* ✅ El contexto del carrito envuelve toda la app */}
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
