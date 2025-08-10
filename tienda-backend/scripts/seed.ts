import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ProductsService } from '../src/products/products.service';
import { UsersService } from '../src/users/users.service';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);
  const usersService = app.get(UsersService);

  console.log('🌱 Starting database seeding...');

  try {
    // Crear usuarios admin y de prueba
    console.log('👥 Creating users...');
    
    // Verificar si el admin ya existe
    const existingAdmin = await usersService.findByEmail('admin@example.com');
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await usersService.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
      console.log('✅ Created admin user: admin@example.com');
    } else {
      console.log('👤 Admin user already exists');
    }

    // Crear usuario de prueba
    const existingUser = await usersService.findByEmail('user@example.com');
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await usersService.create({
        username: 'testuser',
        email: 'user@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      });
      console.log('✅ Created test user: user@example.com');
    } else {
      console.log('👤 Test user already exists');
    }

    // Verificar si ya existen productos
    const existingProducts = await productsService.findAll();
    if (existingProducts.length > 0) {
      console.log('📦 Products already exist in database');
      // Productos de ejemplo
      const mockProducts = [
        {
          name: 'Camiseta Básica Blanca',
          description: 'Camiseta 100% algodón, cómoda y versátil para uso diario',
          price: 29.99,
          stock: 50,
          category: 'hombre',
          imageUrl: 'https://via.placeholder.com/400x400/6366f1/ffffff?text=Camiseta',
          isActive: true
        },
        {
          name: 'Vestido Elegante Negro',
          description: 'Vestido perfecto para ocasiones especiales y eventos formales',
          price: 89.99,
          stock: 25,
          category: 'mujer',
          imageUrl: 'https://via.placeholder.com/400x400/ec4899/ffffff?text=Vestido',
          isActive: true
        },
        {
          name: 'Jeans Clásicos',
          description: 'Jeans de corte clásico, cómodos y duraderos',
          price: 59.99,
          stock: 30,
          category: 'hombre',
          imageUrl: 'https://via.placeholder.com/400x400/3b82f6/ffffff?text=Jeans',
          isActive: true
        },
        {
          name: 'Blusa Floral',
          description: 'Blusa con estampado floral, perfecta para la primavera',
          price: 45.99,
          stock: 20,
          category: 'mujer',
          imageUrl: 'https://via.placeholder.com/400x400/f59e0b/ffffff?text=Blusa',
          isActive: true
        },
        {
          name: 'Zapatillas Deportivas',
          description: 'Zapatillas cómodas para ejercicio y uso casual',
          price: 79.99,
          stock: 40,
          category: 'zapatos',
          imageUrl: 'https://via.placeholder.com/400x400/10b981/ffffff?text=Zapatillas',
          isActive: true
        },
        {
          name: 'Bolso de Cuero',
          description: 'Bolso elegante de cuero genuino con múltiples compartimentos',
          price: 129.99,
          stock: 15,
          category: 'accesorios',
          imageUrl: 'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Bolso',
          isActive: true
        },
        {
          name: 'Chaqueta Denim',
          description: 'Chaqueta de mezclilla clásica, perfecta para cualquier temporada',
          price: 69.99,
          stock: 35,
          category: 'hombre',
          imageUrl: 'https://via.placeholder.com/400x400/6366f1/ffffff?text=Chaqueta',
          isActive: true
        },
        {
          name: 'Falda Midi',
          description: 'Falda midi elegante y versátil para oficina o casual',
          price: 39.99,
          stock: 28,
          category: 'mujer',
          imageUrl: 'https://via.placeholder.com/400x400/ec4899/ffffff?text=Falda',
          isActive: true
        }
      ];

      console.log('📦 Creating products...');
      for (const productData of mockProducts) {
        await productsService.create(productData);
        console.log(`✅ Created: ${productData.name}`);
      }

      console.log(`📊 Total products created: ${mockProducts.length}`);
    }

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

seed();
