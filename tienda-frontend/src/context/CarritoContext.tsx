// src/context/CarritoContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Producto } from "../types/Producto";





interface CarritoItem extends Producto {
  cantidad: number;
}

interface CarritoContextType {
  carrito: CarritoItem[];
  agregarAlCarrito: (producto: Producto) => void;
  eliminarDelCarrito: (id: number) => void;
  vaciarCarrito: () => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  }
  return context;
};

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => {
      const itemExistente = prev.find((item) => item.id === producto.id);
      if (itemExistente) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export { CarritoContext };
