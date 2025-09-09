import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { LoyaltyService } from '../src/loyalty/services/loyalty.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';

async function seedLoyalty() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const loyaltyService = app.get(LoyaltyService);
    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    
    console.log('🌱 Iniciando seed de loyalty...');
    
    // Obtener todos los usuarios
    const users = await userRepository.find();
    console.log(`📊 Encontrados ${users.length} usuarios`);
    
    if (users.length === 0) {
      console.log('⚠️  No hay usuarios en la base de datos. Creando usuario de prueba...');
      
      // Crear usuario de prueba
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
    
    // Crear programas de lealtad para cada usuario
    for (const user of users) {
      try {
        console.log(`🏆 Creando programa de lealtad para usuario ${user.id}...`);
        
        // Verificar si ya tiene programa
        let program = await loyaltyService.getProgram(user.id);
        
        if (program) {
          console.log(`✅ Usuario ${user.id} ya tiene programa de lealtad`);
          continue;
        }
        
        // Crear programa (esto se hace automáticamente en getProgram)
        program = await loyaltyService.getProgram(user.id);
        
        // Simular algunas transacciones de prueba
        console.log(`💰 Agregando transacciones de prueba para usuario ${user.id}...`);
        
        // Simular compras
        await loyaltyService.processOrderPoints(user.id, 1001, 150.00);
        await loyaltyService.processOrderPoints(user.id, 1002, 89.99);
        await loyaltyService.processOrderPoints(user.id, 1003, 225.50);
        
        // Dar bonus de reseña
        await loyaltyService.giveReviewBonus(user.id, 1);
        await loyaltyService.giveReviewBonus(user.id, 2);
        
        // Si es el primer usuario, dar bonus extra para pruebas
        if (user.id === users[0].id) {
          await loyaltyService.giveBirthdayBonus(user.id);
          await loyaltyService.adjustPoints(user.id, 500, 'Bonus de prueba para testing');
        }
        
        console.log(`✅ Programa de lealtad creado para usuario ${user.id}`);
        
      } catch (error) {
        console.error(`❌ Error creando programa para usuario ${user.id}:`, error.message);
      }
    }
    
    console.log('🎉 Seed de loyalty completado exitosamente!');
    
    // Mostrar estadísticas
    const allPrograms = await Promise.all(
      users.map(user => loyaltyService.getProgram(user.id))
    );
    
    console.log('\n📊 Estadísticas de programas creados:');
    for (const program of allPrograms) {
      console.log(`- Usuario ${program.userId}: ${program.availablePoints} puntos disponibles, Tier: ${program.currentTier}`);
    }
    
  } catch (error) {
    console.error('❌ Error en seed de loyalty:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar seed si es llamado directamente
if (require.main === module) {
  seedLoyalty().catch(console.error);
}

export default seedLoyalty;
