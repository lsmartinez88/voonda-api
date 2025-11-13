-- Script para poblar las nuevas tablas con datos de prueba
-- Estados de vehículos

INSERT INTO estados_vehiculo (id, codigo, nombre, descripcion, activo) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'DISPONIBLE', 'Disponible', 'Vehículo disponible para la venta', true),
('550e8400-e29b-41d4-a716-446655440002', 'RESERVADO', 'Reservado', 'Vehículo reservado por un cliente', true),
('550e8400-e29b-41d4-a716-446655440003', 'VENDIDO', 'Vendido', 'Vehículo vendido', true),
('550e8400-e29b-41d4-a716-446655440004', 'EN_REPARACION', 'En Reparación', 'Vehículo en proceso de reparación', true),
('550e8400-e29b-41d4-a716-446655440005', 'EN_TRANSITO', 'En Tránsito', 'Vehículo en proceso de traslado', true),
('550e8400-e29b-41d4-a716-446655440006', 'MANTENIMIENTO', 'En Mantenimiento', 'Vehículo en mantenimiento preventivo', true),
('550e8400-e29b-41d4-a716-446655440007', 'BAJA', 'Dado de baja', 'Vehículo dado de baja del inventario', false)
ON CONFLICT (codigo) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    activo = EXCLUDED.activo,
    updated_at = NOW();

-- Imágenes generales del sistema
INSERT INTO imagenes (id, nombre, url, tipo, descripcion, tamaño, formato, activo) VALUES 
('650e8400-e29b-41d4-a716-446655440001', 'logo-fratelli.jpg', 'https://example.com/images/logo-fratelli.jpg', 'logo', 'Logo principal de Fratelli Motors', 45632, 'jpg', true),
('650e8400-e29b-41d4-a716-446655440002', 'banner-promocional.jpg', 'https://example.com/images/banner-promocional.jpg', 'banner', 'Banner promocional del mes', 128495, 'jpg', true),
('650e8400-e29b-41d4-a716-446655440003', 'catalogo-2024.pdf', 'https://example.com/docs/catalogo-2024.pdf', 'documento', 'Catálogo de vehículos 2024', 2048576, 'pdf', true),
('650e8400-e29b-41d4-a716-446655440004', 'perfil-default.png', 'https://example.com/images/perfil-default.png', 'perfil', 'Imagen de perfil por defecto', 12345, 'png', true),
('650e8400-e29b-41d4-a716-446655440005', 'vehiculo-placeholder.jpg', 'https://example.com/images/vehiculo-placeholder.jpg', 'vehiculo', 'Imagen placeholder para vehículos', 67890, 'jpg', true)
ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    url = EXCLUDED.url,
    tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    updated_at = NOW();

-- Verificar si existen vehículos para agregar imágenes y publicaciones
DO $$
DECLARE
    vehiculo_record RECORD;
    contador INT := 1;
BEGIN
    -- Insertar imágenes para cada vehículo existente
    FOR vehiculo_record IN SELECT id FROM vehiculos LIMIT 5 LOOP
        -- Imagen principal
        INSERT INTO imagenes_vehiculo (id, vehiculo_id, url, descripcion, orden, es_principal, activo) VALUES 
        (gen_random_uuid(), vehiculo_record.id, 'https://example.com/vehiculos/' || vehiculo_record.id || '/principal.jpg', 'Imagen principal del vehículo', 1, true, true);
        
        -- Imagen lateral
        INSERT INTO imagenes_vehiculo (id, vehiculo_id, url, descripcion, orden, es_principal, activo) VALUES 
        (gen_random_uuid(), vehiculo_record.id, 'https://example.com/vehiculos/' || vehiculo_record.id || '/lateral.jpg', 'Vista lateral del vehículo', 2, false, true);
        
        -- Imagen interior
        INSERT INTO imagenes_vehiculo (id, vehiculo_id, url, descripcion, orden, es_principal, activo) VALUES 
        (gen_random_uuid(), vehiculo_record.id, 'https://example.com/vehiculos/' || vehiculo_record.id || '/interior.jpg', 'Interior del vehículo', 3, false, true);
        
        -- Publicaciones para cada vehículo
        INSERT INTO publicaciones_vehiculo (id, vehiculo_id, plataforma, url_publicacion, id_publicacion, titulo, ficha_breve, activo) VALUES 
        (gen_random_uuid(), vehiculo_record.id, 'web', 'https://fratelli.voonda.net/vehiculos/' || vehiculo_record.id, 'WEB_' || vehiculo_record.id, 'Vehículo disponible - Ver detalles', 'Excelente vehículo en perfecto estado. Financiación disponible.', true),
        (gen_random_uuid(), vehiculo_record.id, 'facebook', 'https://facebook.com/posts/' || contador, 'FB_' || contador, 'Nuevo vehículo disponible!', 'Visitanos en nuestro showroom para conocer más detalles.', true),
        (gen_random_uuid(), vehiculo_record.id, 'mercadolibre', 'https://mercadolibre.com.ar/vehiculo_' || contador, 'ML_' || contador, 'Vehículo en excelente estado', 'Consulta por financiación. Entrega inmediata.', true);
        
        contador := contador + 1;
    END LOOP;
END $$;

-- Actualizar algunos vehículos existentes con estado_id
UPDATE vehiculos 
SET estado_id = (SELECT id FROM estados_vehiculo WHERE codigo = 'DISPONIBLE' LIMIT 1)
WHERE estado_id IS NULL;

-- Verificar datos insertados
SELECT 'Estados de vehículos' as tabla, COUNT(*) as registros FROM estados_vehiculo
UNION ALL
SELECT 'Imágenes generales' as tabla, COUNT(*) as registros FROM imagenes
UNION ALL
SELECT 'Imágenes de vehículos' as tabla, COUNT(*) as registros FROM imagenes_vehiculo
UNION ALL
SELECT 'Publicaciones de vehículos' as tabla, COUNT(*) as registros FROM publicaciones_vehiculo;