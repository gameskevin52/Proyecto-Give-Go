-- ===================================================
-- GIVE&GO DATABASE SCHEMA: VISTAS SQL DE COMPATIBILIDAD (VIEWS)
-- ===================================================
-- Estas vistas materializan en tiempo de consulta la información normalizada,
-- permitiendo que tanto el código legacy como los nuevos reportes puedan
-- acceder a datos enriquecidos con JOINs sin incurrir en redundancia física (3FN).

USE `giveandgo_v2`;

-- 1. Vista Enriquecida de Usuarios con su Barrio en Kennedy y Rol
CREATE OR REPLACE VIEW `v_usuarios_completo` AS
SELECT 
  u.id_usuario,
  r.codigo AS rol_codigo,
  r.nombre AS rol_nombre,
  u.rol,
  u.nombre1,
  u.nombre2,
  u.apellido1,
  u.apellido2,
  CONCAT(u.nombre1, IF(u.nombre2 IS NOT NULL AND u.nombre2 != '', CONCAT(' ', u.nombre2), ''), ' ', u.apellido1, IF(u.apellido2 IS NOT NULL AND u.apellido2 != '', CONCAT(' ', u.apellido2), '')) AS nombre_completo,
  u.fecha_nacimiento,
  u.telefono,
  u.correo,
  u.direccion,
  COALESCE(b.nombre, u.barrio) AS barrio,
  'Kennedy' AS localidad,
  'Bogotá' AS ciudad,
  'Bogotá D.C.' AS departamento,
  'Colombia' AS pais,
  COALESCE(b.codigo_postal, '110821') AS codigo_postal,
  u.foto,
  u.biografia,
  u.estado,
  u.fecha_registro,
  -- Atributos de Voluntario (Especialización)
  pv.habilidades AS vol_habilidades,
  pv.intereses AS vol_intereses,
  pv.disponibilidad AS vol_disponibilidad,
  pv.horas_acumuladas AS vol_horas_acumuladas,
  -- Atributos de Beneficiario (Especialización)
  pb.condicion_especial AS ben_condicion_especial,
  pb.personas_a_cargo AS ben_personas_a_cargo,
  pb.necesidades_urgentes AS ben_necesidades_urgentes
FROM `usuarios` u
LEFT JOIN `roles` r ON u.id_rol = r.id_rol
LEFT JOIN `barrios` b ON u.id_barrio = b.id_barrio
LEFT JOIN `perfiles_voluntarios` pv ON u.id_usuario = pv.usuario_id
LEFT JOIN `perfiles_beneficiarios` pb ON u.id_usuario = pb.usuario_id;

-- 2. Vista Enriquecida de Organizaciones (Con Perfil Público Completo)
CREATE OR REPLACE VIEW `v_organizaciones_completo` AS
SELECT 
  o.id_organizacion,
  o.nombre,
  o.nit,
  o.representante_legal,
  c_cat.nombre AS categoria_nombre,
  COALESCE(c_cat.nombre, o.categoria) AS categoria,
  o.direccion,
  COALESCE(b.nombre, o.barrio) AS barrio,
  'Kennedy' AS localidad,
  'Bogotá' AS ciudad,
  'Bogotá D.C.' AS departamento,
  'Colombia' AS pais,
  o.telefono,
  o.correo,
  o.descripcion,
  o.mision,
  o.vision,
  o.sitio_web,
  o.redes_sociales,
  o.logo,
  o.foto_portada,
  o.latitud,
  o.longitud,
  o.verificada,
  o.estado_verificacion,
  o.estado,
  o.fecha_registro
FROM `organizaciones` o
LEFT JOIN `categorias` c_cat ON o.id_categoria = c_cat.id_categoria
LEFT JOIN `barrios` b ON o.id_barrio = b.id_barrio;

-- 3. Vista Enriquecida de Eventos con Organizaciones y Georreferenciación
CREATE OR REPLACE VIEW `v_eventos_detalle` AS
SELECT 
  e.id_evento,
  e.nombre,
  e.id_categoria,
  cat.nombre AS categoria_nombre,
  e.organizacion_id,
  o.nombre AS organizacion_nombre,
  o.verificada AS organizacion_verificada,
  e.descripcion,
  e.direccion,
  COALESCE(b.nombre, e.barrio) AS barrio,
  'Kennedy' AS localidad,
  'Bogotá' AS ciudad,
  'Bogotá D.C.' AS departamento,
  'Colombia' AS pais,
  e.punto_referencia,
  e.nombre_lugar,
  e.latitud,
  e.longitud,
  e.fecha,
  e.fecha_fin,
  e.cupo,
  e.vacantes_voluntarios,
  e.vacantes_beneficiarios,
  e.ayuda_ofrecida,
  e.imagen,
  e.estado,
  e.fecha_creacion
FROM `eventos` e
INNER JOIN `categorias` cat ON e.id_categoria = cat.id_categoria
INNER JOIN `organizaciones` o ON e.organizacion_id = o.id_organizacion
LEFT JOIN `barrios` b ON e.id_barrio = b.id_barrio;

-- 4. Vista de Auditorías 3FN (Resuelve nombres y roles en caliente)
CREATE OR REPLACE VIEW `v_auditorias_completo` AS
SELECT 
  a.id_audit,
  a.fecha,
  a.accion,
  a.modulo_afectado,
  a.direccion_ip,
  a.id_usuario,
  COALESCE(
    CONCAT(u.nombre1, IF(u.nombre2 IS NOT NULL AND u.nombre2 != '', CONCAT(' ', u.nombre2), ''), ' ', u.apellido1),
    a.nombre_usuario,
    'Usuario Desconocido'
  ) AS nombre_usuario,
  COALESCE(r.nombre, u.rol, a.rol_usuario, 'General') AS rol_usuario
FROM `auditorias` a
LEFT JOIN `usuarios` u ON a.id_usuario = u.id_usuario
LEFT JOIN `roles` r ON u.id_rol = r.id_rol;

-- 5. Vista de Solicitudes de Verificación 3FN (Resuelve datos institucionales)
CREATE OR REPLACE VIEW `v_solicitudes_verificacion_detalle` AS
SELECT 
  sv.id_solicitud,
  sv.organizacion_id,
  COALESCE(o.nombre, sv.nombre_organizacion) AS nombre_organizacion,
  COALESCE(o.correo, sv.correo_organizacion) AS correo_organizacion,
  COALESCE(o.nit, sv.nit) AS nit,
  sv.mensaje,
  sv.documentos,
  sv.estado,
  sv.respuesta_admin,
  sv.admin_revisor_id,
  sv.fecha_solicitud,
  sv.fecha_respuesta
FROM `solicitudes_verificacion` sv
LEFT JOIN `organizaciones` o ON sv.organizacion_id = o.id_organizacion;
