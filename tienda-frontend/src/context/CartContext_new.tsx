import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  id: string | number;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number | string) => Promise<void>;
  updateQuantity: (productId: number | string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  syncWithBackend: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        setCart([]);
      }
    }
    setIsInitialized(true);
  }, []);

  // Sincronizar con backend cuando el usuario se autentique y el carrito esté inicializado
  useEffect(() => {
    if (user && isInitialized) {
      syncWithBackend();
    } else if (!user && isInitialized) {
      // Si no hay usuario, asegurar que el carrito se mantenga en localStorage
    }
  }, [user, isInitialized]);

  // Guardar en localStorage cada vez que el carrito cambie (solo después de inicializar)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const syncWithBackend = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Obtener carrito del backend
      const backendResponse = await cartAPI.getByUserId(user.id);
      const backendCart = Array.isArray(backendResponse?.data?.data) ? backendResponse.data.data : 
                         Array.isArray(backendResponse?.data) ? backendResponse.data : [];
      

      // Crear mapa para combinar items
      const mergedItems = new Map();

      // Agregar items del backend al mapa
      backendCart.forEach((item: any) => {
        const productId = item.product?.id || item.productId;
        const product = item.product || {
          id: productId,
          name: item.name || 'Producto',
          price: item.price || 0,
          image: item.imageUrl || item.image || ''
        };
        
        mergedItems.set(productId, {
          id: item.id || `backend-${productId}`,
          product,
          quantity: item.quantity || 1
        });
      });

      // Procesar items del carrito local
      for (const localItem of cart) {
        const productId = localItem.product.id;
        
        if (!mergedItems.has(productId)) {
          // Item solo existe local, agregarlo al backend
          try {
            // Crear el objeto que espera la API (solo productId, quantity, userId)
            const backendCartItem = {
              productId: localItem.product.id,
              quantity: localItem.quantity,
              userId: user.id
            };
            await cartAPI.addItem(backendCartItem);
            
            mergedItems.set(productId, {
              id: `local-${productId}`,
              product: localItem.product,
              quantity: localItem.quantity
            });
          } catch (error) {
            // Si falla, mantener el item local
            mergedItems.set(productId, localItem);
          }
        } else {
          // Item existe en ambos, usar la cantidad del local si es mayor
          const existingItem = mergedItems.get(productId);
          if (localItem.quantity > existingItem.quantity) {
            existingItem.quantity = localItem.quantity;
          }
        }
      }

      // Convertir el mapa a array y actualizar estado
      const finalCart = Array.from(mergedItems.values());
      setCart(finalCart);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      setLoading(true);
      
      // Buscar si el producto ya existe en el carrito
      const existingItem = cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Si existe, actualizar cantidad
        await updateQuantity(product.id, existingItem.quantity + quantity);
      } else {
        // Si no existe, crear nuevo item
        const newItem: CartItem = {
          id: `temp-${Date.now()}-${product.id}`,
          product,
          quantity
        };
        
        // Actualizar estado local primero
        setCart(prevCart => [...prevCart, newItem]);
        
        // Si hay usuario, sincronizar con backend
        if (user) {
          try {
            const backendCartItem = {
              productId: product.id,
              quantity,
              userId: user.id
            };
            await cartAPI.addItem(backendCartItem);
          } catch (error) {
          }
        }
      }
      
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number | string) => {
    try {
      setLoading(true);
      
      // Encontrar el item en el carrito
      const itemToRemove = cart.find(item => item.product.id === productId);
      
      // Actualizar estado local primero
      setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
      
      // Si hay usuario y el item existe, remover del backend
      if (user && itemToRemove && typeof itemToRemove.id === 'number') {
        try {
          await cartAPI.removeItem(itemToRemove.id);
        } catch (error) {
        }
      }
      
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      
      // Actualizar estado local primero
      setCart(prevCart => 
        prevCart.map(item => 
          item.product.id === productId 
            ? { ...item, quantity } 
            : item
        )
      );
      
      // Para updates de cantidad, simplemente mantener la sincronización en próximo login
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      
      // Limpiar estado local primero
      setCart([]);
      
      // Si hay usuario, limpiar backend (remover cada item)
      if (user) {
        try {
          // Remover todos los items del carrito actual
          const currentCart = [...cart];
          for (const item of currentCart) {
            if (typeof item.id === 'number') {
              await cartAPI.removeItem(item.id);
            }
          }
        } catch (error) {
        }
      }
      
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        syncWithBackend
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
