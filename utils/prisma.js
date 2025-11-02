/**
 * Cliente de Prisma para Voonda API
 * Configuración centralizada del ORM
 */

const { PrismaClient } = require('@prisma/client');

// Configurar el cliente de Prisma con opciones optimizadas
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// Manejar la desconexión graceful
process.on('beforeExit', async () => {
  console.log('🔌 Desconectando Prisma...');
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  console.log('🔌 Desconectando Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔌 Desconectando Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = { prisma };