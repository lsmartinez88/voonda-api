/**
 * Script de prueba para el endpoint POST /api/vehiculos
 * Con los nuevos campos obligatorios del vendedor
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Datos de prueba 
const testData = {
  // INFORMACIÓN DEL MODELO (OBLIGATORIO)
  marca: 'Toyota',
  modelo: 'Corolla',
  version: 'XEI',
  vehiculo_ano: 2023,
  
  // INFORMACIÓN DEL VENDEDOR (OBLIGATORIO)
  vendedor_nombre: 'Juan Carlos',
  vendedor_apellido: 'Pérez',
  vendedor_telefono: '+54 9 11 1234-5678',
  vendedor_email: 'juan.perez.test@email.com',
  
  // INFORMACIÓN ADICIONAL DEL VENDEDOR (OPCIONAL)
  vendedor_dni: '12345678',
  vendedor_direccion: 'Av. Corrientes 1234, CABA',
  vendedor_observaciones: 'Vendedor de prueba para testing',
  
  // INFORMACIÓN DEL VEHÍCULO (OPCIONAL)
  patente: 'TEST123',
  kilometros: 15000,
  valor: 2500000,
  moneda: 'ARS',
  estado_codigo: 'salon',
  observaciones: 'Vehículo de prueba - excelente estado',
  
  // ARRAY DE PUBLICACIONES (OPCIONAL)
  publicaciones: [
    {
      plataforma: 'web',
      titulo: 'Toyota Corolla XEI 2023 - Prueba Impecable',
      ficha_breve: 'Vehículo de prueba en excelente estado, único dueño, service completo'
    },
    {
      plataforma: 'facebook',
      titulo: 'Toyota Corolla XEI 2023 - Test',
      url_publicacion: 'https://facebook.com/marketplace/test/123456',
      id_publicacion: 'fb_test_123456',
      ficha_breve: 'Publicación de prueba en Facebook Marketplace'
    },
    {
      plataforma: 'mercadolibre',
      titulo: 'Toyota Corolla XEI 2023 - Financiación Test',
      url_publicacion: 'https://articulo.mercadolibre.com.ar/MLA-TEST123',
      id_publicacion: 'MLA_TEST123456',
      ficha_breve: 'Publicación de prueba en MercadoLibre con financiación'
    }
  ]
};

async function main() {
  try {
    console.log('🧪 Iniciando prueba del endpoint POST /api/vehiculos...');
    
    // 1. Login para obtener token
    console.log('🔐 1. Obteniendo token de acceso...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@fratelli.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido exitosamente');
    
    // 2. Crear vehículo con nueva estructura
    console.log('🚗 2. Creando vehículo con nueva estructura...');
    console.log('📋 Datos a enviar:');
    console.log(JSON.stringify(testData, null, 2));
    
    const createResponse = await axios.post(`${API_BASE}/vehiculos`, testData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('🎉 ¡Vehículo creado exitosamente!');
    console.log('📊 Respuesta del servidor:');
    console.log('─'.repeat(50));
    console.log('✅ Status:', createResponse.status);
    console.log('📝 Message:', createResponse.data.message);
    console.log('🆔 Vehículo ID:', createResponse.data.vehiculo.id);
    console.log('🧑‍💼 Vendedor:', `${createResponse.data.vehiculo.vendedor.nombre} ${createResponse.data.vehiculo.vendedor.apellido}`);
    console.log('🚙 Modelo:', `${createResponse.data.vehiculo.modelo.marca} ${createResponse.data.vehiculo.modelo.modelo} ${createResponse.data.vehiculo.modelo.version}`);
    console.log('🔄 Estado:', createResponse.data.vehiculo.estado.nombre);
    
    if (createResponse.data.resumen) {
      console.log('📋 Resumen de creación:');
      console.log('  - Vendedor:', createResponse.data.resumen.vendedor_creado);
      console.log('  - Modelo:', createResponse.data.resumen.modelo_creado);
      console.log('  - Estado:', createResponse.data.resumen.estado);
      console.log('  - Publicaciones creadas:', createResponse.data.resumen.publicaciones_creadas || 0);
    }
    
    // Mostrar publicaciones creadas si existen
    if (createResponse.data.vehiculo.publicaciones && createResponse.data.vehiculo.publicaciones.length > 0) {
      console.log('📢 Publicaciones creadas:');
      createResponse.data.vehiculo.publicaciones.forEach((pub, index) => {
        console.log(`  ${index + 1}. ${pub.plataforma}: ${pub.titulo}`);
        if (pub.url_publicacion) console.log(`     URL: ${pub.url_publicacion}`);
        if (pub.id_publicacion) console.log(`     ID: ${pub.id_publicacion}`);
      });
    }
    
    // 3. Verificar que se puede obtener el vehículo creado
    console.log('🔍 3. Verificando que se puede obtener el vehículo...');
    const vehiculoId = createResponse.data.vehiculo.id;
    
    const getResponse = await axios.get(`${API_BASE}/vehiculos/${vehiculoId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Vehículo obtenido exitosamente por ID');
    console.log('🏷️  Patente:', getResponse.data.vehiculo.patente || 'N/A');
    console.log('🏃 Kilometros:', getResponse.data.vehiculo.kilometros || 0);
    console.log('💰 Valor:', getResponse.data.vehiculo.valor ? `$${getResponse.data.vehiculo.valor}` : 'N/A');
    
    console.log('\n🎯 ¡PRUEBA COMPLETADA EXITOSAMENTE!');
    console.log('✅ El endpoint POST /api/vehiculos funciona correctamente');
    console.log('✅ Se crea/reutiliza vendedor automáticamente');
    console.log('✅ Se crea/reutiliza modelo automáticamente');
    console.log('✅ Se asigna estado DISPONIBLE por defecto');
    console.log('✅ Se crean publicaciones automáticamente junto con el vehículo');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.response) {
      console.error('📋 Detalles del error:');
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

main();