"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const products_service_1 = require("../src/products/products.service");
const users_service_1 = require("../src/users/users.service");
const order_service_1 = require("../src/ordenes/order.service");
const reviews_service_1 = require("../src/reviews/reviews.service");
const wishlist_service_1 = require("../src/products/services/wishlist.service");
const bcrypt = require("bcrypt");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const productsService = app.get(products_service_1.ProductsService);
    const usersService = app.get(users_service_1.UsersService);
    const ordersService = app.get(order_service_1.OrderService);
    const reviewsService = app.get(reviews_service_1.ReviewsService);
    const wishlistService = app.get(wishlist_service_1.WishlistService);
    console.log('🌱 Starting database seeding...');
    try {
        console.log('👥 Creating users...');
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
        }
        else {
            console.log('👤 Admin user already exists');
        }
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
        }
        else {
            console.log('👤 Test user already exists');
        }
        const existingProducts = await productsService.findAll();
        if (existingProducts.length === 0) {
            console.log('📦 No products found, creating sample products...');
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
        }
        else {
            console.log(`📦 Found ${existingProducts.length} products already in database`);
        }
        console.log('🛒 Creating orders...');
        const adminUser = await usersService.findByEmail('admin@example.com');
        const testUser = await usersService.findByEmail('user@example.com');
        console.log('Admin user ID:', adminUser?.id);
        console.log('Test user ID:', testUser?.id);
        const mockOrders = [
            {
                orderNumber: 'ORD001',
                status: 'pending',
                total: 159.97,
                userId: testUser?.id || 2,
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
                userId: adminUser?.id || 1,
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
        console.log('⭐ Creating reviews...');
        const mockReviews = [
            {
                rating: 5,
                comment: 'Excelente producto, muy recomendado.',
                title: 'Gran calidad',
                userId: testUser?.id || 2,
                productId: 1,
                createdAt: new Date(),
            },
            {
                rating: 4,
                comment: 'Buena calidad, pero el envío fue lento.',
                title: 'Satisfecho',
                userId: adminUser?.id || 1,
                productId: 2,
                createdAt: new Date(),
            },
        ];
        for (const reviewData of mockReviews) {
            const existingReview = await reviewsService.findByUserAndProduct(reviewData.userId, reviewData.productId);
            if (!existingReview) {
                await reviewsService.create(reviewData.userId, reviewData);
                console.log(`✅ Created review for product ID: ${reviewData.productId}`);
            }
            else {
                console.log(`⚠️ Review already exists for user ID: ${reviewData.userId} and product ID: ${reviewData.productId}`);
            }
        }
        console.log('💖 Creating wishlists...');
        const mockWishlists = [
            {
                userId: testUser?.id || 2,
                productId: 3,
                createdAt: new Date(),
            },
            {
                userId: adminUser?.id || 1,
                productId: 4,
                createdAt: new Date(),
            },
        ];
        for (const wishlistData of mockWishlists) {
            await wishlistService.addToWishlist(wishlistData.userId, wishlistData);
            console.log(`✅ Added product ID: ${wishlistData.productId} to wishlist for user ID: ${wishlistData.userId}`);
        }
        console.log('🎉 Database seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error during seeding:', error);
    }
    finally {
        await app.close();
    }
}
seed();
//# sourceMappingURL=seed.js.map