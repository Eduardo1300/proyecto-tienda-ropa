import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const productsService = app.get(ProductsService);
  const dataSource = app.get(DataSource);

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

    // Crear productos reales de tienda de ropa
    const products = [
      // ROPA PARA HOMBRE
      {
        name: 'Camiseta Premium Algodón',
        description: 'Camiseta de algodón 100% premium, súper suave y cómoda. Perfecta para el día a día. Disponible en varios colores.',
        price: 29.95,
        stock: 150,
        category: 'hombre',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Polo Manga Larga Casual',
        description: 'Polo de manga larga en algodón suave. Ideal para un look casual-elegante. Corte regular fit.',
        price: 39.90,
        stock: 80,
        category: 'hombre',
        imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Camisa Formal Algodón',
        description: 'Camisa formal de algodón premium. Perfecta para la oficina o eventos especiales. Corte slim fit.',
        price: 59.95,
        stock: 60,
        category: 'hombre',
        imageUrl: 'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Jeans Slim Fit Azul',
        description: 'Jeans de mezclilla premium con corte slim fit. Cómodos y versátiles para cualquier ocasión.',
        price: 79.90,
        stock: 100,
        category: 'hombre',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Chaqueta Casual Moderna',
        description: 'Chaqueta ligera perfecta para entretiempo. Diseño moderno y versátil que combina con todo.',
        price: 129.90,
        stock: 40,
        category: 'hombre',
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&crop=center',
      },

      // ROPA PARA MUJER
      {
        name: 'Blusa Elegante Seda',
        description: 'Blusa de seda natural con corte elegante. Perfecta para la oficina o ocasiones especiales.',
        price: 89.95,
        stock: 70,
        category: 'mujer',
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Vestido Casual Verano',
        description: 'Vestido ligero y fresco perfecto para el verano. Tela suave y diseño cómodo para el día a día.',
        price: 69.90,
        stock: 90,
        category: 'mujer',
        imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Falda Midi Elegante',
        description: 'Falda midi de corte elegante que estiliza la figura. Ideal para looks sofisticados.',
        price: 54.95,
        stock: 85,
        category: 'mujer',
        imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d14?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Jeans Skinny Mujer',
        description: 'Jeans skinny de mezclilla stretch que se adapta perfectamente al cuerpo. Muy cómodos.',
        price: 74.90,
        stock: 120,
        category: 'mujer',
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Cardigan Suave Lana',
        description: 'Cardigan de lana suave perfecto para días frescos. Diseño clásico y atemporal.',
        price: 95.90,
        stock: 50,
        category: 'mujer',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&crop=center',
      },

      // ACCESORIOS
      {
        name: 'Reloj Elegante Acero',
        description: 'Reloj de pulsera en acero inoxidable con diseño minimalista. Resistente al agua.',
        price: 149.95,
        stock: 30,
        category: 'accesorios',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Collar Plata Sterling',
        description: 'Collar elegante de plata sterling 925. Diseño clásico que combina con cualquier outfit.',
        price: 79.95,
        stock: 45,
        category: 'accesorios',
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Bolso Cuero Premium',
        description: 'Bolso de cuero genuino con acabados premium. Espacioso y elegante para el día a día.',
        price: 199.90,
        stock: 25,
        category: 'accesorios',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Gafas de Sol Polarizadas',
        description: 'Gafas de sol con lentes polarizadas y protección UV400. Marco resistente y elegante.',
        price: 119.95,
        stock: 60,
        category: 'accesorios',
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Cinturón Cuero Genuino',
        description: 'Cinturón de cuero genuino con hebilla de metal. Clásico y duradero para cualquier ocasión.',
        price: 45.90,
        stock: 80,
        category: 'accesorios',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&crop=center',
      },

      // ZAPATOS
      {
        name: 'Sneakers Deportivos Blancos',
        description: 'Zapatillas deportivas cómodas y versátiles. Perfectas para el día a día y actividades deportivas.',
        price: 89.95,
        stock: 100,
        category: 'zapatos',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Botas Chelsea Cuero',
        description: 'Botas Chelsea de cuero genuino. Elegantes y versátiles, perfectas para looks sofisticados.',
        price: 159.90,
        stock: 40,
        category: 'zapatos',
        imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e8b6b10263?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Zapatos Formales Oxford',
        description: 'Zapatos Oxford de cuero para ocasiones formales. Diseño clásico y construcción de calidad.',
        price: 179.95,
        stock: 35,
        category: 'zapatos',
        imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Sandalias Verano Mujer',
        description: 'Sandalias cómodas para el verano. Diseño elegante y suela acolchada para mayor confort.',
        price: 49.95,
        stock: 70,
        category: 'zapatos',
        imageUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=500&fit=crop&crop=center',
      },
      {
        name: 'Zapatillas Running Pro',
        description: 'Zapatillas especializadas para running con tecnología de amortiguación avanzada.',
        price: 139.95,
        stock: 55,
        category: 'zapatos',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&crop=center',
      }
    ];

    for (const productData of products) {
      await productsService.create(productData);
    }

    console.log('✅ Products created successfully');

    // Get all products to add reviews
    const allProducts = await productsService.findAll({});
    
    // Create reviews for products
    const reviewsData = [
      { rating: 5, title: 'Excelente producto', comment: 'Muy buena calidad, me encantó. Lo recomiendo totalmente.', isVerified: true },
      { rating: 4, title: 'Muy bueno', comment: 'Buena relación precio-calidad. El material es bueno.', isVerified: true },
      { rating: 5, title: 'Perfecto para mí', comment: 'Exactly lo que buscaba. El tamaño es correcto y la tela es muy cómoda.', isVerified: true },
      { rating: 3, title: 'Bueno pero', comment: 'El producto está bien, pero el envío tardó más de lo esperado.', isVerified: false },
      { rating: 5, title: 'Increíble', comment: 'Superó mis expectativas. La calidad es premium y el diseño es moderno.', isVerified: true },
      { rating: 4, title: 'Recomendable', comment: 'Buen producto, lo volvería a comprar. El color es exactamente como en la foto.', isVerified: true },
      { rating: 5, title: 'Lo amo', comment: 'Perfecto para mi guardarropa. Muy versátil y fácil de combinar.', isVerified: true },
      { rating: 2, title: 'No me convenció', comment: 'La tela es más delgada de lo que esperaba. Pero el estilo está bien.', isVerified: false },
      { rating: 5, title: 'Mejor compra', comment: 'Sin duda la mejor compra del año. La calidad es excepcional.', isVerified: true },
      { rating: 4, title: 'Buena opción', comment: 'Buen producto, llegò en perfecto estado. El empaque era muy seguro.', isVerified: true },
    ];

    const reviewRepository = dataSource.getRepository('Review');
    
    // Add 3-5 reviews to each product
    const productsList = allProducts.slice(0, 20);
    for (let i = 0; i < productsList.length; i++) {
      const product = productsList[i];
      const numReviews = Math.floor(Math.random() * 3) + 3; // 3-5 reviews per product
      
      for (let j = 0; j < numReviews; j++) {
        const reviewData = reviewsData[Math.floor(Math.random() * reviewsData.length)];
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90)); // Random date in last 90 days
        
        await reviewRepository.save({
          productId: product.id,
          userId: customerUser.id,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          isVerified: reviewData.isVerified,
          isActive: true,
          purchaseVerified: reviewData.isVerified,
          createdAt: randomDate,
        });
      }
      
      // Update product review count and average rating
      const reviews = await reviewRepository.find({ where: { productId: product.id, isActive: true } });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await productsService.update(product.id, {
        reviewCount: reviews.length,
        averageRating: Math.round(avgRating * 100) / 100,
      });
    }

    console.log('✅ Reviews created successfully');
    console.log('🎉 Database seed completed!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

void seed();
