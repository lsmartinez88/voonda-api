/*
  Warnings:

  - You are about to drop the column `empresa_id` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_publicacion` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `publicacion_api_call` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `publicacion_web` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `titulo_legible` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `url_ficha` on the `publicaciones` table. All the data in the column will be lost.
  - Added the required column `titulo` to the `publicaciones` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."publicaciones" DROP CONSTRAINT "publicaciones_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."publicaciones" DROP CONSTRAINT "publicaciones_vehiculo_id_fkey";

-- DropIndex
DROP INDEX "public"."idx_publicaciones_empresa_id";

-- AlterTable
ALTER TABLE "publicaciones" DROP COLUMN "empresa_id",
DROP COLUMN "fecha_publicacion",
DROP COLUMN "publicacion_api_call",
DROP COLUMN "publicacion_web",
DROP COLUMN "titulo_legible",
DROP COLUMN "url_ficha",
ADD COLUMN     "id_publicacion_externa" TEXT,
ADD COLUMN     "titulo" TEXT NOT NULL,
ADD COLUMN     "url_publicacion" TEXT;

-- CreateIndex
CREATE INDEX "idx_publicaciones_plataforma_activo" ON "publicaciones"("plataforma", "activo");

-- AddForeignKey
ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
