import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getRepository } from 'typeorm';
import { AnalyticsEvent, EventType } from '../src/analytics/entities/analytics-event.entity';
import { LoyaltyProgram } from '../src/loyalty/entities/loyalty-program.entity';
import { LoyaltyTransaction, TransactionType, TransactionReason } from '../src/loyalty/entities/loyalty-transaction.entity';
import { User } from '../src/users/entities/user.entity';
import { Order } from '../src/ordenes/entities/order.entity';

async function generateTestData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const analyticsRepository = app.get('AnalyticsEventRepository');
  const loyaltyRepository = app.get('LoyaltyProgramRepository');
  const transactionRepository = app.get('LoyaltyTransactionRepository');
  const userRepository = app.get('UserRepository');
  const orderRepository = app.get('OrderRepository');

  console.log('🌱 Generating analytics and loyalty test data...');

  try {
    // Get test user
    const testUser = await userRepository.findOne({
      where: { email: 'admin@example.com' }
    });

    if (!testUser) {
      console.error('❌ Test user not found');
      return;
    }

    // Generate analytics events
    console.log('📊 Creating analytics events...');
    const events = [];
    const now = Date.now();

    // Page views
    for (let i = 0; i < 50; i++) {
      events.push({
        eventType: EventType.PAGE_VIEW,
        userId: testUser.id,
        sessionId: `session_${Math.floor(Math.random() * 10)}`,
        page: ['/', '/products', '/cart', '/checkout'][Math.floor(Math.random() * 4)],
        createdAt: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }

    // Product views
    for (let i = 1; i <= 5; i++) {
      for (let j = 0; j < 10; j++) {
        events.push({
          eventType: EventType.PRODUCT_VIEW,
          userId: testUser.id,
          productId: i,
          sessionId: `session_${j}`,
          page: `/product/${i}`,
          createdAt: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }
    }

    // Add to cart
    for (let i = 0; i < 15; i++) {
      events.push({
        eventType: EventType.ADD_TO_CART,
        userId: testUser.id,
        productId: (i % 5) + 1,
        sessionId: `session_${Math.floor(Math.random() * 10)}`,
        page: '/cart',
        value: Math.random() * 100,
        createdAt: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }

    // Purchases
    for (let i = 0; i < 8; i++) {
      events.push({
        eventType: EventType.PURCHASE,
        userId: testUser.id,
        sessionId: `session_${i}`,
        page: '/checkout',
        value: Math.random() * 500 + 50,
        createdAt: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }

    // Save events
    for (const event of events) {
      await analyticsRepository.save(event);
    }
    console.log(`✅ Created ${events.length} analytics events`);

    // Create loyalty program and transactions
    console.log('🏆 Creating loyalty program data...');
    
    let loyaltyProgram = await loyaltyRepository.findOne({
      where: { userId: testUser.id }
    });

    if (!loyaltyProgram) {
      loyaltyProgram = await loyaltyRepository.save({
        userId: testUser.id,
        totalPoints: 0,
        availablePoints: 0,
        lifetimeSpent: 0,
        currentTier: 'BRONZE',
        isActive: true,
        lastActivityAt: new Date()
      });
    }

    // Create loyalty transactions
    const transactions = [
      { type: TransactionType.EARNED, reason: TransactionReason.SIGNUP_BONUS, points: 100, description: 'Bienvenida' },
      { type: TransactionType.EARNED, reason: TransactionReason.PURCHASE, points: 250, description: 'Compra #1', value: 500 },
      { type: TransactionType.EARNED, reason: TransactionReason.PURCHASE, points: 180, description: 'Compra #2', value: 360 },
      { type: TransactionType.EARNED, reason: TransactionReason.PURCHASE, points: 300, description: 'Compra #3', value: 600 },
      { type: TransactionType.REDEEMED, reason: TransactionReason.REDEMPTION, points: -100, description: 'Canje de descuento' },
    ];

    for (const txn of transactions) {
      await transactionRepository.save({
        loyaltyProgramId: loyaltyProgram.id,
        type: txn.type,
        reason: txn.reason,
        points: txn.points,
        description: txn.description,
        createdAt: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });

      // Update loyalty program
      loyaltyProgram.totalPoints += txn.points;
      loyaltyProgram.availablePoints += txn.points;
    }

    await loyaltyRepository.save(loyaltyProgram);
    console.log(`✅ Created loyalty program with ${transactions.length} transactions`);

    console.log('✨ Test data generation completed!');
  } catch (error) {
    console.error('❌ Error generating test data:', error);
  } finally {
    await app.close();
  }
}

generateTestData();
