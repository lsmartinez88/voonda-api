const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear roles por defecto
  console.log('📋 Creando roles del sistema...');
  
  const colaboradorRol = await prisma.rol.upsert({
    where: { nombre: 'colaborador' },
    update: {},
    create: {
      nombre: 'colaborador',
      descripcion: 'Colaborador de empresa - acceso limitado a funciones básicas',
      permisos: {
        vehiculos: {
          leer: true,
          crear: false,
          editar: false,
          eliminar: false
        },
        reportes: {
          leer: false,
          crear: false
        },
        configuracion: {
          leer: false,
          editar: false
        }
      }
    }
  });

  const adminEmpresaRol = await prisma.rol.upsert({
    where: { nombre: 'administrador_empresa' },
    update: {},
    create: {
      nombre: 'administrador_empresa',
      descripcion: 'Administrador de empresa - control total dentro de su empresa',
      permisos: {
        vehiculos: {
          leer: true,
          crear: true,
          editar: true,
          eliminar: true
        },
        usuarios: {
          leer: true,
          crear: true,
          editar: true,
          eliminar: false // Solo puede desactivar
        },
        reportes: {
          leer: true,
          crear: true
        },
        configuracion: {
          leer: true,
          editar: true
        }
      }
    }
  });

  const adminGeneralRol = await prisma.rol.upsert({
    where: { nombre: 'administrador_general' },
    update: {},
    create: {
      nombre: 'administrador_general',
      descripcion: 'Administrador general del sistema - control total multi-empresa',
      permisos: {
        empresas: {
          leer: true,
          crear: true,
          editar: true,
          eliminar: true
        },
        usuarios: {
          leer: true,
          crear: true,
          editar: true,
          eliminar: true
        },
        vehiculos: {
          leer: true,
          crear: true,
          editar: true,
          eliminar: true
        },
        reportes: {
          leer: true,
          crear: true
        },
        configuracion: {
          leer: true,
          editar: true
        },
        sistema: {
          configuracion: true,
          logs: true,
          backups: true
        }
      }
    }
  });

  console.log('✅ Roles creados:', {
    colaborador: colaboradorRol.id,
    administrador_empresa: adminEmpresaRol.id,
    administrador_general: adminGeneralRol.id
  });

  // Crear empresa de ejemplo
  console.log('🏢 Creando empresa de ejemplo...');
  
  const empresaEjemplo = await prisma.empresa.create({
    data: {
      nombre: 'Voonda Motors Demo',
      descripcion: 'Empresa de demostración para el sistema Voonda',
      logo_url: 'https://via.placeholder.com/200x100/0066cc/ffffff?text=Voonda+Demo'
    }
  });

  console.log('✅ Empresa de ejemplo creada:', empresaEjemplo.id);

  // Crear estados de vehículos
  console.log('🚗 Creando estados de vehículos...');
  
  const estadosVehiculo = [
    {
      codigo: "salon",
      nombre: "En Salón",
      descripcion: "Vehículo disponible en salón de exposición para la venta."
    },
    {
      codigo: "consignacion", 
      nombre: "En Consignación",
      descripcion: "Vehículo ofrecido en consignación por un tercero."
    },
    {
      codigo: "pyc",
      nombre: "Permuta y Compra",
      descripcion: "Vehículo en gestión mixta (permuta y compra o consignación)."
    },
    {
      codigo: "preparacion",
      nombre: "En Preparación", 
      descripcion: "Vehículo en preparación mecánica, estética o documental antes de publicarse o entregarse."
    },
    {
      codigo: "vendido",
      nombre: "Vendido",
      descripcion: "Vehículo vendido, pendiente de entrega al comprador."
    },
    {
      codigo: "entregado",
      nombre: "Entregado",
      descripcion: "Vehículo entregado al cliente; venta finalizada."
    }
  ];

  const estadosCreados = [];
  for (const estado of estadosVehiculo) {
    const estadoCreado = await prisma.estadoVehiculo.upsert({
      where: { codigo: estado.codigo },
      update: {},
      create: estado
    });
    estadosCreados.push(estadoCreado);
  }

  console.log('✅ Estados de vehículos creados:', estadosCreados.map(e => `${e.codigo}: ${e.id}`));

  // Crear algunos modelos de auto de ejemplo
  console.log('🚘 Creando modelos de autos de ejemplo...');
  
  const modelosAuto = [
    {
      marca: "Toyota",
      modelo: "Corolla",
      version: "XEi",
      modelo_ano: 2020,
      combustible: "gasolina",
      caja: "manual",
      motorizacion: "1.8L"
    },
    {
      marca: "Honda", 
      modelo: "Civic",
      version: "EX",
      modelo_ano: 2021,
      combustible: "gasolina",
      caja: "automatica",
      motorizacion: "2.0L"
    },
    {
      marca: "Ford",
      modelo: "Focus",
      version: "SE",
      modelo_ano: 2019,
      combustible: "gasolina",
      caja: "manual",
      motorizacion: "1.6L"
    }
  ];

  const modelosCreados = [];
  for (const modelo of modelosAuto) {
    const modeloCreado = await prisma.modeloAuto.create({
      data: modelo
    });
    modelosCreados.push(modeloCreado);
  }

  console.log('✅ Modelos de autos creados:', modelosCreados.map(m => `${m.marca} ${m.modelo}: ${m.id}`));

  // Crear usuario administrador general por defecto
  console.log('👤 Creando usuario administrador general...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.usuario.upsert({
    where: { email: 'admin@voonda.com' },
    update: {},
    create: {
      email: 'admin@voonda.com',
      password: hashedPassword,
      nombre: 'Administrador',
      apellido: 'General',
      rol_id: adminGeneralRol.id,
      empresa_id: null // Administrador general no pertenece a una empresa específica
    }
  });

  // Crear usuario administrador de empresa de ejemplo
  const adminEmpresaUser = await prisma.usuario.upsert({
    where: { email: 'admin.empresa@voonda.com' },
    update: {},
    create: {
      email: 'admin.empresa@voonda.com',
      password: hashedPassword,
      nombre: 'Administrador',
      apellido: 'Empresa Demo',
      rol_id: adminEmpresaRol.id,
      empresa_id: empresaEjemplo.id
    }
  });

  // Crear usuario colaborador de ejemplo
  const colaboradorUser = await prisma.usuario.upsert({
    where: { email: 'colaborador@voonda.com' },
    update: {},
    create: {
      email: 'colaborador@voonda.com',
      password: hashedPassword,
      nombre: 'Colaborador',
      apellido: 'Demo',
      rol_id: colaboradorRol.id,
      empresa_id: empresaEjemplo.id
    }
  });

  console.log('✅ Usuarios de ejemplo creados:', {
    admin_general: adminUser.id,
    admin_empresa: adminEmpresaUser.id,
    colaborador: colaboradorUser.id
  });

  console.log('🎉 Seed completado exitosamente!');
  console.log('\n📋 Credenciales de prueba:');
  console.log('Admin General: admin@voonda.com / admin123');
  console.log('Admin Empresa: admin.empresa@voonda.com / admin123');
  console.log('Colaborador: colaborador@voonda.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });