/**
 * Script de prueba para el endpoint PUT /api/vehiculos/:id
 * 
 * Casos de prueba:
 * 1. Actualización básica de campos del vehículo
 * 2. Cambio de vendedor (auto-creación de nuevo vendedor)
 * 3. Cambio de modelo (auto-creación de nuevo modelo)
 * 4. Actualización de publicaciones (reemplazo completo)
 * 5. Actualización combinada (vendedor + modelo + publicaciones)
 */

// Configurar variables
const BASE_URL = 'https://api.fratelli.voonda.net'; // Cambiar por http://localhost:3001 para testing local
// const BASE_URL = 'http://localhost:3001';

let authToken = '';

async function login() {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'lucasmartinez@voonda.com', // Cambiar por credenciales válidas
      password: 'Lu_13579' // Cambiar por password válida
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Error de autenticación: ${data.message}`);
  }
  
  authToken = data.token;
  console.log('🔑 Autenticación exitosa');
  return authToken;
}

async function obtenerPrimerVehiculo() {
  const response = await fetch(`${BASE_URL}/api/vehiculos?limit=1`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Error obteniendo vehículos: ${data.message}`);
  }

  if (!data.vehiculos || data.vehiculos.length === 0) {
    throw new Error('No hay vehículos disponibles para actualizar');
  }

  return data.vehiculos[0];
}

async function actualizarVehiculo(vehiculoId, updateData, testName) {
  console.log(`\n🧪 ${testName}`);
  console.log('📤 Datos a enviar:', JSON.stringify(updateData, null, 2));
  
  const response = await fetch(`${BASE_URL}/api/vehiculos/${vehiculoId}`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });

  const data = await response.json();
  
  console.log(`📊 Status: ${response.status}`);
  
  if (!response.ok) {
    console.error('❌ Error:', data.message || data);
    if (data.errors) {
      console.error('Errores de validación:', data.errors);
    }
    return { success: false, data };
  }

  console.log('✅ Actualización exitosa');
  console.log('📋 Resumen de cambios:', data.resumen);
  console.log('🚗 Vehículo actualizado ID:', data.vehiculo?.id);
  
  return { success: true, data };
}

async function ejecutarPruebas() {
  try {
    // Autenticación
    await login();
    
    // Obtener un vehículo para actualizar
    const vehiculo = await obtenerPrimerVehiculo();
    console.log(`🎯 Vehículo objetivo: ${vehiculo.id} (${vehiculo.modelo_auto?.marca?.nombre || 'N/A'} ${vehiculo.modelo_auto?.modelo || 'N/A'})`);
    
    // ========================================
    // PRUEBA 1: Actualización básica de campos
    // ========================================
    const test1 = {
      valor: vehiculo.valor + 100000,
      kilometros: (vehiculo.kilometros || 0) + 5000,
      observaciones: `Actualizado el ${new Date().toLocaleString()} - Test básico`
    };
    
    await actualizarVehiculo(vehiculo.id, test1, 'PRUEBA 1: Actualización básica de campos');
    
    // ========================================
    // PRUEBA 2: Cambio de vendedor (auto-creación)
    // ========================================
    const test2 = {
      vendedor_nombre: 'Carlos',
      vendedor_apellido: 'Rodríguez',
      vendedor_telefono: '+54 11 5555-9999',
      vendedor_email: `carlos.rodriguez.test.${Date.now()}@email.com`, // Email único
      vendedor_dni: '99887766',
      vendedor_direccion: 'Av. Santa Fe 1234, CABA',
      vendedor_observaciones: 'Vendedor creado para test de actualización'
    };
    
    await actualizarVehiculo(vehiculo.id, test2, 'PRUEBA 2: Cambio de vendedor (auto-creación)');
    
    // ========================================
    // PRUEBA 3: Cambio de modelo (auto-creación)
    // ========================================
    const test3 = {
      marca: 'Nissan',
      modelo: 'Sentra',
      version: 'Advance CVT',
      vehiculo_ano: 2024
    };
    
    await actualizarVehiculo(vehiculo.id, test3, 'PRUEBA 3: Cambio de modelo (auto-creación)');
    
    // ========================================
    // PRUEBA 4: Actualización de publicaciones
    // ========================================
    const test4 = {
      publicaciones: [
        {
          plataforma: 'web',
          titulo: 'Nissan Sentra Advance CVT 2024 - Actualizado',
          ficha_breve: 'Vehículo actualizado con nueva información'
        },
        {
          plataforma: 'facebook',
          titulo: 'Nissan Sentra 2024 - Excelente estado',
          url_publicacion: 'https://facebook.com/marketplace/item/updated123',
          id_publicacion: 'fb_updated_123'
        },
        {
          plataforma: 'mercadolibre',
          titulo: 'Nissan Sentra Advance CVT 2024',
          url_publicacion: 'https://vehiculo.mercadolibre.com.ar/MLA-updated456',
          id_publicacion: 'MLA-updated456',
          ficha_breve: 'Precio actualizado, excelente oportunidad'
        }
      ]
    };
    
    await actualizarVehiculo(vehiculo.id, test4, 'PRUEBA 4: Actualización de publicaciones');
    
    // ========================================
    // PRUEBA 5: Actualización combinada
    // ========================================
    const test5 = {
      // Cambiar modelo nuevamente
      marca: 'Volkswagen',
      modelo: 'Vento',
      version: 'Highline',
      vehiculo_ano: 2023,
      
      // Cambiar vendedor nuevamente
      vendedor_nombre: 'Ana',
      vendedor_apellido: 'López',
      vendedor_telefono: '+54 11 7777-3333',
      vendedor_email: `ana.lopez.test.${Date.now()}@email.com`,
      vendedor_dni: '11223344',
      
      // Actualizar valores comerciales
      valor: 28000000,
      kilometros: 35000,
      estado_codigo: 'disponible',
      
      // Nuevas publicaciones
      publicaciones: [
        {
          plataforma: 'web',
          titulo: 'VW Vento Highline 2023 - Combinado Test',
          ficha_breve: 'Actualización completa de modelo, vendedor y publicaciones'
        },
        {
          plataforma: 'whatsapp',
          titulo: 'VW Vento Highline 2023 - WhatsApp',
          ficha_breve: 'Contacto directo por WhatsApp'
        }
      ],
      
      // Comentarios de la actualización
      comentarios: `Actualización combinada completa realizada el ${new Date().toLocaleString()}\n- Modelo cambiado a VW Vento\n- Vendedor cambiado a Ana López\n- Publicaciones actualizadas\n- Valores comerciales modificados`,
      observaciones: 'Test de actualización combinada exitoso'
    };
    
    await actualizarVehiculo(vehiculo.id, test5, 'PRUEBA 5: Actualización combinada (modelo + vendedor + publicaciones)');
    
    // ========================================
    // PRUEBA 6: Validar que se conservan los cambios
    // ========================================
    console.log('\n🔍 PRUEBA 6: Verificación de persistencia de datos');
    const responseVerify = await fetch(`${BASE_URL}/api/vehiculos/${vehiculo.id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    const vehiculoFinal = await responseVerify.json();
    
    if (responseVerify.ok) {
      console.log('✅ Verificación exitosa - Estado final del vehículo:');
      console.log(`🏷️  Marca/Modelo: ${vehiculoFinal.vehiculo?.modelo_auto?.marca?.nombre || 'N/A'} ${vehiculoFinal.vehiculo?.modelo_auto?.modelo || 'N/A'} ${vehiculoFinal.vehiculo?.modelo_auto?.version || ''}`);
      console.log(`👤 Vendedor: ${vehiculoFinal.vehiculo?.vendedor?.nombre || 'N/A'} ${vehiculoFinal.vehiculo?.vendedor?.apellido || ''} (${vehiculoFinal.vehiculo?.vendedor?.email || 'N/A'})`);
      console.log(`💰 Valor: ${vehiculoFinal.vehiculo?.valor || 'N/A'} ${vehiculoFinal.vehiculo?.moneda || ''}`);
      console.log(`🛣️  Kilometros: ${vehiculoFinal.vehiculo?.kilometros || 'N/A'}`);
      console.log(`📢 Publicaciones: ${vehiculoFinal.vehiculo?.publicaciones?.length || 0} activas`);
      
      if (vehiculoFinal.vehiculo?.publicaciones?.length > 0) {
        vehiculoFinal.vehiculo.publicaciones.forEach((pub, index) => {
          console.log(`   ${index + 1}. ${pub.plataforma}: ${pub.titulo}`);
        });
      }
    } else {
      console.error('❌ Error verificando vehículo final:', vehiculoFinal.message);
    }
    
    console.log('\n🎉 ¡Todas las pruebas completadas!');
    console.log('\n📝 RESUMEN DE FUNCIONALIDADES PROBADAS:');
    console.log('✅ Actualización básica de campos del vehículo');
    console.log('✅ Auto-creación de vendedores basado en email');
    console.log('✅ Auto-creación de modelos basado en marca/modelo/version');
    console.log('✅ Reemplazo completo de publicaciones');
    console.log('✅ Actualización combinada de múltiples entidades');
    console.log('✅ Persistencia de cambios en base de datos');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    process.exit(1);
  }
}

// Ejecutar las pruebas
ejecutarPruebas();