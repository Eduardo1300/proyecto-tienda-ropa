// Script para actualizar automáticamente las imágenes de todos los productos
// basándose en su nombre y categoría

import { productsAPI } from '../services/api';
import { getProductImage } from './productImages';

interface Product {
  id: number;
  name: string;
  category: string;
  imageUrl?: string;
  description: string;
  price: number;
}

/**
 * Actualiza automáticamente las imágenes de todos los productos
 * que no tienen imagen o cuya imagen no es apropiada
 */
export const updateProductImages = async (): Promise<void> => {
  try {
    
    // Obtener todos los productos
    const response = await productsAPI.getAll();
    const products: Product[] = response.data.data || response.data;
    
    
    let updatedCount = 0;
    
    for (const product of products) {
      try {
        // Generar una imagen apropiada
        const appropriateImage = getProductImage(product.name, product.category, product.imageUrl);
        
        // Solo actualizar si la imagen es diferente a la actual
        if (appropriateImage !== product.imageUrl) {
          
          // Actualizar el producto con la nueva imagen
          
          // Actualizar el producto con la nueva imagen
          await productsAPI.update(product.id, {
            imageUrl: appropriateImage
          });
          
          updatedCount++;
        }
      } catch (error) {
      }
    }
    
  } catch (error) {
    throw error;
  }
};

/**
 * Función para verificar qué productos necesitan actualización de imagen
 */
export const checkProductImages = async (): Promise<{ needUpdate: Product[], total: number }> => {
  try {
    const response = await productsAPI.getAll();
    const products: Product[] = response.data.data || response.data;
    
    const needUpdate = products.filter(product => {
      const appropriateImage = getProductImage(product.name, product.category, product.imageUrl);
      return appropriateImage !== product.imageUrl || !product.imageUrl || product.imageUrl.trim() === '';
    });
    
    return {
      needUpdate,
      total: products.length
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Mapeo de productos con palabras clave específicas
 * para casos especiales donde el nombre no es claro
 */
const productNameMappings: Record<string, { name: string, category: string }> = {
  'dsada': { name: 'Camiseta Básica', category: 'hombre' },
  'test': { name: 'Producto de Prueba', category: 'general' },
  'sample': { name: 'Muestra de Producto', category: 'general' },
};

/**
 * Normaliza nombres de productos que no son descriptivos
 */
export const normalizeProductName = (product: Product): { name: string, category: string } => {
  const normalizedName = product.name.toLowerCase().trim();
  
  // Buscar en mapeos específicos
  if (productNameMappings[normalizedName]) {
    return productNameMappings[normalizedName];
  }
  
  // Si el nombre es muy corto o no descriptivo, usar la categoría para generar un nombre
  if (product.name.length <= 5 || /^[a-z]{1,10}$/.test(normalizedName)) {
    const categoryNames: Record<string, string> = {
      'hombre': 'Camiseta para Hombre',
      'mujer': 'Blusa para Mujer',
      'zapatos': 'Zapatillas',
      'accesorios': 'Accesorio',
      'general': 'Producto'
    };
    
    return {
      name: categoryNames[product.category] || 'Producto',
      category: product.category
    };
  }
  
  return {
    name: product.name,
    category: product.category
  };
};

/**
 * Función para limpiar y normalizar todos los productos
 */
export const cleanupProductData = async (): Promise<void> => {
  try {
    
    const response = await productsAPI.getAll();
    const products: Product[] = response.data.data || response.data;
    
    let updatedCount = 0;
    
    for (const product of products) {
      try {
        const normalized = normalizeProductName(product);
        const appropriateImage = getProductImage(normalized.name, normalized.category);
        
        let needsUpdate = false;
        const updates: any = {};
        
        // Verificar si necesita actualizar el nombre
        if (normalized.name !== product.name) {
          updates.name = normalized.name;
          needsUpdate = true;
        }
        
        // Verificar si necesita actualizar la imagen
        if (appropriateImage !== product.imageUrl) {
          updates.imageUrl = appropriateImage;
          needsUpdate = true;
        }
        
        // Verificar si la descripción está vacía
        if (!product.description || product.description.trim() === '' || product.description === 'das') {
          updates.description = `${normalized.name} de alta calidad, cómodo y elegante. Perfecto para cualquier ocasión.`;
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await productsAPI.update(product.id, updates);
          updatedCount++;
        }
        
      } catch (error) {
      }
    }
    
  } catch (error) {
    throw error;
  }
};
