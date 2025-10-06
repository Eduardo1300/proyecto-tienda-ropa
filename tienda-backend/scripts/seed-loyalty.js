"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const loyalty_service_1 = require("../src/loyalty/services/loyalty.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../src/users/entities/user.entity");
async function seedLoyalty() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const loyaltyService = app.get(loyalty_service_1.LoyaltyService);
        const userRepository = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
        console.log('🌱 Iniciando seed de loyalty...');
        const users = await userRepository.find();
        console.log(`📊 Encontrados ${users.length} usuarios`);
        if (users.length === 0) {
            console.log('⚠️  No hay usuarios en la base de datos. Creando usuario de prueba...');
            const testUser = userRepository.create({
                email: 'test@example.com',
                password: 'hashedpassword',
                firstName: 'Usuario',
                lastName: 'Prueba',
                role: 'user'
            });
            const savedUser = await userRepository.save(testUser);
            users.push(savedUser);
        }
        for (const user of users) {
            try {
                console.log(`🏆 Creando programa de lealtad para usuario ${user.id}...`);
                let program = await loyaltyService.getProgram(user.id);
                if (program) {
                    console.log(`✅ Usuario ${user.id} ya tiene programa de lealtad`);
                    continue;
                }
                program = await loyaltyService.getProgram(user.id);
                console.log(`💰 Agregando transacciones de prueba para usuario ${user.id}...`);
                await loyaltyService.processOrderPoints(user.id, 1001, 150.00);
                await loyaltyService.processOrderPoints(user.id, 1002, 89.99);
                await loyaltyService.processOrderPoints(user.id, 1003, 225.50);
                await loyaltyService.giveReviewBonus(user.id, 1);
                await loyaltyService.giveReviewBonus(user.id, 2);
                if (user.id === users[0].id) {
                    await loyaltyService.giveBirthdayBonus(user.id);
                    await loyaltyService.adjustPoints(user.id, 500, 'Bonus de prueba para testing');
                }
                console.log(`✅ Programa de lealtad creado para usuario ${user.id}`);
            }
            catch (error) {
                console.error(`❌ Error creando programa para usuario ${user.id}:`, error.message);
            }
        }
        console.log('🎉 Seed de loyalty completado exitosamente!');
        const allPrograms = await Promise.all(users.map(user => loyaltyService.getProgram(user.id)));
        console.log('\n📊 Estadísticas de programas creados:');
        for (const program of allPrograms) {
            console.log(`- Usuario ${program.userId}: ${program.availablePoints} puntos disponibles, Tier: ${program.currentTier}`);
        }
    }
    catch (error) {
        console.error('❌ Error en seed de loyalty:', error);
    }
    finally {
        await app.close();
    }
}
if (require.main === module) {
    seedLoyalty().catch(console.error);
}
exports.default = seedLoyalty;
//# sourceMappingURL=seed-loyalty.js.map