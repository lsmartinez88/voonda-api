/**
 * Endpoint temporal para sincronizar schema en producción
 * USAR SOLO UNA VEZ PARA APLICAR CAMBIOS DE SCHEMA
 */

const express = require('express');
const { prisma } = require('../utils/prisma');
const router = express.Router();

/**
 * POST /api/admin/sync-schema
 * Sincronizar schema usando SQL directo
 */
router.post('/sync-schema', async (req, res) => {
  try {
    console.log('🔧 Iniciando sincronización de schema...');
    
    // Crear tablas que faltan usando SQL directo (dividido en comandos separados)
    const commands = [
      // Crear tabla vendedores
      `CREATE TABLE IF NOT EXISTS vendedores (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        empresa_id UUID NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT,
        telefono TEXT,
        email TEXT,
        dni TEXT,
        direccion TEXT,
        ciudad TEXT,
        provincia TEXT,
        codigo_postal TEXT,
        origen TEXT,
        comentarios TEXT,
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ(6) DEFAULT now(),
        updated_at TIMESTAMPTZ(6) DEFAULT now()
      )`,

      // Crear tabla compradores
      `CREATE TABLE IF NOT EXISTS compradores (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        empresa_id UUID NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT,
        telefono TEXT,
        email TEXT,
        dni TEXT,
        direccion TEXT,
        ciudad TEXT,
        provincia TEXT,
        codigo_postal TEXT,
        origen TEXT,
        comentarios TEXT,
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ(6) DEFAULT now(),
        updated_at TIMESTAMPTZ(6) DEFAULT now()
      )`,

      // Crear tabla operaciones
      `CREATE TABLE IF NOT EXISTS operaciones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        empresa_id UUID NOT NULL,
        vehiculo_id UUID NOT NULL,
        tipo TEXT NOT NULL,
        fecha DATE NOT NULL,
        monto DECIMAL(12,2),
        moneda TEXT DEFAULT 'ARS',
        estado TEXT DEFAULT 'pendiente',
        vendedor_id UUID,
        comprador_id UUID,
        usuario_id UUID,
        datos_especificos JSONB,
        observaciones TEXT,
        created_at TIMESTAMPTZ(6) DEFAULT now(),
        updated_at TIMESTAMPTZ(6) DEFAULT now()
      )`,

      // Agregar columnas a modelo_autos
      'ALTER TABLE modelo_autos ADD COLUMN IF NOT EXISTS equipamiento TEXT[] DEFAULT \'{}\'',
      'ALTER TABLE modelo_autos ADD COLUMN IF NOT EXISTS asistencias_manejo TEXT[] DEFAULT \'{}\'',

      // Agregar columnas a vehiculos
      'ALTER TABLE vehiculos ADD COLUMN IF NOT EXISTS pendientes_preparacion TEXT',
      'ALTER TABLE vehiculos ADD COLUMN IF NOT EXISTS comentarios TEXT',
      'ALTER TABLE vehiculos ADD COLUMN IF NOT EXISTS vendedor_id UUID',
      'ALTER TABLE vehiculos ADD COLUMN IF NOT EXISTS comprador_id UUID',
    ];

    const results = [];
    
    // Ejecutar comandos uno por uno
    for (const command of commands) {
      try {
        await prisma.$executeRawUnsafe(command);
        results.push({ command: command.substring(0, 50) + '...', status: 'success' });
      } catch (error) {
        results.push({ command: command.substring(0, 50) + '...', status: 'error', error: error.message });
      }
    }
    
    console.log('✅ Schema sincronizado exitosamente');
    
    return res.json({
      success: true,
      message: 'Schema sincronizado exitosamente',
      results: results,
      tables_created: ['vendedores', 'compradores', 'operaciones'],
      columns_added: ['modelo_autos.equipamiento', 'modelo_autos.asistencias_manejo', 'vehiculos.pendientes_preparacion', 'vehiculos.comentarios']
    });

  } catch (error) {
    console.error('❌ Error sincronizando schema:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error sincronizando schema',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/populate-data
 * Poblar datos de prueba usando Prisma directamente
 */
router.post('/populate-data', async (req, res) => {
  try {
    console.log('🌱 Iniciando población de datos...');
    
    const bcrypt = require('bcrypt');
    
    // Verificar si ya existen datos
    const existingVendedores = await prisma.vendedor.count();
    
    if (existingVendedores > 0) {
      return res.json({
        success: true,
        message: 'Los datos de prueba ya existen',
        existing_vendedores: existingVendedores
      });
    }

    // Obtener empresas existentes
    const empresas = await prisma.empresa.findMany({
      select: { id: true, nombre: true }
    });
    
    if (empresas.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay empresas disponibles. Ejecutar sync-schema primero.'
      });
    }

    const empresaFratelli = empresas.find(e => e.nombre.includes('Fratelli'));
    const empresaId = empresaFratelli ? empresaFratelli.id : empresas[0].id;

    // Crear vendedores de prueba
    const vendedores = [
      {
        nombre: 'Juan Carlos',
        apellido: 'Pérez',
        telefono: '+54 9 11 5555-1111',
        email: 'juan.perez@email.com',
        dni: '12345678',
        ciudad: 'Buenos Aires',
        provincia: 'Buenos Aires',
        empresa_id: empresaId
      },
      {
        nombre: 'Ana María',
        apellido: 'López',
        telefono: '+54 9 11 5555-2222',
        email: 'ana.lopez@email.com',
        dni: '87654321',
        ciudad: 'La Plata',
        provincia: 'Buenos Aires',
        empresa_id: empresaId
      }
    ];

    const vendedoresCreados = [];
    for (const vendedor of vendedores) {
      const vendedorCreado = await prisma.vendedor.create({
        data: vendedor
      });
      vendedoresCreados.push(vendedorCreado);
    }

    // Crear compradores de prueba
    const compradores = [
      {
        nombre: 'María Elena',
        apellido: 'García',
        telefono: '+54 9 11 6666-1111',
        email: 'maria.garcia@email.com',
        dni: '98765432',
        ciudad: 'Buenos Aires',
        provincia: 'Buenos Aires',
        empresa_id: empresaId
      },
      {
        nombre: 'Luis Fernando',
        apellido: 'Rodríguez',
        telefono: '+54 9 11 6666-2222',
        email: 'luis.rodriguez@email.com',
        dni: '23456789',
        ciudad: 'San Isidro',
        provincia: 'Buenos Aires',
        empresa_id: empresaId
      }
    ];

    const compradoresCreados = [];
    for (const comprador of compradores) {
      const compradorCreado = await prisma.comprador.create({
        data: comprador
      });
      compradoresCreados.push(compradorCreado);
    }

    return res.json({
      success: true,
      message: 'Datos de prueba creados exitosamente',
      data: {
        vendedores_created: vendedoresCreados.length,
        compradores_created: compradoresCreados.length,
        empresa_used: empresaId
      }
    });

  } catch (error) {
    console.error('❌ Error poblando datos:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error poblando datos',
      message: error.message
    });
  }
});

module.exports = router;