/**
 * Script para poblar la base de datos con datos extensos de prueba
 * Ejecuta directamente en Supabase usando PrismaClient
 * Genera: 20+ vehículos, múltiples operaciones, vendedores, compradores
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Datos realistas para generar contenido variado
const MARCAS_MODELOS = [
  { marca: 'Toyota', modelos: ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Etios'] },
  { marca: 'Ford', modelos: ['Focus', 'Fiesta', 'EcoSport', 'Ranger', 'Mondeo'] },
  { marca: 'Chevrolet', modelos: ['Onix', 'Cruze', 'Tracker', 'S10', 'Spin'] },
  { marca: 'Volkswagen', modelos: ['Gol', 'Polo', 'Vento', 'Amarok', 'Tiguan'] },
  { marca: 'Fiat', modelos: ['Palio', 'Uno', 'Argo', 'Toro', 'Cronos'] },
  { marca: 'Renault', modelos: ['Logan', 'Sandero', 'Duster', 'Kangoo', 'Fluence'] },
  { marca: 'Peugeot', modelos: ['208', '308', '2008', 'Partner', '408'] },
  { marca: 'Honda', modelos: ['Civic', 'City', 'HR-V', 'CR-V', 'Fit'] },
  { marca: 'Nissan', modelos: ['March', 'Versa', 'Kicks', 'Frontier', 'X-Trail'] },
  { marca: 'Hyundai', modelos: ['i10', 'Accent', 'Elantra', 'Tucson', 'Creta'] }
];

const VERSIONES = ['Base', 'LT', 'LTZ', 'Premier', 'XL', 'XLS', 'Titanium', 'SEL', 'Trend', 'Comfort'];
const COMBUSTIBLES = ['Nafta', 'Diésel', 'GNC', 'Híbrido'];
const CAJAS = ['Manual', 'Automática', 'CVT'];
const ESTADOS_VEHICULO = ['disponible', 'reservado', 'vendido', 'en_reparacion', 'consignacion'];
const TIPOS_OPERACION = ['compra', 'venta', 'seña', 'transferencia'];
const ESTADOS_OPERACION = ['pendiente', 'completada', 'cancelada', 'en_proceso'];

// Nombres y apellidos realistas
const NOMBRES = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Patricia', 'Jorge', 'Carmen', 'Miguel', 'Rosa', 'Pedro', 'Laura', 'José', 'Marta', 'Antonio', 'Elena', 'Manuel', 'Sofía', 'Francisco', 'Isabel'];
const APELLIDOS = ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez', 'Muñoz', 'Romero', 'Alonso', 'Gutiérrez'];

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePatente() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  return `${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]}`;
}

function generatePhone() {
  return `+54 9 11 ${randomNumber(1000, 9999)}-${randomNumber(1000, 9999)}`;
}

function generateDNI() {
  return `${randomNumber(10000000, 99999999)}`;
}

function generateEmail(nombre, apellido) {
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com.ar', 'outlook.com'];
  return `${nombre.toLowerCase()}.${apellido.toLowerCase()}@${randomChoice(domains)}`;
}

function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function poblarBaseDatos() {
  console.log('🚀 Iniciando poblado masivo de base de datos...');
  
  try {
    // Obtener empresa existente
    const empresa = await prisma.empresa.findFirst();
    if (!empresa) {
      throw new Error('No se encontró empresa. Ejecuta primero el seed básico.');
    }
    
    console.log(`🏢 Usando empresa: ${empresa.nombre}`);

    // 1. Crear modelos de autos variados
    console.log('🚗 Creando modelos de autos...');
    const modelos = [];
    
    for (const marcaData of MARCAS_MODELOS) {
      for (let i = 0; i < Math.min(3, marcaData.modelos.length); i++) {
        const modelo = marcaData.modelos[i];
        const version = randomChoice(VERSIONES);
        const año = randomNumber(2018, 2024);
        
        try {
          const modeloCreado = await prisma.modeloAuto.create({
            data: {
              marca: marcaData.marca,
              modelo: modelo,
              version: version,
              modelo_ano: año,
              segmento_modelo: randomChoice(['Sedán', 'Hatchback', 'SUV', 'Pickup', 'Coupé']),
              motorizacion: randomChoice(['1.0', '1.4', '1.6', '2.0', '2.4', '3.0']),
              combustible: randomChoice(COMBUSTIBLES),
              caja: randomChoice(CAJAS),
              traccion: randomChoice(['Delantera', 'Trasera', '4x4']),
              cilindrada: randomNumber(1000, 3000),
              potencia_hp: randomNumber(70, 300),
              torque_nm: randomNumber(100, 450),
              rendimiento_mixto: (randomNumber(8, 18) + Math.random()).toFixed(1),
              equipamiento: [
                'ABS', 'Airbags', 'Aire Acondicionado', 'Cierre Centralizado',
                'Alarma', 'Computadora de Bordo', 'Control de Estabilidad'
              ].slice(0, randomNumber(3, 7)),
              asistencias_manejo: [
                'Control de Crucero', 'Asistente de Arranque en Pendiente',
                'Sensor de Lluvia', 'Sensores de Estacionamiento'
              ].slice(0, randomNumber(0, 4))
            }
          });
          modelos.push(modeloCreado);
          console.log(`  ✓ ${marcaData.marca} ${modelo} ${version} ${año}`);
        } catch (error) {
          console.log(`  ⚠️ Modelo ya existe: ${marcaData.marca} ${modelo} ${version} ${año}`);
        }
      }
    }
    
    console.log(`✅ Modelos creados: ${modelos.length}`);

    // 2. Crear vendedores
    console.log('👥 Creando vendedores...');
    const vendedores = [];
    
    for (let i = 0; i < 8; i++) {
      const nombre = randomChoice(NOMBRES);
      const apellido = randomChoice(APELLIDOS);
      
      const vendedor = await prisma.vendedor.create({
        data: {
          empresa_id: empresa.id,
          nombre: nombre,
          apellido: apellido,
          telefono: generatePhone(),
          email: generateEmail(nombre, apellido),
          dni: generateDNI(),
          direccion: `${randomChoice(['Av.', 'Calle', 'Pasaje'])} ${randomChoice(['San Martín', 'Rivadavia', 'Belgrano', 'Mitre'])} ${randomNumber(100, 9999)}`,
          observaciones: i % 3 === 0 ? `Vendedor desde ${randomNumber(2015, 2023)}` : null
        }
      });
      vendedores.push(vendedor);
      console.log(`  ✓ ${nombre} ${apellido}`);
    }

    // 3. Crear compradores
    console.log('🛒 Creando compradores...');
    const compradores = [];
    
    for (let i = 0; i < 12; i++) {
      const nombre = randomChoice(NOMBRES);
      const apellido = randomChoice(APELLIDOS);
      
      const comprador = await prisma.comprador.create({
        data: {
          empresa_id: empresa.id,
          nombre: nombre,
          apellido: apellido,
          telefono: generatePhone(),
          email: generateEmail(nombre, apellido),
          dni: generateDNI(),
          direccion: `${randomChoice(['Av.', 'Calle', 'Pasaje'])} ${randomChoice(['Independencia', 'Corrientes', 'Santa Fe', '9 de Julio'])} ${randomNumber(100, 9999)}`,
          observaciones: i % 4 === 0 ? `Cliente referido por ${randomChoice(NOMBRES)}` : null
        }
      });
      compradores.push(comprador);
      console.log(`  ✓ ${nombre} ${apellido}`);
    }

    // 4. Crear vehículos
    console.log('🚙 Creando vehículos...');
    const vehiculos = [];
    
    for (let i = 0; i < 25; i++) {
      const modelo = randomChoice(modelos);
      const año = randomNumber(modelo.modelo_ano - 2, modelo.modelo_ano);
      const vendedor = Math.random() < 0.7 ? randomChoice(vendedores) : null;
      const comprador = Math.random() < 0.4 ? randomChoice(compradores) : null;
      
      const vehiculo = await prisma.vehiculo.create({
        data: {
          empresa_id: empresa.id,
          modelo_id: modelo.id,
          patente: generatePatente(),
          vehiculo_ano: año,
          kilometros: randomNumber(0, 150000),
          valor: randomNumber(800000, 8000000),
          moneda: 'ARS',
          estado: randomChoice(ESTADOS_VEHICULO),
          observaciones: Math.random() < 0.3 ? 
            randomChoice([
              'Vehículo en excelente estado',
              'Único dueño, service completo',
              'Vehículo con algunos detalles de chapa',
              'Motor reparado recientemente',
              'Documentación al día'
            ]) : null,
          vendedor_id: vendedor?.id,
          comprador_id: comprador?.id
        }
      });
      vehiculos.push(vehiculo);
      console.log(`  ✓ ${modelo.marca} ${modelo.modelo} ${año} - ${vehiculo.patente}`);
    }

    // 5. Crear operaciones variadas
    console.log('📋 Creando operaciones...');
    let operacionesCreadas = 0;
    
    for (const vehiculo of vehiculos) {
      // Cada vehículo puede tener 1-4 operaciones
      const numOperaciones = randomNumber(1, 4);
      
      for (let i = 0; i < numOperaciones; i++) {
        const tipo = randomChoice(TIPOS_OPERACION);
        const fecha = generateRandomDate(new Date('2023-01-01'), new Date());
        
        let vendedor_id = null;
        let comprador_id = null;
        let monto = null;
        
        // Asignar vendedor/comprador según tipo de operación
        if (tipo === 'compra') {
          vendedor_id = randomChoice(vendedores).id;
          monto = randomNumber(500000, vehiculo.valor * 0.8);
        } else if (tipo === 'venta') {
          comprador_id = randomChoice(compradores).id;
          monto = randomNumber(vehiculo.valor * 0.8, vehiculo.valor * 1.2);
        } else if (tipo === 'seña') {
          comprador_id = randomChoice(compradores).id;
          monto = randomNumber(50000, 500000);
        }
        
        const operacion = await prisma.operacion.create({
          data: {
            empresa_id: empresa.id,
            vehiculo_id: vehiculo.id,
            tipo: tipo,
            fecha: fecha,
            monto: monto,
            moneda: 'ARS',
            estado: randomChoice(ESTADOS_OPERACION),
            vendedor_id: vendedor_id,
            comprador_id: comprador_id,
            datos_especificos: tipo === 'seña' ? {
              porcentaje_seña: randomNumber(10, 50),
              fecha_vencimiento: new Date(fecha.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
            } : null,
            observaciones: Math.random() < 0.4 ? 
              randomChoice([
                'Operación realizada sin inconvenientes',
                'Cliente muy conforme con el servicio',
                'Pendiente documentación',
                'Operación cerrada exitosamente',
                'Requiere seguimiento'
              ]) : null
          }
        });
        operacionesCreadas++;
      }
    }

    console.log('🎉 ¡Poblado completado exitosamente!');
    console.log('📊 Resumen de datos creados:');
    console.log(`   - Modelos de autos: ${modelos.length}`);
    console.log(`   - Vendedores: ${vendedores.length}`);
    console.log(`   - Compradores: ${compradores.length}`);
    console.log(`   - Vehículos: ${vehiculos.length}`);
    console.log(`   - Operaciones: ${operacionesCreadas}`);
    
    // Estadísticas adicionales
    const stats = await prisma.operacion.groupBy({
      by: ['tipo'],
      _count: { id: true }
    });
    
    console.log('\n📈 Distribución de operaciones:');
    stats.forEach(stat => {
      console.log(`   - ${stat.tipo}: ${stat._count.id}`);
    });

  } catch (error) {
    console.error('❌ Error durante el poblado:', error);
    throw error;
  }
}

// Ejecutar script
poblarBaseDatos()
  .then(() => {
    console.log('✅ Script completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });