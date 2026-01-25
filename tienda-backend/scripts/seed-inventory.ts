import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3002';

// Get admin token
let adminToken = '';

async function seedInventory() {
  try {
    // Login como admin
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });

    adminToken = loginResponse.data.access_token;

    if (!adminToken) {
      console.log('❌ No se pudo obtener el token de admin. Verifica las credenciales.');
      return;
    }

    console.log('✅ Admin autenticado');

    // Obtener productos
    const productsResponse = await axios.get(`${API_URL}/products`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const products = (productsResponse.data.data || productsResponse.data).slice(0, 10);

    if (products.length === 0) {
      console.log('❌ No hay productos. Ejecuta seed.ts primero.');
      return;
    }

    console.log(`✅ Se encontraron ${products.length} productos`);

    // Crear movimientos de stock para cada producto
    let movementCount = 0;
    for (const product of products) {
      // Movimiento inicial (compra)
      try {
        const response = await axios.post(`${API_URL}/inventory/stock/update`, {
          productId: product.id,
          quantity: 100,
          type: 'purchase',
          reason: 'supplier_delivery',
          unitCost: product.price * 0.4,
          location: 'Almacén Principal',
          notes: 'Stock inicial',
          referenceNumber: `PO-INIT-${product.id}`
        }, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        movementCount++;
      } catch (error: any) {
        console.log(`  ⚠️  Movimiento inicial fallido para ${product.name}:`, error.response?.data?.message || error.message);
      }

      // Movimiento de venta (aleatorio)
      if (Math.random() > 0.3) {
        try {
          await axios.post(`${API_URL}/inventory/stock/update`, {
            productId: product.id,
            quantity: Math.floor(Math.random() * 20) + 5,
            type: 'sale',
            reason: 'customer_order',
            location: 'Almacén Principal',
            notes: 'Venta a cliente',
            referenceNumber: `ORD-${Date.now()}-${product.id}`
          }, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          movementCount++;
        } catch (error) {
          // Ignorar errores
        }
      }

      // Movimiento de reabastecimiento (aleatorio)
      if (Math.random() > 0.5) {
        try {
          await axios.post(`${API_URL}/inventory/stock/update`, {
            productId: product.id,
            quantity: Math.floor(Math.random() * 50) + 20,
            type: 'restock',
            reason: 'auto_restock',
            unitCost: product.price * 0.4,
            location: 'Almacén Principal',
            notes: 'Reabastecimiento planificado',
            referenceNumber: `PO-REST-${Date.now()}-${product.id}`
          }, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          movementCount++;
        } catch (error) {
          // Ignorar errores
        }
      }
    }

    console.log(`✅ Se crearon ${movementCount} movimientos de inventario`);
    console.log('✅ ¡Datos de inventario creados exitosamente!');

  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

seedInventory().catch(console.error);
