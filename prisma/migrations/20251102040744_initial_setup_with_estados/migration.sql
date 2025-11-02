-- CreateTable
CREATE TABLE "empresas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "logo_url" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "permisos" JSONB,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "apellido" VARCHAR(200),
    "telefono" VARCHAR(20),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "empresa_id" UUID,
    "rol_id" UUID NOT NULL,
    "ultimo_login" TIMESTAMPTZ(6),
    "intentos_fallidos" INTEGER NOT NULL DEFAULT 0,
    "bloqueado_hasta" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modelo_autos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "version" TEXT,
    "modelo_ano" INTEGER NOT NULL,
    "segmento_modelo" TEXT,
    "motorizacion" TEXT,
    "combustible" TEXT,
    "caja" TEXT,
    "traccion" TEXT,
    "cilindrada" INTEGER,
    "potencia_hp" INTEGER,
    "torque_nm" INTEGER,
    "rendimiento_mixto" DECIMAL(5,2),
    "velocidad_max" INTEGER,
    "largo" INTEGER,
    "ancho" INTEGER,
    "alto" INTEGER,
    "capacidad_baul" INTEGER,
    "capacidad_combustible" INTEGER,
    "airbags" INTEGER,
    "abs" BOOLEAN DEFAULT false,
    "control_estabilidad" BOOLEAN DEFAULT false,
    "climatizador" BOOLEAN DEFAULT false,
    "multimedia" TEXT,
    "asistencia_manejo" TEXT,
    "frenos" TEXT,
    "neumaticos" TEXT,
    "llantas" TEXT,
    "url_ficha" TEXT,
    "ficha_breve" TEXT,
    "modelo_rag" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "modelo_autos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_vehiculos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estados_vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresa_id" UUID NOT NULL,
    "modelo_id" UUID NOT NULL,
    "patente" TEXT,
    "vehiculo_ano" INTEGER NOT NULL,
    "kilometros" INTEGER NOT NULL DEFAULT 0,
    "valor" DECIMAL(12,2),
    "moneda" TEXT DEFAULT 'ARS',
    "estado_id" UUID,
    "tipo_operacion" TEXT,
    "publicacion_web" TEXT DEFAULT 'false',
    "publicacion_api_call" TEXT DEFAULT 'false',
    "fecha_ingreso" DATE,
    "observaciones" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publicaciones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresa_id" UUID NOT NULL,
    "vehiculo_id" UUID NOT NULL,
    "plataforma" TEXT NOT NULL,
    "publicacion_web" TEXT,
    "publicacion_api_call" TEXT,
    "url_ficha" TEXT,
    "titulo_legible" TEXT,
    "ficha_breve" TEXT,
    "fecha_publicacion" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresa_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "origen" TEXT,
    "comentarios" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operaciones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresa_id" UUID NOT NULL,
    "vehiculo_id" UUID NOT NULL,
    "cliente_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "monto" DECIMAL(12,2),
    "moneda" TEXT DEFAULT 'ARS',
    "fecha_operacion" DATE,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "observaciones" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_empresas_activa" ON "empresas"("activa");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE INDEX "idx_roles_activo" ON "roles"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_usuarios_empresa_id" ON "usuarios"("empresa_id");

-- CreateIndex
CREATE INDEX "idx_usuarios_rol_id" ON "usuarios"("rol_id");

-- CreateIndex
CREATE INDEX "idx_usuarios_activo" ON "usuarios"("activo");

-- CreateIndex
CREATE INDEX "idx_usuarios_email" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_modelo_autos_marca_modelo" ON "modelo_autos"("marca", "modelo");

-- CreateIndex
CREATE UNIQUE INDEX "modelo_autos_marca_modelo_version_modelo_ano_key" ON "modelo_autos"("marca", "modelo", "version", "modelo_ano");

-- CreateIndex
CREATE UNIQUE INDEX "estados_vehiculos_codigo_key" ON "estados_vehiculos"("codigo");

-- CreateIndex
CREATE INDEX "idx_estadovehiculo_codigo" ON "estados_vehiculos"("codigo");

-- CreateIndex
CREATE INDEX "idx_vehiculos_empresa_id" ON "vehiculos"("empresa_id");

-- CreateIndex
CREATE INDEX "idx_vehiculos_modelo_id" ON "vehiculos"("modelo_id");

-- CreateIndex
CREATE INDEX "idx_vehiculos_estado_id" ON "vehiculos"("estado_id");

-- CreateIndex
CREATE INDEX "idx_vehiculos_valor" ON "vehiculos"("valor");

-- CreateIndex
CREATE INDEX "idx_vehiculos_fecha_ingreso" ON "vehiculos"("fecha_ingreso");

-- CreateIndex
CREATE INDEX "idx_vehiculos_patente" ON "vehiculos"("patente");

-- CreateIndex
CREATE INDEX "idx_publicaciones_empresa_id" ON "publicaciones"("empresa_id");

-- CreateIndex
CREATE INDEX "idx_publicaciones_vehiculo_id" ON "publicaciones"("vehiculo_id");

-- CreateIndex
CREATE INDEX "idx_publicaciones_plataforma" ON "publicaciones"("plataforma");

-- CreateIndex
CREATE INDEX "idx_publicaciones_activo" ON "publicaciones"("activo");

-- CreateIndex
CREATE INDEX "idx_clientes_empresa_id" ON "clientes"("empresa_id");

-- CreateIndex
CREATE INDEX "idx_clientes_telefono" ON "clientes"("telefono");

-- CreateIndex
CREATE INDEX "idx_clientes_email" ON "clientes"("email");

-- CreateIndex
CREATE INDEX "idx_operaciones_empresa_id" ON "operaciones"("empresa_id");

-- CreateIndex
CREATE INDEX "idx_operaciones_vehiculo_id" ON "operaciones"("vehiculo_id");

-- CreateIndex
CREATE INDEX "idx_operaciones_cliente_id" ON "operaciones"("cliente_id");

-- CreateIndex
CREATE INDEX "idx_operaciones_tipo" ON "operaciones"("tipo");

-- CreateIndex
CREATE INDEX "idx_operaciones_fecha_operacion" ON "operaciones"("fecha_operacion");

-- CreateIndex
CREATE INDEX "idx_operaciones_estado" ON "operaciones"("estado");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_modelo_id_fkey" FOREIGN KEY ("modelo_id") REFERENCES "modelo_autos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estados_vehiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operaciones" ADD CONSTRAINT "operaciones_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operaciones" ADD CONSTRAINT "operaciones_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operaciones" ADD CONSTRAINT "operaciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
