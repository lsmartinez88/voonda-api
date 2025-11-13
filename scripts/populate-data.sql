-- Script SQL para poblar masivamente la base de datos Voonda
-- Ejecutar directamente en Supabase SQL Editor
-- Genera datos realistas: modelos, vendedores, compradores, vehículos y operaciones

-- Verificar que existe la empresa
DO $$
DECLARE
    empresa_id UUID;
BEGIN
    -- Obtener ID de empresa existente
    SELECT id INTO empresa_id FROM empresas LIMIT 1;
    
    IF empresa_id IS NULL THEN
        RAISE EXCEPTION 'No existe empresa. Ejecuta primero el seed básico.';
    END IF;
    
    RAISE NOTICE 'Usando empresa ID: %', empresa_id;
END $$;

-- 1. INSERTAR MODELOS DE AUTOS VARIADOS
INSERT INTO modelo_autos (id, marca, modelo, version, modelo_ano, segmento_modelo, motorizacion, combustible, caja, traccion, cilindrada, potencia_hp, torque_nm, rendimiento_mixto, equipamiento, asistencias_manejo, created_at, updated_at)
VALUES
-- Toyota
(gen_random_uuid(), 'Toyota', 'Corolla', 'XEI', 2023, 'Sedán', '2.0', 'Nafta', 'CVT', 'Delantera', 2000, 170, 200, 14.5, ARRAY['ABS', 'Airbags', 'Aire Acondicionado', 'Cierre Centralizado'], ARRAY['Control de Crucero'], NOW(), NOW()),
(gen_random_uuid(), 'Toyota', 'RAV4', 'Limited', 2022, 'SUV', '2.5', 'Híbrido', 'CVT', '4x4', 2500, 200, 250, 16.2, ARRAY['ABS', 'ESP', 'Airbags', 'Climatizador', 'GPS'], ARRAY['Control de Crucero', 'Sensores Estacionamiento'], NOW(), NOW()),
(gen_random_uuid(), 'Toyota', 'Hilux', 'SR', 2024, 'Pickup', '2.8', 'Diésel', 'Manual', '4x4', 2800, 180, 450, 11.8, ARRAY['ABS', 'Airbags', 'Aire Acondicionado'], ARRAY['Asistente Arranque Pendiente'], NOW(), NOW()),

-- Ford
(gen_random_uuid(), 'Ford', 'Focus', 'Titanium', 2022, 'Hatchback', '2.0', 'Nafta', 'Manual', 'Delantera', 2000, 160, 200, 13.8, ARRAY['ABS', 'ESP', 'Airbags', 'Climatizador'], ARRAY['Control de Crucero'], NOW(), NOW()),
(gen_random_uuid(), 'Ford', 'EcoSport', 'SE', 2023, 'SUV', '1.5', 'Nafta', 'Automática', 'Delantera', 1500, 120, 150, 15.2, ARRAY['ABS', 'Airbags', 'Aire Acondicionado'], ARRAY[], NOW(), NOW()),
(gen_random_uuid(), 'Ford', 'Ranger', 'XLT', 2024, 'Pickup', '3.2', 'Diésel', 'Automática', '4x4', 3200, 200, 470, 10.5, ARRAY['ABS', 'ESP', 'Airbags', 'Climatizador'], ARRAY['Control de Crucero', 'Sensores Estacionamiento'], NOW(), NOW()),

-- Chevrolet
(gen_random_uuid(), 'Chevrolet', 'Onix', 'LTZ', 2023, 'Hatchback', '1.0', 'Nafta', 'Manual', 'Delantera', 1000, 82, 107, 16.5, ARRAY['ABS', 'Airbags', 'Aire Acondicionado'], ARRAY[], NOW(), NOW()),
(gen_random_uuid(), 'Chevrolet', 'Cruze', 'Premier', 2022, 'Sedán', '1.4', 'Nafta', 'Automática', 'Delantera', 1400, 153, 245, 14.2, ARRAY['ABS', 'ESP', 'Airbags', 'Climatizador', 'Computadora Bordo'], ARRAY['Control de Crucero'], NOW(), NOW()),
(gen_random_uuid(), 'Chevrolet', 'Tracker', 'LTZ', 2024, 'SUV', '1.0', 'Nafta', 'CVT', 'Delantera', 1000, 116, 166, 15.8, ARRAY['ABS', 'ESP', 'Airbags', 'Climatizador'], ARRAY['Control de Crucero', 'Sensores Estacionamiento'], NOW(), NOW()),

-- Volkswagen
(gen_random_uuid(), 'Volkswagen', 'Polo', 'Highline', 2023, 'Hatchback', '1.0', 'Nafta', 'Manual', 'Delantera', 1000, 84, 107, 16.8, ARRAY['ABS', 'ESP', 'Airbags', 'Aire Acondicionado'], ARRAY[], NOW(), NOW()),
(gen_random_uuid(), 'Volkswagen', 'Vento', 'Highline', 2022, 'Sedán', '1.6', 'Nafta', 'Automática', 'Delantera', 1600, 110, 155, 14.8, ARRAY['ABS', 'ESP', 'Airbags', 'Climatizador'], ARRAY['Control de Crucero'], NOW(), NOW()),
(gen_random_uuid(), 'Volkswagen', 'Amarok', 'Comfortline', 2024, 'Pickup', '2.0', 'Diésel', 'Manual', '4x4', 2000, 140, 340, 12.2, ARRAY['ABS', 'ESP', 'Airbags', 'Aire Acondicionado'], ARRAY['Asistente Arranque Pendiente'], NOW(), NOW()),

-- Fiat
(gen_random_uuid(), 'Fiat', 'Argo', 'HGT', 2023, 'Hatchback', '1.8', 'Nafta', 'Manual', 'Delantera', 1800, 130, 180, 13.5, ARRAY['ABS', 'Airbags', 'Aire Acondicionado'], ARRAY[], NOW(), NOW()),
(gen_random_uuid(), 'Fiat', 'Cronos', 'Precision', 2022, 'Sedán', '1.8', 'Nafta', 'Automática', 'Delantera', 1800, 130, 180, 13.8, ARRAY['ABS', 'ESP', 'Airbags', 'Climatizador'], ARRAY['Control de Crucero'], NOW(), NOW()),
(gen_random_uuid(), 'Fiat', 'Toro', 'Ranch', 2024, 'Pickup', '1.8', 'Nafta', 'Automática', 'Delantera', 1800, 139, 189, 13.2, ARRAY['ABS', 'ESP', 'Airbags', 'Climatizador'], ARRAY['Sensores Estacionamiento'], NOW(), NOW()),

-- Renault
(gen_random_uuid(), 'Renault', 'Logan', 'Zen', 2023, 'Sedán', '1.6', 'Nafta', 'Manual', 'Delantera', 1600, 114, 156, 14.5, ARRAY['ABS', 'Airbags', 'Aire Acondicionado'], ARRAY[], NOW(), NOW()),
(gen_random_uuid(), 'Renault', 'Duster', 'Intense', 2024, 'SUV', '1.6', 'Nafta', 'CVT', 'Delantera', 1600, 114, 156, 13.8, ARRAY['ABS', 'ESP', 'Airbags', 'Climatizador'], ARRAY['Control de Crucero'], NOW(), NOW());

-- 2. INSERTAR VENDEDORES
INSERT INTO vendedores (id, empresa_id, nombre, apellido, telefono, email, dni, direccion, observaciones, activo, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM empresas LIMIT 1),
    nombres.nombre,
    apellidos.apellido,
    '+54 9 11 ' || (1000 + (RANDOM() * 8999)::INT) || '-' || (1000 + (RANDOM() * 8999)::INT),
    LOWER(nombres.nombre) || '.' || LOWER(apellidos.apellido) || '@' || dominios.dominio,
    (10000000 + (RANDOM() * 89999999)::BIGINT)::TEXT,
    prefijos.prefijo || ' ' || calles.calle || ' ' || (100 + (RANDOM() * 9899)::INT),
    CASE WHEN RANDOM() < 0.3 THEN 'Vendedor desde ' || (2015 + (RANDOM() * 8)::INT) ELSE NULL END,
    true,
    NOW(),
    NOW()
FROM 
    (VALUES ('Juan'), ('Carlos'), ('Miguel'), ('José'), ('Luis'), ('Jorge'), ('Pedro'), ('Antonio')) AS nombres(nombre)
CROSS JOIN 
    (VALUES ('García'), ('Rodríguez'), ('López'), ('Martínez'), ('González'), ('Pérez'), ('Sánchez'), ('Fernández')) AS apellidos(apellido)
CROSS JOIN
    (VALUES ('gmail.com'), ('hotmail.com'), ('yahoo.com.ar'), ('outlook.com')) AS dominios(dominio)
CROSS JOIN
    (VALUES ('Av.'), ('Calle'), ('Pasaje')) AS prefijos(prefijo)
CROSS JOIN
    (VALUES ('San Martín'), ('Rivadavia'), ('Belgrano'), ('Mitre')) AS calles(calle)
LIMIT 8;

-- 3. INSERTAR COMPRADORES
INSERT INTO compradores (id, empresa_id, nombre, apellido, telefono, email, dni, direccion, observaciones, activo, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM empresas LIMIT 1),
    nombres.nombre,
    apellidos.apellido,
    '+54 9 11 ' || (1000 + (RANDOM() * 8999)::INT) || '-' || (1000 + (RANDOM() * 8999)::INT),
    LOWER(nombres.nombre) || '.' || LOWER(apellidos.apellido) || '@' || dominios.dominio,
    (10000000 + (RANDOM() * 89999999)::BIGINT)::TEXT,
    prefijos.prefijo || ' ' || calles.calle || ' ' || (100 + (RANDOM() * 9899)::INT),
    CASE WHEN RANDOM() < 0.25 THEN 'Cliente referido por ' || ref_nombres.nombre ELSE NULL END,
    true,
    NOW(),
    NOW()
FROM 
    (VALUES ('María'), ('Ana'), ('Carmen'), ('Rosa'), ('Patricia'), ('Laura'), ('Marta'), ('Elena'), ('Sofía'), ('Isabel'), ('Fernando'), ('Roberto')) AS nombres(nombre)
CROSS JOIN 
    (VALUES ('Martín'), ('Díaz'), ('Moreno'), ('Álvarez'), ('Muñoz'), ('Romero'), ('Alonso'), ('Gutiérrez'), ('Silva'), ('Castro'), ('Vargas'), ('Herrera')) AS apellidos(apellido)
CROSS JOIN
    (VALUES ('gmail.com'), ('hotmail.com'), ('yahoo.com.ar'), ('outlook.com')) AS dominios(dominio)
CROSS JOIN
    (VALUES ('Av.'), ('Calle'), ('Pasaje')) AS prefijos(prefijo)
CROSS JOIN
    (VALUES ('Independencia'), ('Corrientes'), ('Santa Fe'), ('9 de Julio')) AS calles(calle)
CROSS JOIN
    (VALUES ('Juan'), ('Carlos'), ('Ana'), ('María')) AS ref_nombres(nombre)
LIMIT 12;

-- 4. INSERTAR VEHÍCULOS
INSERT INTO vehiculos (id, empresa_id, modelo_id, patente, vehiculo_ano, kilometros, valor, moneda, estado, observaciones, vendedor_id, comprador_id, activo, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM empresas LIMIT 1),
    ma.id,
    CHR(65 + (RANDOM() * 25)::INT) || CHR(65 + (RANDOM() * 25)::INT) || CHR(65 + (RANDOM() * 25)::INT) || 
    (RANDOM() * 9)::INT || (RANDOM() * 9)::INT || (RANDOM() * 9)::INT,
    ma.modelo_ano - (RANDOM() * 2)::INT,
    (RANDOM() * 150000)::INT,
    (800000 + (RANDOM() * 7200000)::BIGINT),
    'ARS',
    estados.estado,
    CASE WHEN RANDOM() < 0.3 THEN observaciones.obs ELSE NULL END,
    CASE WHEN RANDOM() < 0.7 THEN v.id ELSE NULL END,
    CASE WHEN RANDOM() < 0.4 THEN c.id ELSE NULL END,
    true,
    NOW(),
    NOW()
FROM 
    modelo_autos ma
CROSS JOIN
    (VALUES ('disponible'), ('reservado'), ('vendido'), ('en_reparacion'), ('consignacion')) AS estados(estado)
CROSS JOIN
    (VALUES ('Vehículo en excelente estado'), ('Único dueño, service completo'), ('Vehículo con algunos detalles de chapa'), ('Motor reparado recientemente'), ('Documentación al día')) AS observaciones(obs)
CROSS JOIN LATERAL
    (SELECT id FROM vendedores ORDER BY RANDOM() LIMIT 1) v
CROSS JOIN LATERAL
    (SELECT id FROM compradores ORDER BY RANDOM() LIMIT 1) c
ORDER BY RANDOM()
LIMIT 25;

-- 5. INSERTAR OPERACIONES
INSERT INTO operaciones (id, empresa_id, vehiculo_id, tipo, fecha, monto, moneda, estado, vendedor_id, comprador_id, datos_especificos, observaciones, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM empresas LIMIT 1),
    v.id,
    tipos.tipo,
    NOW() - (RANDOM() * 365 || ' days')::INTERVAL,
    CASE 
        WHEN tipos.tipo = 'compra' THEN (500000 + (RANDOM() * (v.valor * 0.3))::BIGINT)
        WHEN tipos.tipo = 'venta' THEN (v.valor * 0.8 + (RANDOM() * (v.valor * 0.4))::BIGINT)
        WHEN tipos.tipo = 'seña' THEN (50000 + (RANDOM() * 450000)::BIGINT)
        ELSE NULL
    END,
    'ARS',
    estados.estado,
    CASE WHEN tipos.tipo IN ('compra') THEN vendedores.id ELSE NULL END,
    CASE WHEN tipos.tipo IN ('venta', 'seña') THEN compradores.id ELSE NULL END,
    CASE 
        WHEN tipos.tipo = 'seña' THEN 
            '{"porcentaje_seña": ' || (10 + (RANDOM() * 40)::INT) || ', "fecha_vencimiento": "' || 
            (NOW() + (30 || ' days')::INTERVAL)::DATE || '"}'::JSONB
        ELSE NULL
    END,
    CASE WHEN RANDOM() < 0.4 THEN observaciones_ops.obs ELSE NULL END,
    NOW(),
    NOW()
FROM 
    vehiculos v
CROSS JOIN
    (VALUES ('compra'), ('venta'), ('seña'), ('transferencia')) AS tipos(tipo)
CROSS JOIN
    (VALUES ('pendiente'), ('completada'), ('cancelada'), ('en_proceso')) AS estados(estado)
CROSS JOIN LATERAL
    (SELECT id FROM vendedores ORDER BY RANDOM() LIMIT 1) vendedores
CROSS JOIN LATERAL
    (SELECT id FROM compradores ORDER BY RANDOM() LIMIT 1) compradores
CROSS JOIN
    (VALUES ('Operación realizada sin inconvenientes'), ('Cliente muy conforme con el servicio'), ('Pendiente documentación'), ('Operación cerrada exitosamente'), ('Requiere seguimiento')) AS observaciones_ops(obs)
WHERE RANDOM() < 0.6  -- No todos los vehículos tienen operaciones
ORDER BY RANDOM()
LIMIT 40;

-- 6. MOSTRAR ESTADÍSTICAS
DO $$
DECLARE
    total_modelos INT;
    total_vendedores INT;
    total_compradores INT;
    total_vehiculos INT;
    total_operaciones INT;
BEGIN
    SELECT COUNT(*) INTO total_modelos FROM modelo_autos;
    SELECT COUNT(*) INTO total_vendedores FROM vendedores;
    SELECT COUNT(*) INTO total_compradores FROM compradores;
    SELECT COUNT(*) INTO total_vehiculos FROM vehiculos;
    SELECT COUNT(*) INTO total_operaciones FROM operaciones;
    
    RAISE NOTICE '🎉 POBLADO COMPLETADO EXITOSAMENTE!';
    RAISE NOTICE '📊 Datos creados:';
    RAISE NOTICE '   - Modelos de autos: %', total_modelos;
    RAISE NOTICE '   - Vendedores: %', total_vendedores;
    RAISE NOTICE '   - Compradores: %', total_compradores;
    RAISE NOTICE '   - Vehículos: %', total_vehiculos;
    RAISE NOTICE '   - Operaciones: %', total_operaciones;
END $$;