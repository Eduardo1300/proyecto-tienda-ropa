import React from 'react';

type ProductProps = {
  title: string;
  price: number;
  image: string;
};

const ProductCard: React.FC<ProductProps> = ({ title, price, image }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-xs">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-xl" />
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-blue-600 text-xl font-bold">S/ {price.toFixed(2)}</p>
      <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
        Añadir al carrito
      </button>
    </div>
  );
};

export default ProductCard;
