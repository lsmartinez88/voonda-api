/**
 * Script temporal para poblar datos de prueba en la base de datos
 * EJECUTAR SOLO UNA VEZ - No es un seed automático
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando población de datos de prueba...');

  try {
    // 1. Crear roles del sistema
    console.log('📋 Creando roles del sistema...');
    const roles = [
      {
        nombre: 'administrador_general',
        descripcion: 'Administrador con acceso total al sistema',
        permisos: {
          empresas: ['create', 'read', 'update', 'delete'],
          usuarios: ['create', 'read', 'update', 'delete'],
          vehiculos: ['create', 'read', 'update', 'delete'],
          operaciones: ['create', 'read', 'update', 'delete'],
          reportes: ['read']
        },
        activo: true
      },
      {
        nombre: 'administrador_empresa',
        descripcion: 'Administrador de una empresa específica',
        permisos: {
          usuarios: ['create', 'read', 'update'],
          vehiculos: ['create', 'read', 'update', 'delete'],
          operaciones: ['create', 'read', 'update', 'delete'],
          vendedores: ['create', 'read', 'update'],
          compradores: ['create', 'read', 'update'],
          reportes: ['read']
        },
        activo: true
      },
      {
        nombre: 'colaborador',
        descripcion: 'Usuario colaborador con acceso limitado',
        permisos: {
          vehiculos: ['create', 'read', 'update'],
          operaciones: ['create', 'read', 'update'],
          vendedores: ['read', 'update'],
          compradores: ['read', 'update']
        },
        activo: true
      }
    ];

    const rolesCreados = {};
    for (const rol of roles) {
      const rolCreado = await prisma.rol.upsert({
        where: { nombre: rol.nombre },
        update: rol,
        create: rol
      });
      rolesCreados[rol.nombre] = rolCreado.id;
    }
    console.log('✅ Roles creados:', Object.keys(rolesCreados));

    // 2. Crear empresas de prueba
    console.log('🏢 Creando empresas de prueba...');
    const empresas = [
      {
        nombre: 'Fratelli Motors',
        descripcion: 'Concesionaria especializada en vehículos premium',
        logo_url: 'https://example.com/logo-fratelli.png',
        activa: true
      },
      {
        nombre: 'AutoMax SA',
        descripcion: 'Venta de vehículos usados de alta calidad',
        logo_url: 'https://example.com/logo-automax.png',
        activa: true
      },
      {
        nombre: 'VelozCars',
        descripcion: 'Especialistas en vehículos deportivos',
        logo_url: 'https://example.com/logo-veloz.png',
        activa: true
      }
    ];

    const empresasCreadas = {};
    for (const empresa of empresas) {
      try {
        // Intentar buscar empresa existente
        const empresaExistente = await prisma.empresa.findFirst({
          where: { nombre: empresa.nombre }
        });
        
        if (empresaExistente) {
          empresasCreadas[empresa.nombre] = empresaExistente.id;
          console.log(`✅ Empresa existente: ${empresa.nombre}`);
        } else {
          const empresaCreada = await prisma.empresa.create({
            data: empresa
          });
          empresasCreadas[empresa.nombre] = empresaCreada.id;
          console.log(`✅ Empresa creada: ${empresa.nombre}`);
        }
      } catch (error) {
        console.log(`⚠️  Error con empresa ${empresa.nombre}:`, error.message);
      }
    }
    console.log('✅ Empresas creadas:', Object.keys(empresasCreadas));

    // 3. Crear usuarios de prueba
    console.log('👤 Creando usuarios de prueba...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const usuarios = [
      {
        email: 'admin@voonda.com',
        password: hashedPassword,
        nombre: 'Super',
        apellido: 'Admin',
        telefono: '+54 9 11 1234-5678',
        empresa_id: null, // Admin general sin empresa específica
        rol_id: rolesCreados.administrador_general,
        activo: true
      },
      {
        email: 'admin@fratelli.com',
        password: hashedPassword,
        nombre: 'Carlos',
        apellido: 'Fratelli',
        telefono: '+54 9 11 2345-6789',
        empresa_id: empresasCreadas['Fratelli Motors'],
        rol_id: rolesCreados.administrador_empresa,
        activo: true
      },
      {
        email: 'vendedor@fratelli.com',
        password: hashedPassword,
        nombre: 'María',
        apellido: 'González',
        telefono: '+54 9 11 3456-7890',
        empresa_id: empresasCreadas['Fratelli Motors'],
        rol_id: rolesCreados.colaborador,
        activo: true
      },
      {
        email: 'admin@automax.com',
        password: hashedPassword,
        nombre: 'Roberto',
        apellido: 'Maximiliano',
        telefono: '+54 9 11 4567-8901',
        empresa_id: empresasCreadas['AutoMax SA'],
        rol_id: rolesCreados.administrador_empresa,
        activo: true
      }
    ];

    for (const usuario of usuarios) {
      try {
        await prisma.usuario.upsert({
          where: { email: usuario.email },
          update: { 
            password: hashedPassword,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            telefono: usuario.telefono 
          },
          create: usuario
        });
        console.log(`✅ Usuario: ${usuario.email}`);
      } catch (error) {
        console.log(`⚠️  Error con usuario ${usuario.email}:`, error.message);
      }
    }
    console.log('✅ Usuarios creados:', usuarios.map(u => u.email));

    // 4. Crear estados de vehículos
    console.log('🚗 Creando estados de vehículos...');
    const estados = [
      { codigo: 'salon', nombre: 'En Salón', descripcion: 'Vehículo disponible para la venta en salón' },
      { codigo: 'consignacion', nombre: 'En Consignación', descripcion: 'Vehículo en consignación' },
      { codigo: 'pyc', nombre: 'Patio y Cochera', descripcion: 'Vehículo almacenado en patio' },
      { codigo: 'preparacion', nombre: 'En Preparación', descripcion: 'Vehículo siendo preparado para la venta' },
      { codigo: 'vendido', nombre: 'Vendido', descripcion: 'Vehículo vendido pero no entregado' },
      { codigo: 'entregado', nombre: 'Entregado', descripcion: 'Vehículo vendido y entregado al cliente' },
      { codigo: 'reservado', nombre: 'Reservado', descripcion: 'Vehículo reservado con seña' }
    ];

    const estadosCreados = {};
    for (const estado of estados) {
      const estadoCreado = await prisma.estadoVehiculo.upsert({
        where: { codigo: estado.codigo },
        update: estado,
        create: estado
      });
      estadosCreados[estado.codigo] = estadoCreado.id;
    }
    console.log('✅ Estados de vehículos creados:', Object.keys(estadosCreados));

    // 5. Crear modelos de autos variados
    console.log('🚘 Creando modelos de autos...');
    const modelos = [
      // Toyota
      {
        marca: 'Toyota',
        modelo: 'Corolla',
        version: 'XEI',
        modelo_ano: 2023,
        motorizacion: '2.0L',
        combustible: 'nafta',
        caja: 'manual',
        equipamiento: ['Air bag', 'ABS', 'Aire acondicionado', 'Dirección asistida', 'Cierre centralizado'],
        asistencias_manejo: ['Control de estabilidad', 'Asistente de frenado']
      },
      {
        marca: 'Toyota',
        modelo: 'Hilux',
        version: 'SRV 4x4',
        modelo_ano: 2022,
        motorizacion: '2.8L Turbo Diesel',
        combustible: 'diesel',
        caja: 'automatica',
        equipamiento: ['Air bag', 'ABS', 'Aire acondicionado', '4x4', 'Barra antivuelco'],
        asistencias_manejo: ['Control de tracción', 'Asistente de arranque en pendiente']
      },
      // Ford
      {
        marca: 'Ford',
        modelo: 'Focus',
        version: 'Titanium',
        modelo_ano: 2021,
        motorizacion: '2.0L',
        combustible: 'nafta',
        caja: 'automatica',
        equipamiento: ['Air bag', 'ABS', 'Aire acondicionado', 'Llantas de aleación', 'Multimedia'],
        asistencias_manejo: ['Control crucero', 'Sensores de estacionamiento']
      },
      {
        marca: 'Ford',
        modelo: 'Ranger',
        version: 'XLT 4x2',
        modelo_ano: 2023,
        motorizacion: '2.5L',
        combustible: 'nafta',
        caja: 'manual',
        equipamiento: ['Air bag', 'ABS', 'Aire acondicionado', 'Dirección asistida'],
        asistencias_manejo: ['Control de estabilidad']
      },
      // Chevrolet
      {
        marca: 'Chevrolet',
        modelo: 'Onix',
        version: 'LTZ',
        modelo_ano: 2022,
        motorizacion: '1.0L Turbo',
        combustible: 'nafta',
        caja: 'automatica',
        equipamiento: ['Air bag', 'ABS', 'Aire acondicionado', 'Multimedia', 'Llantas'],
        asistencias_manejo: ['Sensores de estacionamiento traseros']
      },
      {
        marca: 'Chevrolet',
        modelo: 'S10',
        version: 'LTZ 4x4',
        modelo_ano: 2021,
        motorizacion: '2.8L Turbo Diesel',
        combustible: 'diesel',
        caja: 'automatica',
        equipamiento: ['Air bag', 'ABS', 'Aire acondicionado', '4x4', 'Llantas de aleación'],
        asistencias_manejo: ['Control de tracción', 'Control de descenso']
      },
      // Volkswagen
      {
        marca: 'Volkswagen',
        modelo: 'Polo',
        version: 'Highline',
        modelo_ano: 2023,
        motorizacion: '1.6L',
        combustible: 'nafta',
        caja: 'manual',
        equipamiento: ['Air bag', 'ABS', 'Aire acondicionado', 'Dirección asistida'],
        asistencias_manejo: ['Control de estabilidad', 'ABS']
      },
      {
        marca: 'Volkswagen',
        modelo: 'Amarok',
        version: 'Highline 4x4',
        modelo_ano: 2022,
        motorizacion: '3.0L V6 Turbo Diesel',
        combustible: 'diesel',
        caja: 'automatica',
        equipamiento: ['Air bag', 'ABS', 'Aire acondicionado', '4x4', 'Cuero', 'Multimedia'],
        asistencias_manejo: ['Control crucero', 'Sensores 360°', 'Cámara trasera']
      },
      // Fiat
      {
        marca: 'Fiat',
        modelo: 'Cronos',
        version: 'Drive',
        modelo_ano: 2021,
        motorizacion: '1.3L',
        combustible: 'nafta',
        caja: 'manual',
        equipamiento: ['Air bag', 'ABS', 'Aire acondicionado'],
        asistencias_manejo: ['Control de estabilidad']
      },
      {
        marca: 'Fiat',
        modelo: 'Toro',
        version: 'Freedom',
        modelo_ano: 2023,
        motorizacion: '1.8L',
        combustible: 'nafta',
        caja: 'automatica',
        equipamiento: ['Air bag', 'ABS', 'Aire acondicionado', 'Multimedia', 'Llantas'],
        asistencias_manejo: ['Control de tracción', 'Sensores traseros']
      }
    ];

    const modelosCreados = {};
    for (const modelo of modelos) {
      const modeloCreado = await prisma.modeloAuto.upsert({
        where: {
          modelo_autos_unique_cols: {
            marca: modelo.marca,
            modelo: modelo.modelo,
            version: modelo.version,
            modelo_ano: modelo.modelo_ano
          }
        },
        update: modelo,
        create: modelo
      });
      const key = `${modelo.marca} ${modelo.modelo} ${modelo.version} ${modelo.modelo_ano}`;
      modelosCreados[key] = modeloCreado.id;
    }
    console.log('✅ Modelos de autos creados:', Object.keys(modelosCreados).length);

    // 6. Crear vendedores
    console.log('👨‍💼 Creando vendedores...');
    const vendedores = [
      {
        nombre: 'Juan Carlos',
        apellido: 'Pérez',
        telefono: '+54 9 11 5555-1111',
        email: 'juan.perez@email.com',
        dni: '12345678',
        ciudad: 'Buenos Aires',
        provincia: 'Buenos Aires',
        empresa_id: empresasCreadas['Fratelli Motors']
      },
      {
        nombre: 'Ana María',
        apellido: 'López',
        telefono: '+54 9 11 5555-2222',
        email: 'ana.lopez@email.com',
        dni: '87654321',
        ciudad: 'La Plata',
        provincia: 'Buenos Aires',
        empresa_id: empresasCreadas['Fratelli Motors']
      },
      {
        nombre: 'Roberto',
        apellido: 'Martínez',
        telefono: '+54 9 11 5555-3333',
        email: 'roberto.martinez@email.com',
        dni: '11223344',
        ciudad: 'Córdoba',
        provincia: 'Córdoba',
        empresa_id: empresasCreadas['AutoMax SA']
      },
      {
        nombre: 'Carmen',
        apellido: 'Silva',
        telefono: '+54 9 11 5555-4444',
        email: 'carmen.silva@email.com',
        dni: '44332211',
        ciudad: 'Rosario',
        provincia: 'Santa Fe',
        empresa_id: empresasCreadas['VelozCars']
      }
    ];

    const vendedoresCreados = [];
    for (const vendedor of vendedores) {
      const vendedorCreado = await prisma.vendedor.create({
        data: vendedor
      });
      vendedoresCreados.push(vendedorCreado);
    }
    console.log('✅ Vendedores creados:', vendedoresCreados.length);

    // 7. Crear compradores
    console.log('👥 Creando compradores...');
    const compradores = [
      {
        nombre: 'María Elena',
        apellido: 'García',
        telefono: '+54 9 11 6666-1111',
        email: 'maria.garcia@email.com',
        dni: '98765432',
        ciudad: 'Buenos Aires',
        provincia: 'Buenos Aires',
        empresa_id: empresasCreadas['Fratelli Motors']
      },
      {
        nombre: 'Luis Fernando',
        apellido: 'Rodríguez',
        telefono: '+54 9 11 6666-2222',
        email: 'luis.rodriguez@email.com',
        dni: '23456789',
        ciudad: 'San Isidro',
        provincia: 'Buenos Aires',
        empresa_id: empresasCreadas['Fratelli Motors']
      },
      {
        nombre: 'Patricia',
        apellido: 'Fernández',
        telefono: '+54 9 11 6666-3333',
        email: 'patricia.fernandez@email.com',
        dni: '34567890',
        ciudad: 'Mendoza',
        provincia: 'Mendoza',
        empresa_id: empresasCreadas['AutoMax SA']
      },
      {
        nombre: 'Diego',
        apellido: 'Morales',
        telefono: '+54 9 11 6666-4444',
        email: 'diego.morales@email.com',
        dni: '45678901',
        ciudad: 'Tucumán',
        provincia: 'Tucumán',
        empresa_id: empresasCreadas['VelozCars']
      }
    ];

    const compradoresCreados = [];
    for (const comprador of compradores) {
      const compradorCreado = await prisma.comprador.create({
        data: comprador
      });
      compradoresCreados.push(compradorCreado);
    }
    console.log('✅ Compradores creados:', compradoresCreados.length);

    // 8. Crear vehículos variados
    console.log('🚗 Creando vehículos...');
    const vehiculos = [
      {
        empresa_id: empresasCreadas['Fratelli Motors'],
        modelo_id: Object.values(modelosCreados)[0], // Toyota Corolla
        patente: 'ABC123',
        vehiculo_ano: 2023,
        kilometros: 15000,
        valor: 8500000,
        estado_id: estadosCreados['salon'],
        pendientes_preparacion: 'Lavado y encerado',
        comentarios: 'Excelente estado, único dueño'
      },
      {
        empresa_id: empresasCreadas['Fratelli Motors'],
        modelo_id: Object.values(modelosCreados)[1], // Toyota Hilux
        patente: 'DEF456',
        vehiculo_ano: 2022,
        kilometros: 32000,
        valor: 15200000,
        estado_id: estadosCreados['consignacion'],
        pendientes_preparacion: 'Revisión técnica',
        comentarios: 'Vehículo de trabajo en excelentes condiciones'
      },
      {
        empresa_id: empresasCreadas['AutoMax SA'],
        modelo_id: Object.values(modelosCreados)[2], // Ford Focus
        patente: 'GHI789',
        vehiculo_ano: 2021,
        kilometros: 28000,
        valor: 7800000,
        estado_id: estadosCreados['preparacion'],
        pendientes_preparacion: 'Cambio de aceite y filtros',
        comentarios: 'Mantenimiento al día'
      },
      {
        empresa_id: empresasCreadas['VelozCars'],
        modelo_id: Object.values(modelosCreados)[7], // VW Amarok
        patente: 'JKL012',
        vehiculo_ano: 2022,
        kilometros: 18000,
        valor: 18500000,
        estado_id: estadosCreados['salon'],
        pendientes_preparacion: null,
        comentarios: 'Pick-up premium, impecable'
      }
    ];

    const vehiculosCreados = [];
    for (const vehiculo of vehiculos) {
      const vehiculoCreado = await prisma.vehiculo.create({
        data: vehiculo
      });
      vehiculosCreados.push(vehiculoCreado);
    }
    console.log('✅ Vehículos creados:', vehiculosCreados.length);

    // 9. Crear operaciones de ejemplo
    console.log('📊 Creando operaciones...');
    const operaciones = [
      {
        empresa_id: empresasCreadas['Fratelli Motors'],
        vehiculo_id: vehiculosCreados[0].id,
        tipo: 'compra',
        fecha: new Date('2024-10-15'),
        monto: 7500000,
        estado: 'completada',
        vendedor_id: vendedoresCreados[0].id,
        observaciones: 'Compra de Toyota Corolla',
        datos_especificos: {
          forma_pago: 'transferencia',
          documentacion_completa: true,
          precio_final: 7500000
        }
      },
      {
        empresa_id: empresasCreadas['Fratelli Motors'],
        vehiculo_id: vehiculosCreados[0].id,
        tipo: 'seña',
        fecha: new Date('2024-11-01'),
        monto: 500000,
        estado: 'completada',
        comprador_id: compradoresCreados[0].id,
        observaciones: 'Seña para reservar Toyota Corolla',
        datos_especificos: {
          monto_total_acordado: 8500000,
          saldo_pendiente: 8000000,
          fecha_vencimiento: new Date('2024-11-30')
        }
      },
      {
        empresa_id: empresasCreadas['AutoMax SA'],
        vehiculo_id: vehiculosCreados[2].id,
        tipo: 'ingreso',
        fecha: new Date('2024-10-20'),
        monto: 0,
        estado: 'completada',
        observaciones: 'Ingreso de Ford Focus para venta',
        datos_especificos: {
          origen: 'Consignación',
          estado_ingreso: 'usado',
          documentacion_recibida: true,
          valuacion_inicial: 7800000
        }
      }
    ];

    for (const operacion of operaciones) {
      await prisma.operacion.create({
        data: operacion
      });
    }
    console.log('✅ Operaciones creadas:', operaciones.length);

    console.log('\n🎉 ¡Datos de prueba creados exitosamente!');
    console.log('\n📝 Credenciales de prueba:');
    console.log('- Admin General: admin@voonda.com / admin123');
    console.log('- Admin Fratelli: admin@fratelli.com / admin123');
    console.log('- Vendedor: vendedor@fratelli.com / admin123');
    console.log('- Admin AutoMax: admin@automax.com / admin123');

  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });