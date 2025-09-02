import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import type { Product } from '../types';
import { getProductImage } from '../utils/productImages';

interface CartItem {
  id: string | number;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (product: any, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number | string) => Promise<void>;
  updateQuantity: (productId: number | string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  syncWithBackend: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export { CartContext };

// Función helper para normalizar el formato del producto
const normalizeProduct = (product: any): Product => {
  return {
    id: product.id,
    name: product.name || 'Producto sin nombre',
    description: product.description || '',
    price: typeof product.price === 'number' ? product.price : 0,
    category: product.category || '',
    imageUrl: getProductImage(product.name || 'Producto sin nombre', product.category || '', product.imageUrl || product.image || '/placeholder.jpg')
  };
};

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
        console.log('🔄 Cart loaded from localStorage:', parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
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
      console.log('🔄 User logged out, cart will remain in localStorage');
    }
  }, [user, isInitialized]);

  // Guardar en localStorage cada vez que el carrito cambie (solo después de inicializar)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('💾 Cart saved to localStorage:', cart);
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
      
      console.log('📡 Backend cart response:', backendCart);
      console.log('🛒 Current local cart:', cart);

      // Crear mapa para combinar items
      const mergedItems = new Map();

      // Agregar items del backend al mapa
      backendCart.forEach((item: any) => {
        const productId = item.product?.id || item.productId;
        const product = item.product || {
          id: productId,
          name: item.name || 'Producto',
          description: item.description || '',
          price: item.price || 0,
          category: item.category || '',
          imageUrl: getProductImage(item.name || 'Producto', item.category || '', item.imageUrl || item.image || '')
        };
        
        mergedItems.set(productId, {
          id: item.id || `backend-${productId}`,
          product,
          quantity: item.quantity || 1
        });
      });

      // Procesar items del carrito local
      for (const localItem of cart) {
        if (!localItem.product?.id) continue; // Skip items without valid product
        
        const productId = localItem.product.id;
        
        if (!mergedItems.has(productId)) {
          // Item solo existe local, agregarlo al backend
          console.log('➕ Adding local item to backend:', localItem);
          try {
            // Crear el objeto que espera la API (solo los campos necesarios)
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
            console.error('Error adding local item to backend:', error);
            // Si falla, mantener el item local
            mergedItems.set(productId, localItem);
          }
        } else {
          // Item existe en ambos, usar la cantidad del local si es mayor
          const existingItem = mergedItems.get(productId);
          if (localItem.quantity > existingItem.quantity) {
            console.log('🔄 Local quantity is higher, keeping local quantity');
            existingItem.quantity = localItem.quantity;
          }
        }
      }

      // Convertir el mapa a array y actualizar estado
      const finalCart = Array.from(mergedItems.values());
      setCart(finalCart);
      console.log('✅ Cart synced and merged:', finalCart);
    } catch (error) {
      console.error('❌ Error syncing cart with backend:', error);
      console.log('🔄 Keeping local cart:', cart);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: any, quantity: number = 1) => {
    try {
      setLoading(true);
      
      // Normalizar el producto para asegurar formato correcto
      const normalizedProduct = normalizeProduct(product);
      
      // Buscar si el producto ya existe en el carrito
      const existingItem = cart.find(item => item.product?.id === normalizedProduct.id);
      
      if (existingItem) {
        // Si existe, actualizar cantidad
        await updateQuantity(normalizedProduct.id, existingItem.quantity + quantity);
      } else {
        // Si no existe, crear nuevo item
        const newItem: CartItem = {
          id: `temp-${Date.now()}-${normalizedProduct.id}`,
          product: normalizedProduct,
          quantity
        };
        
        // Actualizar estado local primero
        setCart(prevCart => [...prevCart, newItem]);
        
        console.log('🔍 New item added to cart:', newItem);
        console.log('🔍 Product object:', normalizedProduct);
        
        // Si hay usuario, sincronizar con backend
        if (user) {
          try {
            const backendCartItem = {
              productId: normalizedProduct.id,
              quantity,
              userId: user.id
            };
            await cartAPI.addItem(backendCartItem);
            console.log('✅ Item added to backend cart');
          } catch (error) {
            console.error('❌ Error adding item to backend:', error);
          }
        }
      }
      
      console.log('🛒 Product added to cart:', normalizedProduct.name);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number | string) => {
    try {
      setLoading(true);
      
      // Encontrar el item en el carrito
      const itemToRemove = cart.find(item => item.product?.id === productId);
      
      // Actualizar estado local primero
      setCart(prevCart => prevCart.filter(item => item.product?.id !== productId));
      
      // Si hay usuario y el item existe, remover del backend
      if (user && itemToRemove && typeof itemToRemove.id === 'number') {
        try {
          await cartAPI.removeItem(itemToRemove.id);
          console.log('✅ Item removed from backend cart');
        } catch (error) {
          console.error('❌ Error removing item from backend:', error);
        }
      }
      
      console.log('🗑️ Product removed from cart:', productId);
    } catch (error) {
      console.error('Error removing product from cart:', error);
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
          item.product?.id === productId 
            ? { ...item, quantity } 
            : item
        )
      );
      
      // Para updates de cantidad, simplemente mantener la sincronización en próximo login
      console.log('📊 Product quantity updated locally:', productId, quantity);
    } catch (error) {
      console.error('Error updating product quantity:', error);
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
          console.log('✅ Backend cart cleared');
        } catch (error) {
          console.error('❌ Error clearing backend cart:', error);
        }
      }
      
      console.log('🧹 Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
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
