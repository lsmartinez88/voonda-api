const axios = require('axios');

async function testVehiculoPutAPI() {
  try {
    console.log('🔍 Probando endpoint PUT /api/vehiculos/{id}...');
    
    // Primero hacer login para obtener el token
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@voonda.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso, token obtenido');
    
    // Obtener lista de vehículos para tener un ID válido
    const vehiculosResponse = await axios.get('http://localhost:3001/api/vehiculos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const vehiculos = vehiculosResponse.data.vehiculos || vehiculosResponse.data;
    
    if (!vehiculos || vehiculos.length === 0) {
      console.log('❌ No se encontraron vehículos para probar');
      return;
    }
    
    const vehiculoId = vehiculos[0].id;
    console.log(`📋 Usando vehículo ID: ${vehiculoId}`);
    
    // Datos de prueba que causaban el error
    const updateData = {
      vendedor_id: vehiculos[0].vendedor_id || "54c8f757-6464-4fa3-9dd6-d6f5fad2d452",
      modelo_id: vehiculos[0].modelo_id || "a39e8b37-16d9-4624-bb14-3441c2fac851",
      vehiculo_ano: 2022,
      patente: "SDX561",
      kilometros: 66458,
      valor: 5210985,
      moneda: "ARS",
      tipo_operacion: null,
      fecha_ingreso: "2025-11-19T00:00:00.000Z",
      observaciones: null,
      pendientes_preparacion: "", // Esto era lo que causaba el error
      comentarios: "",
      estado_id: vehiculos[0].estado_id || "34618927-08bb-421f-9c42-eeb465c01e08"
    };
    
    console.log('🔄 Enviando datos de actualización:', {
      ...updateData,
      'pendientes_preparacion (tipo)': typeof updateData.pendientes_preparacion,
      'pendientes_preparacion (valor)': updateData.pendientes_preparacion
    });
    
    // Hacer PUT request
    const putResponse = await axios.put(
      `http://localhost:3001/api/vehiculos/${vehiculoId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ PUT request exitoso!');
    console.log(`📊 Status: ${putResponse.status}`);
    console.log(`📋 Vehículo actualizado:`, {
      id: putResponse.data.vehiculo?.id,
      patente: putResponse.data.vehiculo?.patente,
      pendientes_preparacion: putResponse.data.vehiculo?.pendientes_preparacion,
      valor: putResponse.data.vehiculo?.valor,
      moneda: putResponse.data.vehiculo?.moneda
    });
    
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Instalar axios si no está disponible
async function checkAndInstallAxios() {
  try {
    require('axios');
    testVehiculoPutAPI();
  } catch (e) {
    console.log('📦 Instalando axios...');
    const { exec } = require('child_process');
    exec('npm install axios', (error, stdout, stderr) => {
      if (error) {
        console.error('Error instalando axios:', error);
        return;
      }
      console.log('✅ Axios instalado');
      delete require.cache[require.resolve('axios')];
      testVehiculoPutAPI();
    });
  }
}

checkAndInstallAxios();