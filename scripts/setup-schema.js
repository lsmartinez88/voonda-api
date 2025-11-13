/**
 * Script para crear el esquema completo usando Prisma DB Push
 * Esto es más rápido para desarrollo y evita problemas de migración
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const fullSchema = `generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
}

model Empresa {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  nombre      String   @db.VarChar(200)
  descripcion String?  @db.Text
  logo_url    String?  @db.Text
  activa      Boolean  @default(true)
  created_at  DateTime @default(now()) @db.Timestamptz(6)
  updated_at  DateTime @default(now()) @updatedAt @db.Timestamptz(6)

  usuarios    Usuario[]
  vehiculos   Vehiculo[]
  vendedores  Vendedor[]
  compradores Comprador[]
  operaciones Operacion[]

  @@index([activa])
  @@map("empresas")
}

model Rol {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  nombre      String   @unique @db.VarChar(50)
  descripcion String?  @db.Text
  permisos    Json?    @db.JsonB
  activo      Boolean  @default(true)
  created_at  DateTime @default(now()) @db.Timestamptz(6)

  usuarios Usuario[]

  @@index([activo])
  @@map("roles")
}

model Usuario {
  id       String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email    String  @unique @db.VarChar(255)
  password String  @db.VarChar(255)
  nombre   String  @db.VarChar(200)
  apellido String? @db.VarChar(200)
  telefono String? @db.VarChar(20)
  activo   Boolean @default(true)

  empresa_id String?  @db.Uuid
  empresa    Empresa? @relation(fields: [empresa_id], references: [id])
  
  rol_id String @db.Uuid
  rol    Rol    @relation(fields: [rol_id], references: [id])

  ultimo_login      DateTime? @db.Timestamptz(6)
  intentos_fallidos Int       @default(0)
  bloqueado_hasta   DateTime? @db.Timestamptz(6)
  created_at        DateTime  @default(now()) @db.Timestamptz(6)
  updated_at        DateTime  @default(now()) @updatedAt @db.Timestamptz(6)

  @@index([empresa_id])
  @@index([rol_id])
  @@index([activo])
  @@index([email])
  @@map("usuarios")
}

model ModeloAuto {
  id              String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  marca           String  @db.Text
  modelo          String  @db.Text
  version         String? @db.Text
  modelo_ano      Int
  segmento_modelo String? @db.Text

  motorizacion      String?  @db.Text
  combustible       String?  @db.Text
  caja              String?  @db.Text
  traccion          String?  @db.Text
  cilindrada        Int?
  potencia_hp       Int?
  torque_nm         Int?
  rendimiento_mixto Decimal? @db.Decimal(5, 2)

  equipamiento       String[] @default([])
  asistencias_manejo String[] @default([])

  created_at DateTime @default(now()) @db.Timestamptz(6)
  updated_at DateTime @default(now()) @updatedAt @db.Timestamptz(6)

  vehiculos Vehiculo[]

  @@unique([marca, modelo, version, modelo_ano])
  @@index([marca, modelo])
  @@map("modelo_autos")
}

model Vehiculo {
  id           String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresa_id   String  @db.Uuid
  modelo_id    String  @db.Uuid
  patente      String? @db.Text
  vehiculo_ano Int
  kilometros   Int     @default(0)
  valor        Decimal? @db.Decimal(12, 2)
  moneda       String   @default("ARS") @db.Text
  estado       String   @default("disponible") @db.Text
  observaciones String? @db.Text
  activo       Boolean  @default(true)

  vendedor_id  String? @db.Uuid
  comprador_id String? @db.Uuid

  created_at DateTime @default(now()) @db.Timestamptz(6)
  updated_at DateTime @default(now()) @updatedAt @db.Timestamptz(6)

  empresa    Empresa     @relation(fields: [empresa_id], references: [id])
  modelo     ModeloAuto  @relation(fields: [modelo_id], references: [id])
  vendedor   Vendedor?   @relation(fields: [vendedor_id], references: [id])
  comprador  Comprador?  @relation(fields: [comprador_id], references: [id])
  operaciones Operacion[]

  @@index([empresa_id])
  @@index([modelo_id])
  @@index([estado])
  @@index([vendedor_id])
  @@index([comprador_id])
  @@map("vehiculos")
}

model Vendedor {
  id            String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresa_id    String  @db.Uuid
  nombre        String  @db.Text
  apellido      String? @db.Text
  telefono      String? @db.Text
  email         String? @db.Text
  dni           String? @db.Text
  direccion     String? @db.Text
  observaciones String? @db.Text
  activo        Boolean @default(true)
  created_at    DateTime @default(now()) @db.Timestamptz(6)
  updated_at    DateTime @default(now()) @updatedAt @db.Timestamptz(6)

  empresa     Empresa     @relation(fields: [empresa_id], references: [id])
  vehiculos   Vehiculo[]
  operaciones Operacion[]

  @@index([empresa_id])
  @@index([telefono])
  @@index([email])
  @@map("vendedores")
}

model Comprador {
  id            String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresa_id    String  @db.Uuid
  nombre        String  @db.Text
  apellido      String? @db.Text
  telefono      String? @db.Text
  email         String? @db.Text
  dni           String? @db.Text
  direccion     String? @db.Text
  observaciones String? @db.Text
  activo        Boolean @default(true)
  created_at    DateTime @default(now()) @db.Timestamptz(6)
  updated_at    DateTime @default(now()) @updatedAt @db.Timestamptz(6)

  empresa     Empresa     @relation(fields: [empresa_id], references: [id])
  vehiculos   Vehiculo[]
  operaciones Operacion[]

  @@index([empresa_id])
  @@index([telefono])
  @@index([email])
  @@map("compradores")
}

model Operacion {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  empresa_id  String   @db.Uuid
  vehiculo_id String   @db.Uuid
  tipo        String   @db.Text
  fecha       DateTime @db.Date
  monto       Decimal? @db.Decimal(12, 2)
  moneda      String   @default("ARS") @db.Text
  estado      String   @default("pendiente") @db.Text

  vendedor_id  String? @db.Uuid
  comprador_id String? @db.Uuid

  datos_especificos Json? @db.JsonB
  observaciones     String? @db.Text

  created_at DateTime @default(now()) @db.Timestamptz(6)
  updated_at DateTime @default(now()) @updatedAt @db.Timestamptz(6)

  empresa   Empresa    @relation(fields: [empresa_id], references: [id])
  vehiculo  Vehiculo   @relation(fields: [vehiculo_id], references: [id])
  vendedor  Vendedor?  @relation(fields: [vendedor_id], references: [id])
  comprador Comprador? @relation(fields: [comprador_id], references: [id])

  @@index([empresa_id])
  @@index([vehiculo_id])
  @@index([tipo])
  @@index([fecha])
  @@index([estado])
  @@index([vendedor_id])
  @@index([comprador_id])
  @@map("operaciones")
}`;

console.log('📝 Escribiendo schema completo...');
fs.writeFileSync(path.join(__dirname, '../prisma/schema.prisma'), fullSchema);
console.log('✅ Schema escrito correctamente');

console.log('🎯 Ahora ejecuta: npx prisma db push');
console.log('🎯 Después ejecuta: npm run db:setup-data para poblar datos');