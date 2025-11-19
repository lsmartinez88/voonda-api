/**
 * Script para poblar completamente la base de datos con información abundante
 * SOLO OPERACIONES DE INSERCIÓN - NO DESTRUCTIVO
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Poblando base de datos con información completa...');
  console.log('⚠️  SOLO INSERCIONES - NO se eliminarán datos existentes');

  try {
    // 1. CREAR MÁS EMPRESAS (sin campos inexistentes)
    console.log('🏢 Agregando más empresas...');
    
    const empresas = [
      {
        nombre: 'AutoCenter Premium',
        descripcion: 'Concesionario de vehículos premium y de lujo',
        activa: true
      },
      {
        nombre: 'Motors Del Sur',
        descripcion: 'Venta de vehículos usados y 0km en zona sur',
        activa: true
      },
      {
        nombre: 'Elite Motors',
        descripcion: 'Especialistas en vehículos deportivos y de colección',
        activa: true
      },
      {
        nombre: 'Family Cars',
        descripcion: 'Vehículos familiares y utilitarios',
        activa: true
      }
    ];

    const empresasCreadas = [];
    for (const empresa of empresas) {
      try {
        const empresaCreada = await prisma.empresa.create({ data: empresa });
        empresasCreadas.push(empresaCreada);
        console.log(`  ✅ ${empresa.nombre} creada`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  ${empresa.nombre} ya existe`);
        } else {
          console.log(`  ❌ Error creando ${empresa.nombre}:`, error.message);
        }
      }
    }

    // Obtener todas las empresas para asignar usuarios y vehículos
    const todasLasEmpresas = await prisma.empresa.findMany();
    console.log(`📊 Total empresas disponibles: ${todasLasEmpresas.length}`);

    // 2. CREAR MÁS MODELOS DE AUTOS (solo campos existentes)
    console.log('🚗 Agregando más modelos de autos...');
    
    const modelosAutos = [
      // Toyota
      { marca: 'Toyota', modelo: 'Hilux', version: 'DX 4x2', modelo_ano: 2023, combustible: 'diesel', caja: 'manual', motorizacion: '2.4L', traccion: '4x2', segmento_modelo: 'pickup' },
      { marca: 'Toyota', modelo: 'Hilux', version: 'SRV 4x4', modelo_ano: 2023, combustible: 'diesel', caja: 'automatica', motorizacion: '2.8L', traccion: '4x4', segmento_modelo: 'pickup' },
      { marca: 'Toyota', modelo: 'Etios', version: 'XS', modelo_ano: 2022, combustible: 'nafta', caja: 'manual', motorizacion: '1.5L', traccion: 'delantera', segmento_modelo: 'sedan' },
      { marca: 'Toyota', modelo: 'RAV4', version: 'VX', modelo_ano: 2023, combustible: 'hibrido', caja: 'cvt', motorizacion: '2.5L Hybrid', traccion: 'awd', segmento_modelo: 'suv' },
      
      // Ford
      { marca: 'Ford', modelo: 'Ranger', version: 'XLT 4x4', modelo_ano: 2023, combustible: 'diesel', caja: 'automatica', motorizacion: '3.2L', traccion: '4x4', segmento_modelo: 'pickup' },
      { marca: 'Ford', modelo: 'EcoSport', version: 'Titanium', modelo_ano: 2022, combustible: 'nafta', caja: 'automatica', motorizacion: '2.0L', traccion: 'delantera', segmento_modelo: 'suv' },
      { marca: 'Ford', modelo: 'Ka', version: 'SEL', modelo_ano: 2021, combustible: 'nafta', caja: 'manual', motorizacion: '1.5L', traccion: 'delantera', segmento_modelo: 'hatchback' },
      { marca: 'Ford', modelo: 'Mustang', version: 'GT', modelo_ano: 2023, combustible: 'nafta', caja: 'automatica', motorizacion: '5.0L V8', traccion: 'trasera', segmento_modelo: 'deportivo' },
      
      // Chevrolet
      { marca: 'Chevrolet', modelo: 'Onix', version: 'LTZ', modelo_ano: 2023, combustible: 'nafta', caja: 'automatica', motorizacion: '1.0L Turbo', traccion: 'delantera', segmento_modelo: 'hatchback' },
      { marca: 'Chevrolet', modelo: 'Cruze', version: 'Premier', modelo_ano: 2022, combustible: 'nafta', caja: 'automatica', motorizacion: '1.4L Turbo', traccion: 'delantera', segmento_modelo: 'sedan' },
      { marca: 'Chevrolet', modelo: 'S10', version: 'LTZ 4x4', modelo_ano: 2023, combustible: 'diesel', caja: 'automatica', motorizacion: '2.8L', traccion: '4x4', segmento_modelo: 'pickup' },
      { marca: 'Chevrolet', modelo: 'Tracker', version: 'Premier', modelo_ano: 2023, combustible: 'nafta', caja: 'cvt', motorizacion: '1.2L Turbo', traccion: 'delantera', segmento_modelo: 'suv' },
      
      // Volkswagen
      { marca: 'Volkswagen', modelo: 'Gol', version: 'Comfortline', modelo_ano: 2022, combustible: 'nafta', caja: 'manual', motorizacion: '1.6L', traccion: 'delantera', segmento_modelo: 'hatchback' },
      { marca: 'Volkswagen', modelo: 'Polo', version: 'Highline', modelo_ano: 2023, combustible: 'nafta', caja: 'automatica', motorizacion: '1.6L', traccion: 'delantera', segmento_modelo: 'hatchback' },
      { marca: 'Volkswagen', modelo: 'Vento', version: 'Comfortline', modelo_ano: 2022, combustible: 'nafta', caja: 'manual', motorizacion: '1.6L', traccion: 'delantera', segmento_modelo: 'sedan' },
      { marca: 'Volkswagen', modelo: 'Amarok', version: 'Highline 4x4', modelo_ano: 2023, combustible: 'diesel', caja: 'automatica', motorizacion: '3.0L V6', traccion: '4x4', segmento_modelo: 'pickup' },
      
      // Honda
      { marca: 'Honda', modelo: 'City', version: 'EXL', modelo_ano: 2023, combustible: 'nafta', caja: 'cvt', motorizacion: '1.5L', traccion: 'delantera', segmento_modelo: 'sedan' },
      { marca: 'Honda', modelo: 'HR-V', version: 'EXL', modelo_ano: 2022, combustible: 'nafta', caja: 'cvt', motorizacion: '1.8L', traccion: 'delantera', segmento_modelo: 'suv' },
      { marca: 'Honda', modelo: 'CR-V', version: 'EXL', modelo_ano: 2023, combustible: 'nafta', caja: 'cvt', motorizacion: '1.5L Turbo', traccion: 'awd', segmento_modelo: 'suv' },
      
      // Nissan
      { marca: 'Nissan', modelo: 'Versa', version: 'Advance', modelo_ano: 2023, combustible: 'nafta', caja: 'cvt', motorizacion: '1.6L', traccion: 'delantera', segmento_modelo: 'sedan' },
      { marca: 'Nissan', modelo: 'Kicks', version: 'Advance', modelo_ano: 2023, combustible: 'nafta', caja: 'cvt', motorizacion: '1.6L', traccion: 'delantera', segmento_modelo: 'suv' }
    ];

    const modelosCreados = [];
    for (const modelo of modelosAutos) {
      try {
        const modeloCreado = await prisma.modeloAuto.create({ data: modelo });
        modelosCreados.push(modeloCreado);
        console.log(`  ✅ ${modelo.marca} ${modelo.modelo} ${modelo.version} creado`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  ${modelo.marca} ${modelo.modelo} ${modelo.version} ya existe`);
        } else {
          console.log(`  ❌ Error creando modelo:`, error.message);
        }
      }
    }

    // Obtener todos los modelos y estados para crear vehículos
    const todosLosModelos = await prisma.modeloAuto.findMany();
    const todosLosEstados = await prisma.estadoVehiculo.findMany();
    console.log(`📊 Total modelos disponibles: ${todosLosModelos.length}`);
    console.log(`📊 Total estados disponibles: ${todosLosEstados.length}`);

    // 3. CREAR VENDEDORES PARA CADA EMPRESA
    console.log('🧑‍💼 Creando vendedores...');
    
    const vendedoresCreados = [];
    for (const empresa of todasLasEmpresas) {
      const vendedoresEmpresa = [
        {
          empresa_id: empresa.id,
          nombre: 'Carlos',
          apellido: 'Rodríguez',
          email: `carlos.rodriguez@empresa${empresa.id.slice(0,8)}.com`,
          telefono: '+54 9 11 2345-6789',
          dni: '12345678',
          direccion: 'Av. Corrientes 1234',
          ciudad: 'Buenos Aires',
          provincia: 'CABA'
        },
        {
          empresa_id: empresa.id,
          nombre: 'María',
          apellido: 'González',
          email: `maria.gonzalez@empresa${empresa.id.slice(0,8)}.com`,
          telefono: '+54 9 11 3456-7890',
          dni: '23456789',
          direccion: 'Av. Santa Fe 567',
          ciudad: 'Buenos Aires',
          provincia: 'CABA'
        }
      ];

      for (const vendedor of vendedoresEmpresa) {
        try {
          const vendedorCreado = await prisma.vendedor.create({ data: vendedor });
          vendedoresCreados.push(vendedorCreado);
          console.log(`  ✅ Vendedor ${vendedor.nombre} ${vendedor.apellido} creado para ${empresa.nombre}`);
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`  ⚠️  Vendedor ${vendedor.email} ya existe`);
          } else {
            console.log(`  ❌ Error creando vendedor:`, error.message);
          }
        }
      }
    }

    // 4. CREAR COMPRADORES
    console.log('🛍️ Creando compradores...');
    
    const compradores = [
      { nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@gmail.com', telefono: '+54 9 11 5678-9012', dni: '45678901', direccion: 'Av. Rivadavia 123', ciudad: 'Buenos Aires', provincia: 'CABA' },
      { nombre: 'Ana', apellido: 'López', email: 'ana.lopez@gmail.com', telefono: '+54 9 11 6789-0123', dni: '56789012', direccion: 'Av. Belgrano 456', ciudad: 'Buenos Aires', provincia: 'CABA' },
      { nombre: 'Diego', apellido: 'Silva', email: 'diego.silva@hotmail.com', telefono: '+54 9 11 7890-1234', dni: '67890123', direccion: 'Av. San Martín 789', ciudad: 'La Plata', provincia: 'Buenos Aires' },
      { nombre: 'Claudia', apellido: 'Morales', email: 'claudia.morales@yahoo.com', telefono: '+54 9 11 8901-2345', dni: '78901234', direccion: 'Av. Mitre 012', ciudad: 'Quilmes', provincia: 'Buenos Aires' },
      { nombre: 'Pablo', apellido: 'Fernández', email: 'pablo.fernandez@gmail.com', telefono: '+54 9 11 9012-3456', dni: '89012345', direccion: 'Av. 9 de Julio 345', ciudad: 'San Isidro', provincia: 'Buenos Aires' },
      { nombre: 'Laura', apellido: 'García', email: 'laura.garcia@outlook.com', telefono: '+54 9 11 0123-4567', dni: '90123456', direccion: 'Av. Libertador 678', ciudad: 'Vicente López', provincia: 'Buenos Aires' }
    ];

    const compradoresCreados = [];
    for (const comprador of compradores) {
      try {
        const compradorCreado = await prisma.comprador.create({ data: comprador });
        compradoresCreados.push(compradorCreado);
        console.log(`  ✅ Comprador ${comprador.nombre} ${comprador.apellido} creado`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  Comprador ${comprador.email} ya existe`);
        } else {
          console.log(`  ❌ Error creando comprador:`, error.message);
        }
      }
    }

    // Obtener todos los vendedores y compradores para asignar a vehículos
    const todosLosVendedores = await prisma.vendedor.findMany();
    const todosLosCompradores = await prisma.comprador.findMany();
    console.log(`📊 Total vendedores: ${todosLosVendedores.length}`);
    console.log(`📊 Total compradores: ${todosLosCompradores.length}`);

    // 5. CREAR MUCHOS VEHÍCULOS
    console.log('🚙 Creando vehículos...');
    
    const patentes = [
      'ABC123', 'DEF456', 'GHI789', 'JKL012', 'MNO345', 'PQR678', 'STU901', 'VWX234',
      'YZA567', 'BCD890', 'EFG123', 'HIJ456', 'KLM789', 'NOP012', 'QRS345', 'TUV678',
      'WXY901', 'ZAB234', 'CDE567', 'FGH890', 'IJK123', 'LMN456', 'OPQ789', 'RST012',
      'UVW345', 'XYZ678', 'ABC901', 'DEF234', 'GHI567', 'JKL890', 'MNO123', 'PQR456',
      'STU789', 'VWX012', 'YZA345', 'BCD678', 'EFG901', 'HIJ234', 'KLM567', 'NOP890'
    ];

    const vehiculosCreados = [];
    for (let i = 0; i < Math.min(40, todosLosModelos.length * 2); i++) {
      const modelo = todosLosModelos[Math.floor(Math.random() * todosLosModelos.length)];
      const empresa = todasLasEmpresas[Math.floor(Math.random() * todasLasEmpresas.length)];
      const vendedoresEmpresa = todosLosVendedores.filter(v => v.empresa_id === empresa.id);
      
      if (vendedoresEmpresa.length === 0) continue; // Si no hay vendedores para esta empresa, saltar
      
      const vendedor = vendedoresEmpresa[0];
      const estado = todosLosEstados[Math.floor(Math.random() * todosLosEstados.length)];
      const comprador = estado.codigo === 'vendido' || estado.codigo === 'entregado' ? 
        todosLosCompradores[Math.floor(Math.random() * todosLosCompradores.length)] : null;

      const vehiculoData = {
        empresa_id: empresa.id,
        modelo_id: modelo.id,
        vendedor_id: vendedor.id,
        comprador_id: comprador?.id || null,
        estado_id: estado.id,
        vehiculo_ano: modelo.modelo_ano - Math.floor(Math.random() * 3), // Año del modelo o hasta 3 años anteriores
        patente: patentes[i] || `VEH${String(i).padStart(3, '0')}`,
        kilometros: Math.floor(Math.random() * 150000),
        valor: Math.floor(Math.random() * 50000000) + 5000000, // Entre 5M y 55M
        moneda: 'ARS',
        tipo_operacion: Math.random() > 0.7 ? 'consignacion' : 'compra',
        fecha_ingreso: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)), // Último año
        observaciones: `Vehículo en excelente estado. ${modelo.marca} ${modelo.modelo} ${modelo.version}`,
        pendientes_preparacion: estado.codigo === 'preparacion' ? ['Limpieza detallada', 'Verificación mecánica'] : [],
        comentarios: `Unidad ${i + 1} - ${estado.nombre}`,
        activo: true
      };

      try {
        const vehiculoCreado = await prisma.vehiculo.create({ data: vehiculoData });
        vehiculosCreados.push(vehiculoCreado);
        console.log(`  ✅ Vehículo ${vehiculoData.patente} creado (${modelo.marca} ${modelo.modelo})`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  Vehículo con patente ${vehiculoData.patente} ya existe`);
        } else {
          console.log(`  ❌ Error creando vehículo:`, error.message);
        }
      }
    }

    // 6. CREAR PUBLICACIONES PARA VEHÍCULOS
    console.log('📢 Creando publicaciones...');
    
    const plataformas = ['MercadoLibre', 'Facebook', 'Instagram', 'DeRuta', 'Neoauto', 'Autoscout24'];
    const publicacionesCreadas = [];

    for (const vehiculo of vehiculosCreados.slice(0, 30)) { // Solo para los primeros 30 vehículos
      const numPublicaciones = Math.floor(Math.random() * 3) + 1; // 1-3 publicaciones por vehículo
      
      for (let j = 0; j < numPublicaciones; j++) {
        const plataforma = plataformas[Math.floor(Math.random() * plataformas.length)];
        
        const publicacionData = {
          vehiculo_id: vehiculo.id,
          plataforma: plataforma,
          titulo: `${vehiculo.patente} - Vehículo en ${plataforma}`,
          url_publicacion: `https://${plataforma.toLowerCase()}.com/vehiculo/${vehiculo.id}`,
          id_publicacion: `PUB${vehiculo.patente}${j + 1}`,
          ficha_breve: `Excelente oportunidad. Financiamos en ${plataforma}`,
          activo: Math.random() > 0.2 // 80% activas
        };

        try {
          const publicacionCreada = await prisma.publicacionVehiculo.create({ data: publicacionData });
          publicacionesCreadas.push(publicacionCreada);
          console.log(`  ✅ Publicación en ${plataforma} para ${vehiculo.patente}`);
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`  ⚠️  Publicación ya existe para ${vehiculo.patente} en ${plataforma}`);
          } else {
            console.log(`  ❌ Error creando publicación:`, error.message);
          }
        }
      }
    }

    // RESUMEN FINAL
    console.log('\n🎉 POBLADO COMPLETO DE BASE DE DATOS FINALIZADO');
    console.log('=' .repeat(50));
    console.log(`📊 ESTADÍSTICAS FINALES:`);
    
    const stats = await Promise.all([
      prisma.empresa.count(),
      prisma.usuario.count(),
      prisma.vendedor.count(),
      prisma.comprador.count(),
      prisma.modeloAuto.count(),
      prisma.vehiculo.count(),
      prisma.publicacionVehiculo.count(),
      prisma.estadoVehiculo.count(),
      prisma.rol.count()
    ]);

    console.log(`🏢 Empresas: ${stats[0]}`);
    console.log(`👥 Usuarios: ${stats[1]}`);
    console.log(`🧑‍💼 Vendedores: ${stats[2]}`);
    console.log(`🛍️ Compradores: ${stats[3]}`);
    console.log(`🚗 Modelos de autos: ${stats[4]}`);
    console.log(`🚙 Vehículos: ${stats[5]}`);
    console.log(`📢 Publicaciones: ${stats[6]}`);
    console.log(`📋 Estados: ${stats[7]}`);
    console.log(`🔐 Roles: ${stats[8]}`);
    
    console.log('\n📝 CREDENCIALES DE ACCESO:');
    console.log('Admin General: admin@voonda.com / admin123');
    console.log('Admin Empresa Demo: admin.empresa@voonda.com / admin123');
    console.log('Colaborador Demo: colaborador@voonda.com / admin123');

  } catch (error) {
    console.error('❌ Error durante el poblado:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error en poblado completo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Desconexión de Prisma completada');
  });