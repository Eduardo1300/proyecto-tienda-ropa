import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const productsService = app.get(ProductsService);

  try {
    console.log('🌱 Starting database seed...');

    // Crear usuarios de prueba
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminUser = await usersService.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
    });

    // Set admin role manually after creation
    await usersService.update(adminUser.id, { role: 'admin' });

    const customerUser = await usersService.create({
      username: 'customer',
      email: 'customer@example.com',
      password: hashedPassword,
      firstName: 'Customer',
      lastName: 'User',
    });

    console.log('✅ Users created:', { adminUser, customerUser });

    // Crear productos de prueba
    const products = [
      {
        name: 'Camiseta Básica',
        description: 'Camiseta de algodón 100%',
        price: 25.99,
        stock: 100,
        category: 'ropa',
        imageUrl: 'https://via.placeholder.com/300x400',
      },
      {
        name: 'Jeans Clásicos',
        description: 'Jeans de alta calidad',
        price: 59.99,
        stock: 50,
        category: 'ropa',
        imageUrl: 'https://via.placeholder.com/300x400',
      },
      {
        name: 'Zapatillas Deportivas',
        description: 'Zapatillas cómodas para deporte',
        price: 89.99,
        stock: 30,
        category: 'calzado',
        imageUrl: 'https://via.placeholder.com/300x400',
      },
    ];

    for (const productData of products) {
      await productsService.create(productData);
    }

    console.log('✅ Products created successfully');
    console.log('🎉 Database seed completed!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

void seed();
