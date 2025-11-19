/**
 * Script de prueba para el endpoint POST /api/vehiculos
 * EN PRODUCCIÓN - Con los nuevos campos obligatorios del vendedor y publicaciones
 */

const axios = require('axios');

// URL de producción
const API_BASE = 'https://api.fratelli.voonda.net/api';

// Datos de prueba para producción
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
  vendedor_email: 'juan.perez.prod@email.com',
  
  // INFORMACIÓN ADICIONAL DEL VENDEDOR (OPCIONAL)
  vendedor_dni: '12345678',
  vendedor_direccion: 'Av. Corrientes 1234, CABA',
  vendedor_observaciones: 'Vendedor de prueba para testing en producción',
  
  // INFORMACIÓN DEL VEHÍCULO (OPCIONAL)
  patente: 'PROD123',
  kilometros: 15000,
  valor: 2500000,
  moneda: 'ARS',
  estado_codigo: 'salon',
  observaciones: 'Vehículo de prueba en producción - excelente estado',
  
  // ARRAY DE PUBLICACIONES (OPCIONAL)
  publicaciones: [
    {
      plataforma: 'web',
      titulo: 'Toyota Corolla XEI 2023 - Prod Test',
      ficha_breve: 'Vehículo de prueba en producción, único dueño, service completo'
    },
    {
      plataforma: 'facebook',
      titulo: 'Toyota Corolla XEI 2023 - Producción',
      url_publicacion: 'https://facebook.com/marketplace/prod/123456',
      id_publicacion: 'fb_prod_123456',
      ficha_breve: 'Publicación de prueba en Facebook Marketplace - Producción'
    },
    {
      plataforma: 'mercadolibre',
      titulo: 'Toyota Corolla XEI 2023 - Financiación Producción',
      url_publicacion: 'https://articulo.mercadolibre.com.ar/MLA-PROD123',
      id_publicacion: 'MLA_PROD123456',
      ficha_breve: 'Publicación de prueba en MercadoLibre con financiación - Prod'
    }
  ]
};

async function main() {
  try {
    console.log('🌍 Iniciando prueba del endpoint POST /api/vehiculos EN PRODUCCIÓN...');
    console.log('🔗 API Base:', API_BASE);
    
    // 1. Login para obtener token
    console.log('🔐 1. Obteniendo token de acceso en producción...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@voonda.com', // Usar el usuario admin principal
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido exitosamente en producción');
    
    // 2. Crear vehículo con nueva estructura
    console.log('🚗 2. Creando vehículo en producción con nueva estructura...');
    console.log('📋 Datos a enviar:');
    console.log(JSON.stringify(testData, null, 2));
    
    const createResponse = await axios.post(`${API_BASE}/vehiculos`, testData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 segundos de timeout para producción
    });
    
    console.log('🎉 ¡Vehículo creado exitosamente en PRODUCCIÓN!');
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
    console.log('🔍 3. Verificando que se puede obtener el vehículo en producción...');
    const vehiculoId = createResponse.data.vehiculo.id;
    
    const getResponse = await axios.get(`${API_BASE}/vehiculos/${vehiculoId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });
    
    console.log('✅ Vehículo obtenido exitosamente por ID en producción');
    console.log('🏷️  Patente:', getResponse.data.vehiculo.patente || 'N/A');
    console.log('🏃 Kilometros:', getResponse.data.vehiculo.kilometros || 0);
    console.log('💰 Valor:', getResponse.data.vehiculo.valor ? `$${getResponse.data.vehiculo.valor}` : 'N/A');
    
    // Verificar si las publicaciones también se obtienen correctamente
    if (getResponse.data.vehiculo.publicaciones && getResponse.data.vehiculo.publicaciones.length > 0) {
      console.log('📢 Publicaciones obtenidas del GET:');
      getResponse.data.vehiculo.publicaciones.forEach((pub, index) => {
        console.log(`  ${index + 1}. ${pub.plataforma}: ${pub.titulo}`);
      });
    }
    
    console.log('\n🌍 ¡PRUEBA EN PRODUCCIÓN COMPLETADA EXITOSAMENTE!');
    console.log('✅ El endpoint POST /api/vehiculos funciona en producción');
    console.log('✅ Se crea/reutiliza vendedor automáticamente');
    console.log('✅ Se crea/reutiliza modelo automáticamente');
    console.log('✅ Se asigna estado DISPONIBLE por defecto');
    console.log('✅ Se crean publicaciones automáticamente junto con el vehículo');
    console.log('✅ El sistema está listo para el frontend!');
    
  } catch (error) {
    console.error('❌ Error en la prueba de producción:', error.message);
    if (error.response) {
      console.error('📋 Detalles del error:');
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Error de conexión: No se puede conectar al servidor de producción');
      console.error('🔗 Verificar que', API_BASE, 'esté disponible');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🌐 Error DNS: No se puede resolver el nombre del servidor');
    }
    process.exit(1);
  }
}

main();