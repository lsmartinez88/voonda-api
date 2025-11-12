/**
 * Endpoint temporal para sincronizar schema en producción
 * USAR SOLO UNA VEZ PARA APLICAR CAMBIOS DE SCHEMA
 */

const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

/**
 * POST /api/admin/sync-schema
 * Sincronizar schema de base de datos en producción
 */
router.post('/sync-schema', async (req, res) => {
  try {
    // Verificar que sea ambiente de producción
    if (process.env.NODE_ENV !== 'production') {
      return res.status(403).json({
        success: false,
        message: 'Este endpoint solo funciona en producción'
      });
    }

    console.log('🔧 Iniciando sincronización de schema...');
    
    // Ejecutar db push en producción
    const { execSync } = require('child_process');
    
    try {
      const output = execSync('npx prisma db push --force-reset', { 
        encoding: 'utf-8',
        timeout: 30000 
      });
      
      console.log('✅ Schema sincronizado:', output);
      
      return res.json({
        success: true,
        message: 'Schema sincronizado exitosamente',
        output: output
      });
    } catch (error) {
      console.error('❌ Error sincronizando schema:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Error sincronizando schema',
        error: error.message
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error interno',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/populate-data
 * Poblar datos de prueba en producción
 */
router.post('/populate-data', async (req, res) => {
  try {
    console.log('🌱 Iniciando población de datos...');
    
    // Ejecutar script de población
    const { execSync } = require('child_process');
    
    try {
      const output = execSync('node scripts/populate-test-data.js', { 
        encoding: 'utf-8',
        timeout: 60000 
      });
      
      console.log('✅ Datos poblados:', output);
      
      return res.json({
        success: true,
        message: 'Datos de prueba creados exitosamente',
        output: output
      });
    } catch (error) {
      console.error('❌ Error poblando datos:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Error poblando datos',
        error: error.message
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error interno',
      message: error.message
    });
  }
});

module.exports = router;