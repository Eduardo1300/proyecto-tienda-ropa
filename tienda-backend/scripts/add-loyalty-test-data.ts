import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { LoyaltyService } from '../src/loyalty/services/loyalty.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';

async function addMoreTestData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const loyaltyService = app.get(LoyaltyService);
    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    
    console.log('📈 Agregando más datos de prueba para loyalty...');
    
    const users = await userRepository.find();
    
    for (const user of users) {
      console.log(`\n👤 Procesando usuario ${user.id} (${user.email})...`);
      
      const program = await loyaltyService.getProgram(user.id);
      
      // Agregar varias compras (valores enteros)
      await loyaltyService.processOrderPoints(user.id, 101, 300);
      await loyaltyService.processOrderPoints(user.id, 102, 150);
      await loyaltyService.processOrderPoints(user.id, 103, 90);
      await loyaltyService.processOrderPoints(user.id, 104, 450);
      
      // Agregar bonus por reseñas
      await loyaltyService.giveReviewBonus(user.id, 1);
      await loyaltyService.giveReviewBonus(user.id, 2);
      await loyaltyService.giveReviewBonus(user.id, 3);
      
      // Simular un canje de puntos
      try {
        const result = await loyaltyService.redeemPoints(user.id, 200, 'Canje de prueba - Descuento 5%');
        console.log(`  ✅ Canje: ${result.discount} de descuento`);
      } catch (e) {
        console.log(`  ⚠️  No se pudo canjear puntos: ${e.message}`);
      }
      
      // Obtener programa actualizado
      const updatedProgram = await loyaltyService.getProgram(user.id);
      console.log(`  📊 Puntos disponibles: ${updatedProgram.availablePoints}`);
      console.log(`  🏆 Tier actual: ${updatedProgram.currentTier}`);
    }
    
    // Obtener leaderboard
    console.log('\n🏆 Leaderboard:');
    const leaderboard = await loyaltyService.getLeaderboard(10);
    leaderboard.forEach((entry, index) => {
      console.log(`  ${index + 1}. ${entry.userName}: ${entry.currentPoints} pts (${entry.currentTier})`);
    });
    
    console.log('\n✅ Datos de prueba agregados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  addMoreTestData().catch(console.error);
}

export default addMoreTestData;
