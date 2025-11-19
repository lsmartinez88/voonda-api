/**
 * Test del endpoint getById de vehículos
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testGetVehiculoById() {
  try {
    console.log('🧪 Probando endpoint getById de vehículos...');
    
    // Obtener un vehículo de muestra
    const vehiculo = await prisma.vehiculo.findFirst({
      select: { id: true, patente: true }
    });
    
    if (!vehiculo) {
      console.log('❌ No hay vehículos en la base de datos');
      return;
    }
    
    console.log(`📋 Probando con vehículo: ${vehiculo.patente} (${vehiculo.id})`);
    
    // Hacer la consulta que causaba el error
    const vehiculoCompleto = await prisma.vehiculo.findFirst({
      where: { id: vehiculo.id },
      include: {
        empresa: {
          select: {
            id: true,
            nombre: true
          }
        },
        modelo: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            version: true,
            modelo_ano: true,
            combustible: true,
            caja: true,
            motorizacion: true,
            traccion: true,
            segmento_modelo: true,
            cilindrada: true,
            potencia_hp: true,
            torque_nm: true,
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
            email: true,
            dni: true,
            direccion: true
          }
        },
        comprador: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
            email: true,
            dni: true,
            direccion: true
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
          },
          where: { activo: true }
        },
        imagenes: {
          select: {
            id: true,
            url: true,
            descripcion: true,
            orden: true,
            es_principal: true,
            created_at: true
          },
          where: { activo: true },
          orderBy: [
            { es_principal: 'desc' },
            { orden: 'asc' }
          ]
        },
        operaciones: {
          select: {
            id: true,
            tipo: true,
            monto: true,
            fecha: true,
            estado: true,
            vendedor: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                telefono: true
              }
            },
            comprador: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                telefono: true
              }
            }
          },
          orderBy: { created_at: 'desc' }
        }
      }
    });
    
    if (vehiculoCompleto) {
      console.log('✅ Consulta exitosa!');
      console.log('📊 Datos obtenidos:', {
        patente: vehiculoCompleto.patente,
        modelo: `${vehiculoCompleto.modelo.marca} ${vehiculoCompleto.modelo.modelo}`,
        vendedor: `${vehiculoCompleto.vendedor.nombre} ${vehiculoCompleto.vendedor.apellido}`,
        estado: vehiculoCompleto.estado.nombre,
        publicaciones: vehiculoCompleto.publicaciones.length
      });
    } else {
      console.log('❌ No se encontró el vehículo');
    }
    
  } catch (error) {
    console.error('❌ Error en la consulta:', error.message);
    throw error;
  }
}

testGetVehiculoById()
  .catch(console.error)
  .finally(() => prisma.$disconnect());