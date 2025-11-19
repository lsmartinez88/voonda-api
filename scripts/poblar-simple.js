/**
 * Script simplificado para poblar la base de datos con información básica
 * SOLO CAMPOS EXISTENTES - NO DESTRUCTIVO
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Poblando base de datos con información básica...');
  console.log('⚠️  SOLO INSERCIONES SEGURAS');

  try {
    // 1. CREAR VENDEDORES BÁSICOS
    console.log('🧑‍💼 Creando vendedores...');
    
    const empresas = await prisma.empresa.findMany();
    let vendedoresCreados = 0;
    
    for (const empresa of empresas) {
      const vendedores = [
        {
          empresa_id: empresa.id,
          nombre: 'Carlos',
          apellido: 'Rodríguez',
          email: `carlos.rodriguez.${empresa.id.slice(0,8)}@empresa.com`,
          telefono: '+54 9 11 2345-6789',
          dni: '12345678',
          direccion: 'Av. Corrientes 1234'
        },
        {
          empresa_id: empresa.id,
          nombre: 'María',
          apellido: 'González',
          email: `maria.gonzalez.${empresa.id.slice(0,8)}@empresa.com`,
          telefono: '+54 9 11 3456-7890',
          dni: '23456789',
          direccion: 'Av. Santa Fe 567'
        }
      ];

      for (const vendedor of vendedores) {
        try {
          await prisma.vendedor.create({ data: vendedor });
          vendedoresCreados++;
          console.log(`  ✅ ${vendedor.nombre} ${vendedor.apellido} creado`);
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`  ⚠️  ${vendedor.email} ya existe`);
          } else {
            console.log(`  ❌ Error: ${error.message}`);
          }
        }
      }
    }

    // 2. CREAR COMPRADORES BÁSICOS
    console.log('🛍️ Creando compradores...');
    
    const empresaPrincipal = empresas[0];
    let compradoresCreados = 0;
    
    const compradores = [
      {
        empresa_id: empresaPrincipal.id,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@gmail.com',
        telefono: '+54 9 11 5678-9012',
        dni: '45678901',
        direccion: 'Av. Rivadavia 123'
      },
      {
        empresa_id: empresaPrincipal.id,
        nombre: 'Ana',
        apellido: 'López',
        email: 'ana.lopez@gmail.com',
        telefono: '+54 9 11 6789-0123',
        dni: '56789012',
        direccion: 'Av. Belgrano 456'
      },
      {
        empresa_id: empresaPrincipal.id,
        nombre: 'Diego',
        apellido: 'Silva',
        email: 'diego.silva@hotmail.com',
        telefono: '+54 9 11 7890-1234',
        dni: '67890123',
        direccion: 'Av. San Martín 789'
      }
    ];

    for (const comprador of compradores) {
      try {
        await prisma.comprador.create({ data: comprador });
        compradoresCreados++;
        console.log(`  ✅ ${comprador.nombre} ${comprador.apellido} creado`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  ${comprador.email} ya existe`);
        } else {
          console.log(`  ❌ Error: ${error.message}`);
        }
      }
    }

    // 3. CREAR VEHÍCULOS BÁSICOS
    console.log('🚙 Creando vehículos...');
    
    const modelos = await prisma.modeloAuto.findMany();
    const estados = await prisma.estadoVehiculo.findMany();
    const vendedores = await prisma.vendedor.findMany();
    const todosLosCompradores = await prisma.comprador.findMany();
    
    let vehiculosCreados = 0;
    const patentes = ['ABC123', 'DEF456', 'GHI789', 'JKL012', 'MNO345', 'PQR678', 'STU901', 'VWX234'];

    for (let i = 0; i < Math.min(8, modelos.length) && i < patentes.length; i++) {
      const modelo = modelos[i];
      const vendedor = vendedores[i % vendedores.length];
      const estado = estados[i % estados.length];
      const comprador = Math.random() > 0.5 ? todosLosCompradores[i % todosLosCompradores.length] : null;

      if (!vendedor) continue;

      const vehiculoData = {
        empresa_id: vendedor.empresa_id,
        modelo_id: modelo.id,
        vendedor_id: vendedor.id,
        comprador_id: comprador?.id || null,
        estado_id: estado.id,
        vehiculo_ano: modelo.modelo_ano,
        patente: patentes[i],
        kilometros: Math.floor(Math.random() * 100000),
        valor: Math.floor(Math.random() * 30000000) + 10000000, // Entre 10M y 40M
        moneda: 'ARS',
        tipo_operacion: Math.random() > 0.5 ? 'consignacion' : 'compra',
        fecha_ingreso: new Date(),
        observaciones: `${modelo.marca} ${modelo.modelo} ${modelo.version} en excelente estado`,
        comentarios: `Vehículo ${i + 1}`,
        activo: true
      };

      try {
        await prisma.vehiculo.create({ data: vehiculoData });
        vehiculosCreados++;
        console.log(`  ✅ ${vehiculoData.patente} creado (${modelo.marca} ${modelo.modelo})`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  ${vehiculoData.patente} ya existe`);
        } else {
          console.log(`  ❌ Error: ${error.message}`);
        }
      }
    }

    // 4. CREAR PUBLICACIONES PARA ALGUNOS VEHÍCULOS
    console.log('📢 Creando publicaciones...');
    
    const vehiculos = await prisma.vehiculo.findMany({ take: 5 });
    let publicacionesCreadas = 0;
    
    const plataformas = ['MercadoLibre', 'Facebook', 'Instagram', 'DeRuta', 'Neoauto'];

    for (const vehiculo of vehiculos) {
      const plataforma = plataformas[Math.floor(Math.random() * plataformas.length)];
      
      const publicacionData = {
        vehiculo_id: vehiculo.id,
        plataforma: plataforma,
        titulo: `${vehiculo.patente} - Excelente oportunidad`,
        url_publicacion: `https://${plataforma.toLowerCase()}.com/vehiculo/${vehiculo.id}`,
        id_publicacion: `PUB${vehiculo.patente}`,
        ficha_breve: 'Vehículo en excelente estado. Financiamos.',
        activo: true
      };

      try {
        await prisma.publicacionVehiculo.create({ data: publicacionData });
        publicacionesCreadas++;
        console.log(`  ✅ Publicación en ${plataforma} para ${vehiculo.patente}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  Publicación ya existe para ${vehiculo.patente}`);
        } else {
          console.log(`  ❌ Error: ${error.message}`);
        }
      }
    }

    // RESUMEN FINAL
    console.log('\n🎉 POBLADO BÁSICO FINALIZADO');
    console.log('=' .repeat(40));
    
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

    console.log(`📊 ESTADÍSTICAS:`);
    console.log(`🏢 Empresas: ${stats[0]}`);
    console.log(`👥 Usuarios: ${stats[1]}`);
    console.log(`🧑‍💼 Vendedores: ${stats[2]} (+${vendedoresCreados} nuevos)`);
    console.log(`🛍️ Compradores: ${stats[3]} (+${compradoresCreados} nuevos)`);
    console.log(`🚗 Modelos de autos: ${stats[4]}`);
    console.log(`🚙 Vehículos: ${stats[5]} (+${vehiculosCreados} nuevos)`);
    console.log(`📢 Publicaciones: ${stats[6]} (+${publicacionesCreadas} nuevas)`);
    console.log(`📋 Estados: ${stats[7]}`);
    console.log(`🔐 Roles: ${stats[8]}`);
    
    console.log('\n📝 CREDENCIALES:');
    console.log('Admin General: admin@voonda.com / admin123');
    console.log('Admin Empresa: admin.empresa@voonda.com / admin123');
    console.log('Colaborador: colaborador@voonda.com / admin123');

    console.log('\n✅ Base de datos poblada exitosamente con datos de prueba');

  } catch (error) {
    console.error('❌ Error durante el poblado:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error en poblado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Desconexión completada');
  });