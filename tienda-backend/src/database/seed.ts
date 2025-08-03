import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/products.service';

async function seedDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);

  const sampleProducts = [
    {
      name: 'Classic White T-Shirt',
      description: 'Comfortable 100% cotton white t-shirt, perfect for everyday wear',
      price: 29.99,
      image: 'https://via.placeholder.com/300x300/ffffff/000000?text=White+T-Shirt',
      stock: 100,
    },
    {
      name: 'Blue Denim Jeans',
      description: 'High-quality denim jeans with a modern slim fit',
      price: 79.99,
      image: 'https://via.placeholder.com/300x300/4169e1/ffffff?text=Blue+Jeans',
      stock: 50,
    },
    {
      name: 'Red Summer Dress',
      description: 'Elegant red dress perfect for summer occasions',
      price: 89.99,
      image: 'https://via.placeholder.com/300x300/dc143c/ffffff?text=Red+Dress',
      stock: 30,
    },
    {
      name: 'Black Leather Jacket',
      description: 'Premium leather jacket for a stylish and edgy look',
      price: 199.99,
      image: 'https://via.placeholder.com/300x300/000000/ffffff?text=Leather+Jacket',
      stock: 25,
    },
    {
      name: 'Comfortable Sneakers',
      description: 'Ultra-comfortable sneakers for daily activities',
      price: 119.99,
      image: 'https://via.placeholder.com/300x300/808080/ffffff?text=Sneakers',
      stock: 75,
    },
    {
      name: 'Elegant Evening Gown',
      description: 'Sophisticated evening gown for special occasions',
      price: 259.99,
      image: 'https://via.placeholder.com/300x300/800080/ffffff?text=Evening+Gown',
      stock: 15,
    }
  ];

  console.log('🌱 Starting database seed...');

  try {
    for (const productData of sampleProducts) {
      const product = await productsService.create(productData);
      console.log(`✅ Created product: ${product.name}`);
    }
    
    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await app.close();
  }
}

seedDatabase();
