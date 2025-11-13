/*
  Warnings:

  - You are about to drop the column `abs` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `airbags` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `alto` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `ancho` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `asistencia_manejo` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `capacidad_baul` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `capacidad_combustible` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `climatizador` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `control_estabilidad` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `ficha_breve` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `frenos` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `largo` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `llantas` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `modelo_rag` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `multimedia` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `neumaticos` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `url_ficha` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `velocidad_max` on the `modelo_autos` table. All the data in the column will be lost.
  - You are about to drop the column `cliente_id` on the `operaciones` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_operacion` on the `operaciones` table. All the data in the column will be lost.
  - You are about to drop the column `estado_id` on the `vehiculos` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_ingreso` on the `vehiculos` table. All the data in the column will be lost.
  - You are about to drop the column `publicacion_api_call` on the `vehiculos` table. All the data in the column will be lost.
  - You are about to drop the column `publicacion_web` on the `vehiculos` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_operacion` on the `vehiculos` table. All the data in the column will be lost.
  - You are about to drop the `clientes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estados_vehiculos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `publicaciones` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fecha` to the `operaciones` table without a default value. This is not possible if the table is not empty.
  - Made the column `moneda` on table `operaciones` required. This step will fail if there are existing NULL values in that column.
  - Made the column `moneda` on table `vehiculos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."clientes" DROP CONSTRAINT "clientes_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."operaciones" DROP CONSTRAINT "operaciones_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."publicaciones" DROP CONSTRAINT "publicaciones_vehiculo_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."vehiculos" DROP CONSTRAINT "vehiculos_estado_id_fkey";

-- DropIndex
DROP INDEX "public"."idx_operaciones_cliente_id";

-- DropIndex
DROP INDEX "public"."idx_operaciones_fecha_operacion";

-- DropIndex
DROP INDEX "public"."idx_vehiculos_estado_id";

-- DropIndex
DROP INDEX "public"."idx_vehiculos_fecha_ingreso";

-- DropIndex
DROP INDEX "public"."idx_vehiculos_patente";

-- DropIndex
DROP INDEX "public"."idx_vehiculos_valor";

-- AlterTable
ALTER TABLE "modelo_autos" DROP COLUMN "abs",
DROP COLUMN "airbags",
DROP COLUMN "alto",
DROP COLUMN "ancho",
DROP COLUMN "asistencia_manejo",
DROP COLUMN "capacidad_baul",
DROP COLUMN "capacidad_combustible",
DROP COLUMN "climatizador",
DROP COLUMN "control_estabilidad",
DROP COLUMN "ficha_breve",
DROP COLUMN "frenos",
DROP COLUMN "largo",
DROP COLUMN "llantas",
DROP COLUMN "modelo_rag",
DROP COLUMN "multimedia",
DROP COLUMN "neumaticos",
DROP COLUMN "url_ficha",
DROP COLUMN "velocidad_max",
ADD COLUMN     "asistencias_manejo" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "equipamiento" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "operaciones" DROP COLUMN "cliente_id",
DROP COLUMN "fecha_operacion",
ADD COLUMN     "comprador_id" UUID,
ADD COLUMN     "datos_especificos" JSONB,
ADD COLUMN     "fecha" DATE NOT NULL,
ADD COLUMN     "vendedor_id" UUID,
ALTER COLUMN "moneda" SET NOT NULL,
ALTER COLUMN "estado" SET DEFAULT 'pendiente';

-- AlterTable
ALTER TABLE "vehiculos" DROP COLUMN "estado_id",
DROP COLUMN "fecha_ingreso",
DROP COLUMN "publicacion_api_call",
DROP COLUMN "publicacion_web",
DROP COLUMN "tipo_operacion",
ADD COLUMN     "comprador_id" UUID,
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'disponible',
ADD COLUMN     "vendedor_id" UUID,
ALTER COLUMN "moneda" SET NOT NULL;

-- DropTable
DROP TABLE "public"."clientes";

-- DropTable
DROP TABLE "public"."estados_vehiculos";

-- DropTable
DROP TABLE "public"."publicaciones";

-- CreateTable
CREATE TABLE "vendedores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresa_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "dni" TEXT,
    "direccion" TEXT,
    "observaciones" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compradores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresa_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "dni" TEXT,
    "direccion" TEXT,
    "observaciones" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compradores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vendedores_empresa_id_idx" ON "vendedores"("empresa_id");

-- CreateIndex
CREATE INDEX "vendedores_telefono_idx" ON "vendedores"("telefono");

-- CreateIndex
CREATE INDEX "vendedores_email_idx" ON "vendedores"("email");

-- CreateIndex
CREATE INDEX "compradores_empresa_id_idx" ON "compradores"("empresa_id");

-- CreateIndex
CREATE INDEX "compradores_telefono_idx" ON "compradores"("telefono");

-- CreateIndex
CREATE INDEX "compradores_email_idx" ON "compradores"("email");

-- CreateIndex
CREATE INDEX "operaciones_fecha_idx" ON "operaciones"("fecha");

-- CreateIndex
CREATE INDEX "operaciones_vendedor_id_idx" ON "operaciones"("vendedor_id");

-- CreateIndex
CREATE INDEX "operaciones_comprador_id_idx" ON "operaciones"("comprador_id");

-- CreateIndex
CREATE INDEX "vehiculos_estado_idx" ON "vehiculos"("estado");

-- CreateIndex
CREATE INDEX "vehiculos_vendedor_id_idx" ON "vehiculos"("vendedor_id");

-- CreateIndex
CREATE INDEX "vehiculos_comprador_id_idx" ON "vehiculos"("comprador_id");

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "vendedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_comprador_id_fkey" FOREIGN KEY ("comprador_id") REFERENCES "compradores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendedores" ADD CONSTRAINT "vendedores_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compradores" ADD CONSTRAINT "compradores_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operaciones" ADD CONSTRAINT "operaciones_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "vendedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operaciones" ADD CONSTRAINT "operaciones_comprador_id_fkey" FOREIGN KEY ("comprador_id") REFERENCES "compradores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_empresas_activa" RENAME TO "empresas_activa_idx";

-- RenameIndex
ALTER INDEX "idx_modelo_autos_marca_modelo" RENAME TO "modelo_autos_marca_modelo_idx";

-- RenameIndex
ALTER INDEX "idx_operaciones_empresa_id" RENAME TO "operaciones_empresa_id_idx";

-- RenameIndex
ALTER INDEX "idx_operaciones_estado" RENAME TO "operaciones_estado_idx";

-- RenameIndex
ALTER INDEX "idx_operaciones_tipo" RENAME TO "operaciones_tipo_idx";

-- RenameIndex
ALTER INDEX "idx_operaciones_vehiculo_id" RENAME TO "operaciones_vehiculo_id_idx";

-- RenameIndex
ALTER INDEX "idx_roles_activo" RENAME TO "roles_activo_idx";

-- RenameIndex
ALTER INDEX "idx_usuarios_activo" RENAME TO "usuarios_activo_idx";

-- RenameIndex
ALTER INDEX "idx_usuarios_email" RENAME TO "usuarios_email_idx";

-- RenameIndex
ALTER INDEX "idx_usuarios_empresa_id" RENAME TO "usuarios_empresa_id_idx";

-- RenameIndex
ALTER INDEX "idx_usuarios_rol_id" RENAME TO "usuarios_rol_id_idx";

-- RenameIndex
ALTER INDEX "idx_vehiculos_empresa_id" RENAME TO "vehiculos_empresa_id_idx";

-- RenameIndex
ALTER INDEX "idx_vehiculos_modelo_id" RENAME TO "vehiculos_modelo_id_idx";
