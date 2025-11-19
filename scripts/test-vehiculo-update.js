const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUpdateVehiculo() {
  try {
    console.log('🔍 Probando actualización de vehículo...');
    
    // Obtener un vehículo existente
    const vehiculo = await prisma.vehiculo.findFirst({
      include: {
        modelo: true,
        estado: true,
        vendedor: true
      }
    });
    
    if (!vehiculo) {
      console.log('❌ No se encontraron vehículos para probar');
      return;
    }
    
    console.log(`📋 Vehículo encontrado: ${vehiculo.patente} (ID: ${vehiculo.id})`);
    console.log(`📅 Estado actual pendientes_preparacion:`, vehiculo.pendientes_preparacion);
    
    // Datos de prueba similares a los del error
    const updateData = {
      vendedor_id: vehiculo.vendedor_id,
      modelo_id: vehiculo.modelo_id,
      vehiculo_ano: 2022,
      patente: vehiculo.patente,
      kilometros: 66458,
      valor: 5210985,
      moneda: "ARS",
      tipo_operacion: null,
      fecha_ingreso: new Date("2025-11-19T00:00:00.000Z"),
      observaciones: null,
      pendientes_preparacion: "", // Esto era lo que causaba el error
      comentarios: "",
      estado_id: vehiculo.estado_id
    };
    
    // Procesamos pendientes_preparacion correctamente
    const processedData = {
      ...updateData,
      pendientes_preparacion: updateData.pendientes_preparacion !== undefined ? 
        (Array.isArray(updateData.pendientes_preparacion) ? 
          updateData.pendientes_preparacion : 
          updateData.pendientes_preparacion === '' || updateData.pendientes_preparacion === null ? [] : [updateData.pendientes_preparacion.toString().trim()]
        ) : vehiculo.pendientes_preparacion
    };
    
    console.log('🔄 Datos procesados:', {
      pendientes_preparacion: processedData.pendientes_preparacion,
      comentarios: processedData.comentarios
    });
    
    // Intentar actualizar
    const updatedVehiculo = await prisma.vehiculo.update({
      where: {
        id: vehiculo.id
      },
      data: processedData,
      include: {
        modelo: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            version: true,
            modelo_ano: true,
            segmento_modelo: true,
            motorizacion: true,
            combustible: true,
            caja: true,
            traccion: true,
            cilindrada: true,
            potencia_hp: true,
            torque_nm: true,
            rendimiento_mixto: true,
            equipamiento: true,
            asistencias_manejo: true
          }
        },
        estado: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
            descripcion: true
          }
        },
        vendedor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
            email: true
          }
        },
        publicaciones: {
          select: {
            id: true,
            vehiculo_id: true,
            plataforma: true,
            url_publicacion: true,
            id_publicacion: true,
            titulo: true,
            ficha_breve: true,
            activo: true,
            created_at: true,
            updated_at: true
          }
        }
      }
    });
    
    console.log('✅ Actualización exitosa!');
    console.log(`📋 Vehículo actualizado: ${updatedVehiculo.patente}`);
    console.log(`📅 Nuevos pendientes_preparacion:`, updatedVehiculo.pendientes_preparacion);
    console.log(`💰 Valor: ${updatedVehiculo.valor} ${updatedVehiculo.moneda}`);
    
  } catch (error) {
    console.error('❌ Error en la actualización:', error.message);
    if (error.code) {
      console.error('Código de error:', error.code);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testUpdateVehiculo();