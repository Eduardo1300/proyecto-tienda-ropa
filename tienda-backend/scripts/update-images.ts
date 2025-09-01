import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ProductsService } from '../src/products/products.service';

async function updateProductImages() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);

  console.log('🖼️ Updating product images...');

  try {
    // Get all products
    const products = await productsService.findAll();
    console.log(`Found ${products.length} products to update`);

    const imageUrls = [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center', // Camiseta
      'https://images.unsplash.com/photo-1566479179817-c0cede0c15b6?w=400&h=400&fit=crop&crop=center', // Vestido
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center', // Jeans
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center', // Blusa
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center', // Zapatillas
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center', // Bolso
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center', // Chaqueta
      'https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=400&h=400&fit=crop&crop=center', // Falda
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&crop=center', // Extra
    ];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const newImageUrl = imageUrls[i] || imageUrls[0]; // Use first image as fallback
      
      if (product.imageUrl && product.imageUrl.includes('via.placeholder.com')) {
        console.log(`Updating ${product.name} - Old URL: ${product.imageUrl}`);
        
        await productsService.update(product.id, {
          imageUrl: newImageUrl
        });
        
        console.log(`✅ Updated ${product.name} - New URL: ${newImageUrl}`);
      } else {
        console.log(`⏭️ Skipped ${product.name} - Already has real image URL`);
      }
    }

    console.log('🎉 All product images updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  } finally {
    await app.close();
  }
}

updateProductImages();
