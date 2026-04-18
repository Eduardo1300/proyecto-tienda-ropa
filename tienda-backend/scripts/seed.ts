import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ProductsService } from '../src/products/products.service';
import { UsersService } from '../src/users/users.service';
import { OrderService } from '../src/ordenes/order.service';
import { ReviewsService } from '../src/reviews/reviews.service';
import { WishlistService } from '../src/products/services/wishlist.service';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);
  const usersService = app.get(UsersService);
  const ordersService = app.get(OrderService);
  const reviewsService = app.get(ReviewsService);
  const wishlistService = app.get(WishlistService);

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
    if (existingProducts.length === 0) {
      console.log('📦 No products found, creating sample products...');
      // Productos de ejemplo
      const mockProducts = [
        {
          name: 'Camiseta Básica Blanca',
          description: 'Camiseta 100% algodón, cómoda y versátil para uso diario',
          price: 29.99,
          stock: 50,
          category: 'hombre',
          imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
          isActive: true
        },
        {
          name: 'Vestido Elegante Negro',
          description: 'Vestido perfecto para ocasiones especiales y eventos formales',
          price: 89.99,
          stock: 25,
          category: 'mujer',
          imageUrl: 'https://images.unsplash.com/photo-1566479179817-c0cede0c15b6?w=400&h=400&fit=crop&crop=center',
          isActive: true
        },
        {
          name: 'Jeans Clásicos',
          description: 'Jeans de corte clásico, cómodos y duraderos',
          price: 59.99,
          stock: 30,
          category: 'hombre',
          imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center',
          isActive: true
        },
        {
          name: 'Blusa Floral',
          description: 'Blusa con estampado floral, perfecta para la primavera',
          price: 45.99,
          stock: 20,
          category: 'mujer',
          imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center',
          isActive: true
        },
        {
          name: 'Zapatillas Deportivas',
          description: 'Zapatillas cómodas para ejercicio y uso casual',
          price: 79.99,
          stock: 40,
          category: 'zapatos',
          imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
          isActive: true
        },
        {
          name: 'Bolso de Cuero',
          description: 'Bolso elegante de cuero genuino con múltiples compartimentos',
          price: 129.99,
          stock: 15,
          category: 'accesorios',
          imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center',
          isActive: true
        },
        {
          name: 'Chaqueta Denim',
          description: 'Chaqueta de mezclilla clásica, perfecta para cualquier temporada',
          price: 69.99,
          stock: 35,
          category: 'hombre',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center',
          isActive: true
        },
        {
          name: 'Falda Midi',
          description: 'Falda midi elegante y versátil para oficina o casual',
          price: 39.99,
          stock: 28,
          category: 'mujer',
          imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=400&h=400&fit=crop&crop=center',
          isActive: true
        }
      ];

      console.log('📦 Creating products...');
      for (const productData of mockProducts) {
        await productsService.create(productData);
        console.log(`✅ Created: ${productData.name}`);
      }

      console.log(`📊 Total products created: ${mockProducts.length}`);
    } else {
      console.log(`📦 Found ${existingProducts.length} products already in database`);
    }

    // Crear órdenes de ejemplo
    console.log('🛒 Creating orders...');
    
    // Obtener IDs reales de los usuarios creados
    const adminUser = await usersService.findByEmail('admin@example.com');
    const testUser = await usersService.findByEmail('user@example.com');
    
    console.log('Admin user ID:', adminUser?.id);
    console.log('Test user ID:', testUser?.id);
    
    const mockOrders = [
      {
        orderNumber: 'ORD001',
        status: 'pending',
        total: 159.97,
        userId: testUser?.id || 2, // user@example.com
        createdAt: new Date(),
        items: [
          { productId: 1, quantity: 2, price: 29.99 },
          { productId: 2, quantity: 1, price: 89.99 },
        ],
        shippingAddress: '123 Main St, City, Country',
        billingAddress: '123 Main St, City, Country',
        shippingCost: 5.99,
      },
      {
        orderNumber: 'ORD002',
        status: 'shipped',
        total: 89.99,
        userId: adminUser?.id || 1, // admin@example.com
        createdAt: new Date(),
        items: [
          { productId: 3, quantity: 1, price: 59.99 },
        ],
        shippingAddress: '456 Elm St, City, Country',
        billingAddress: '456 Elm St, City, Country',
        shippingCost: 7.49,
      },
    ];

    for (const orderData of mockOrders) {
      await ordersService.createOrder(orderData);
      console.log(`✅ Created order: ${orderData.orderNumber}`);
    }

// Crear reseñas de ejemplo
    console.log('⭐ Creating reviews...');
    
    // Get all products
    const allProducts = await productsService.findAll();
    
    // Use TypeORM directly with a simple connection
    const DataSource = require('typeorm').DataSource;
    const databaseUrl = process.env.DATABASE_URL;
    
    let dataSource: any;
    if (databaseUrl) {
      dataSource = new DataSource({
        type: 'postgres',
        url: databaseUrl,
        synchronize: false,
        ssl: { rejectUnauthorized: false },
        entities: [__dirname + '/../src/**/*.entity.ts'],
      });
    } else {
      dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'tienda_ropa',
        synchronize: false,
        entities: [__dirname + '/../src/**/*.entity.ts'],
      });
    }
    
    await dataSource.initialize();
    const reviewRepository = dataSource.getRepository('Review');
    
    // Delete existing reviews first
    await reviewRepository.query('DELETE FROM reviews');
    console.log('🗑️ Deleted existing reviews');
    
    // Sample review data
    const reviewTemplates = [
      { rating: 5, title: 'Excelente producto', comment: 'Muy buena calidad, me encantó. Lo recomiendo totalmente.', isVerified: true },
      { rating: 4, title: 'Muy bueno', comment: 'Buena relación precio-calidad. El material es bueno.', isVerified: true },
      { rating: 5, title: 'Perfecto para mí', comment: 'Exactamente lo que buscaba. El tamaño es correcto y la tela es muy cómoda.', isVerified: true },
      { rating: 3, title: 'Bueno pero', comment: 'El producto está bien, pero el envío tardó más de lo esperado.', isVerified: false },
      { rating: 5, title: 'Increíble', comment: 'Superó mis expectativas. La calidad es premium y el diseño es moderno.', isVerified: true },
      { rating: 4, title: 'Recomendable', comment: 'Buen producto, lo volvería a comprar. El color es exactamente como en la foto.', isVerified: true },
      { rating: 5, title: 'Lo amo', comment: 'Perfecto para mi guardarropa. Muy versátil y fácil de combinar.', isVerified: true },
      { rating: 2, title: 'No me convenció', comment: 'La tela es más delgada de lo que esperaba. Pero el estilo está bien.', isVerified: false },
      { rating: 5, title: 'Mejor compra', comment: 'Sin duda la mejor compra del año. La calidad es excepcional.', isVerified: true },
      { rating: 4, title: 'Buena opción', comment: 'Buen producto, llegó en perfecto estado. El empaque era muy seguro.', isVerified: true },
    ];

    // Create 3-5 reviews for each product
    for (const product of allProducts) {
      const numReviews = Math.floor(Math.random() * 3) + 3; // 3-5 reviews
      
      for (let i = 0; i < numReviews; i++) {
        const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        
        // Alternate between users
        const userId = i % 2 === 0 ? testUser?.id : adminUser?.id;
        
        // Check if review already exists
        const existingReview = await reviewRepository.findOne({
          where: { userId: userId || 2, productId: product.id }
        });
        
        if (!existingReview) {
          // Generate random date within last 90 days
          const randomDate = new Date();
          randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));
          
          // Ensure proper date format
          const dateString = randomDate.toISOString();
          
          await reviewRepository.query(
            `INSERT INTO reviews (rating, title, comment, "userId", "productId", "isVerified", "isActive", "purchaseVerified", "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)`,
            [
              template.rating,
              template.title,
              template.comment,
              userId || 2,
              product.id,
              template.isVerified,
              true,
              template.isVerified,
              dateString
            ]
          );
        }
      }
    }
    
    // Update all products with review count and average rating
    console.log('📊 Updating product review stats...');
    for (const product of allProducts) {
      const reviews = await reviewRepository.find({ 
        where: { productId: product.id, isActive: true }
      });
      
      const totalReviews = reviews.length;
      const avgRating = totalReviews > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0;
      
      await productsService.update(product.id, {
        reviewCount: totalReviews,
        averageRating: Math.round(avgRating * 100) / 100
      } as any);
    }

    await dataSource.destroy();
    console.log('✅ Reviews created for all products');

    // Crear listas de deseos de ejemplo
    console.log('💖 Creating wishlists...');
    const mockWishlists = [
      {
        userId: testUser?.id || 2, // user@example.com
        productId: 3, // Jeans Clásicos
        createdAt: new Date(),
      },
      {
        userId: adminUser?.id || 1, // admin@example.com
        productId: 4, // Blusa Floral
        createdAt: new Date(),
      },
    ];

    for (const wishlistData of mockWishlists) {
      await wishlistService.addToWishlist(wishlistData.userId, wishlistData);
      console.log(`✅ Added product ID: ${wishlistData.productId} to wishlist for user ID: ${wishlistData.userId}`);
    }

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

seed();
