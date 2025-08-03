import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/Product';


const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:3002/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error loading products:', error));
  }, []);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Featured Products 🛍️
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <p className="text-green-600 font-bold text-lg mb-4">S/ {product.price.toFixed(2)}</p>

              <button
                onClick={() =>{
                    console.log('🛒 Click on Add to cart:', product);
                
                    addToCart({
                        ...product,
                        quantity: 1
                    } as Product & { quantity: number })
                    }}

                className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-full transition"
              >
                Add to cart 🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
