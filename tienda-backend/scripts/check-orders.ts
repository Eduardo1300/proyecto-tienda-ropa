import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function checkOrders() {
  console.log('📊 Checking orders in the database...');

  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Check orders
    const orders = await dataSource.query(`
      SELECT 
        id, 
        "orderNumber", 
        total, 
        status, 
        "userId", 
        "createdAt" 
      FROM "order" 
      ORDER BY id DESC 
      LIMIT 5
    `);

    console.log('📋 Recent orders:');
    orders.forEach((order: any) => {
      console.log(`  Order ${order.id}: ${order.orderNumber} | Total: $${order.total} | Status: ${order.status} | UserId: ${order.userId} | Created: ${order.createdAt}`);
    });

    // Check users
    const users = await dataSource.query(`
      SELECT id, username, email, role FROM "user" ORDER BY id
    `);

    console.log('\n👥 Users:');
    users.forEach((user: any) => {
      console.log(`  User ${user.id}: ${user.username} (${user.email}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

checkOrders();
