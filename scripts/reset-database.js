/**
 * Script para resetear completamente la base de datos
 * Elimina todas las tablas y datos
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('🧨 Reseteando base de datos...');
  
  try {
    // Obtener todas las tablas del esquema público
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name != '_prisma_migrations'
      ORDER BY table_name
    `;
    
    console.log(`📋 Encontradas ${tables.length} tablas para eliminar`);
    
    if (tables.length > 0) {
      // Desactivar foreign key checks temporalmente
      await prisma.$executeRawUnsafe('SET session_replication_role = replica;');
      
      // Eliminar todas las tablas
      for (const table of tables) {
        const tableName = table.table_name;
        console.log(`🗑️  Eliminando tabla: ${tableName}`);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
      }
      
      // Reactivar foreign key checks
      await prisma.$executeRawUnsafe('SET session_replication_role = DEFAULT;');
    }
    
    // También eliminar la tabla de migraciones de prisma
    console.log('🗑️  Eliminando tabla _prisma_migrations');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "_prisma_migrations" CASCADE');
    
    console.log('✅ Base de datos reseteada exitosamente');
    
  } catch (error) {
    console.error('❌ Error reseteando base de datos:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('🎉 Reset completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Reset falló:', error);
      process.exit(1);
    });
}

module.exports = { resetDatabase };