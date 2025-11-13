const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed con esquema unificado...');

  try {
    // 1. Crear roles del sistema
    console.log('📋 Creando roles...');
    const roles = await Promise.all([
      prisma.rol.upsert({
        where: { nombre: 'administrador_general' },
        update: {},
        create: {
          nombre: 'administrador_general',
          descripcion: 'Administrador con acceso total al sistema',
          permisos: {
            empresas: ['create', 'read', 'update', 'delete'],
            usuarios: ['create', 'read', 'update', 'delete'],
            vehiculos: ['create', 'read', 'update', 'delete'],
            operaciones: ['create', 'read', 'update', 'delete'],
            reportes: ['read']
          }
        }
      }),
      prisma.rol.upsert({
        where: { nombre: 'administrador_empresa' },
        update: {},
        create: {
          nombre: 'administrador_empresa',
          descripcion: 'Administrador de una empresa específica',
          permisos: {
            usuarios: ['create', 'read', 'update'],
            vehiculos: ['create', 'read', 'update', 'delete'],
            operaciones: ['create', 'read', 'update', 'delete'],
            reportes: ['read']
          }
        }
      }),
      prisma.rol.upsert({
        where: { nombre: 'colaborador' },
        update: {},
        create: {
          nombre: 'colaborador',
          descripcion: 'Usuario colaborador con permisos limitados',
          permisos: {
            vehiculos: ['read', 'update'],
            operaciones: ['create', 'read', 'update']
          }
        }
      })
    ]);

    console.log('✅ Roles creados');

    // 2. Crear empresa de ejemplo
    console.log('🏢 Creando empresa...');
    const empresa = await prisma.empresa.create({
      data: {
        nombre: 'Fratelli Motors',
        descripcion: 'Concesionaria especializada en vehículos de calidad',
        activa: true
      }
    });

    // 3. Crear usuario administrador general
    console.log('👤 Creando usuario admin...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.usuario.upsert({
      where: { email: 'admin@voonda.com' },
      update: {},
      create: {
        email: 'admin@voonda.com',
        password: adminPassword,
        nombre: 'Super',
        apellido: 'Admin',
        telefono: '+54 9 11 1234-5678',
        rol_id: roles[0].id, // administrador_general
        empresa_id: null // Admin general no pertenece a empresa específica
      }
    });

    // 4. Crear usuario de empresa
    console.log('👤 Creando usuario de empresa...');
    const empresaPassword = await bcrypt.hash('empresa123', 10);
    const empresaUser = await prisma.usuario.upsert({
      where: { email: 'admin@fratelli.com' },
      update: {},
      create: {
        email: 'admin@fratelli.com',
        password: empresaPassword,
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '+54 9 11 9876-5432',
        rol_id: roles[1].id, // administrador_empresa
        empresa_id: empresa.id
      }
    });

    // 5. Crear algunos modelos de autos
    console.log('🚗 Creando modelos de autos...');
    const modelos = await Promise.all([
      prisma.modeloAuto.upsert({
        where: { 
          marca_modelo_version_modelo_ano: {
            marca: 'Toyota',
            modelo: 'Corolla',
            version: 'XEI',
            modelo_ano: 2023
          }
        },
        update: {},
        create: {
          marca: 'Toyota',
          modelo: 'Corolla',
          version: 'XEI',
          modelo_ano: 2023,
          segmento_modelo: 'Sedán',
          motorizacion: '2.0',
          combustible: 'Nafta',
          caja: 'CVT',
          traccion: 'Delantera',
          cilindrada: 2000,
          potencia_hp: 170,
          equipamiento: ['ABS', 'Airbags', 'Aire Acondicionado', 'Cierre Centralizado']
        }
      }),
      prisma.modeloAuto.upsert({
        where: {
          marca_modelo_version_modelo_ano: {
            marca: 'Ford',
            modelo: 'Focus',
            version: 'Titanium',
            modelo_ano: 2022
          }
        },
        update: {},
        create: {
          marca: 'Ford',
          modelo: 'Focus',
          version: 'Titanium',
          modelo_ano: 2022,
          segmento_modelo: 'Hatchback',
          motorizacion: '2.0',
          combustible: 'Nafta',
          caja: 'Manual',
          traccion: 'Delantera',
          cilindrada: 2000,
          potencia_hp: 160,
          equipamiento: ['ABS', 'ESP', 'Airbags', 'Climatizador']
        }
      })
    ]);

    // 6. Crear vendedores y compradores
    console.log('👥 Creando vendedores y compradores...');
    const vendedor = await prisma.vendedor.create({
      data: {
        empresa_id: empresa.id,
        nombre: 'Carlos',
        apellido: 'Rodriguez',
        telefono: '+54 9 11 2222-3333',
        email: 'carlos@example.com',
        dni: '12345678'
      }
    });

    const comprador = await prisma.comprador.create({
      data: {
        empresa_id: empresa.id,
        nombre: 'María',
        apellido: 'González',
        telefono: '+54 9 11 4444-5555',
        email: 'maria@example.com',
        dni: '87654321'
      }
    });

    console.log('✅ Seed completado exitosamente');
    console.log('📊 Datos creados:');
    console.log(`   - Roles: ${roles.length}`);
    console.log(`   - Empresas: 1`);
    console.log(`   - Usuarios: 2`);
    console.log(`   - Modelos: ${modelos.length}`);
    console.log(`   - Vendedores: 1`);
    console.log(`   - Compradores: 1`);

    console.log('\n🔑 Credenciales de acceso:');
    console.log('   Admin General: admin@voonda.com / admin123');
    console.log('   Admin Empresa: admin@fratelli.com / empresa123');

  } catch (error) {
    console.error('❌ Error en seed:', error);
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