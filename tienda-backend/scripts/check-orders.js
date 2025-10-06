"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const typeorm_1 = require("typeorm");
async function checkOrders() {
    console.log('📊 Checking orders in the database...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    try {
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
        orders.forEach((order) => {
            console.log(`  Order ${order.id}: ${order.orderNumber} | Total: $${order.total} | Status: ${order.status} | UserId: ${order.userId} | Created: ${order.createdAt}`);
        });
        const users = await dataSource.query(`
      SELECT id, username, email, role FROM "user" ORDER BY id
    `);
        console.log('\n👥 Users:');
        users.forEach((user) => {
            console.log(`  User ${user.id}: ${user.username} (${user.email}) - ${user.role}`);
        });
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await app.close();
    }
}
checkOrders();
//# sourceMappingURL=check-orders.js.map