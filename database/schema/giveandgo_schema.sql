-- =========================================================================
-- GIVE&GO DATABASE CONSOLIDATED SCHEMA (v3.1 - LOCALIDAD DE KENNEDY)
-- Modelado Relacional Conforme a 1FN, 2FN, 3FN y BCNF
-- =========================================================================
-- Enfoque territorial exclusivo en la Localidad de Kennedy (Bogotá, Colombia).
-- No se solicitan documentos personales a usuarios individuales.
-- Las redes sociales y perfiles públicos detallados son exclusivos de organizaciones.
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `giveandgo_v2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `giveandgo_v2`;

SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================================
-- SECCIÓN 1: CATÁLOGOS BASE Y SEGURIDAD (3FN / BCNF)
-- =========================================================================

-- 1.1 Roles del Sistema
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id_rol` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(30) NOT NULL UNIQUE,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `estado` TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.2 Métodos de Pago y Donación
DROP TABLE IF EXISTS `metodos_pago`;
CREATE TABLE `metodos_pago` (
  `id_metodo_pago` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(30) NOT NULL UNIQUE,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `estado` TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.3 Estados de Postulación
DROP TABLE IF EXISTS `estados_postulacion`;
CREATE TABLE `estados_postulacion` (
  `id_estado_postulacion` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(20) NOT NULL UNIQUE,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.4 Categorías de Acción Social y Eventos
DROP TABLE IF EXISTS `categorias`;
CREATE TABLE `categorias` (
  `id_categoria` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `descripcion` TEXT DEFAULT NULL,
  `estado` TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SECCIÓN 2: DIVISIÓN GEOGRÁFICA DE KENNEDY (3FN)
-- =========================================================================

-- 2.1 Barrios (Sectores y UPZ de la Localidad de Kennedy)
DROP TABLE IF EXISTS `barrios`;
CREATE TABLE `barrios` (
  `id_barrio` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `codigo_postal` VARCHAR(20) DEFAULT '110821',
  `estado` TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.2 Direcciones Georreferenciadas
DROP TABLE IF EXISTS `direcciones`;
CREATE TABLE `direcciones` (
  `id_direccion` INT AUTO_INCREMENT PRIMARY KEY,
  `id_barrio` INT DEFAULT NULL,
  `direccion_linea` VARCHAR(255) NOT NULL,
  `punto_referencia` VARCHAR(255) DEFAULT NULL,
  `latitud` DECIMAL(10,8) DEFAULT NULL,
  `longitud` DECIMAL(11,8) DEFAULT NULL,
  FOREIGN KEY (`id_barrio`) REFERENCES `barrios` (`id_barrio`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SECCIÓN 3: USUARIOS Y ESPECIALIZACIONES EER (1FN / 2FN / 3FN)
-- =========================================================================

-- 3.1 Tabla Base de Usuarios (Sin documentos de identidad ni redes públicas)
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id_usuario` INT AUTO_INCREMENT PRIMARY KEY,
  `id_rol` INT DEFAULT NULL,
  `rol` ENUM('Admin', 'Voluntario', 'Beneficiario', 'Organizacion') NOT NULL,
  `nombre1` VARCHAR(50) NOT NULL,
  `nombre2` VARCHAR(50) DEFAULT NULL,
  `apellido1` VARCHAR(50) NOT NULL,
  `apellido2` VARCHAR(50) DEFAULT NULL,
  `fecha_nacimiento` DATE DEFAULT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `correo` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `id_barrio` INT DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `barrio` VARCHAR(100) DEFAULT NULL,
  `foto` TEXT DEFAULT NULL,
  `biografia` TEXT DEFAULT NULL,
  `estado` TINYINT DEFAULT 1,
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_usuario_correo` (`correo`),
  FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE SET NULL,
  FOREIGN KEY (`id_barrio`) REFERENCES `barrios` (`id_barrio`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3.2 Especialización: Perfil de Voluntario (EER)
DROP TABLE IF EXISTS `perfiles_voluntarios`;
CREATE TABLE `perfiles_voluntarios` (
  `usuario_id` INT PRIMARY KEY,
  `habilidades` TEXT DEFAULT NULL,
  `intereses` TEXT DEFAULT NULL,
  `disponibilidad` VARCHAR(100) DEFAULT NULL,
  `horas_acumuladas` DECIMAL(8,2) DEFAULT 0.00,
  `eventos_asistidos` INT DEFAULT 0,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3.3 Especialización: Perfil de Beneficiario (EER)
DROP TABLE IF EXISTS `perfiles_beneficiarios`;
CREATE TABLE `perfiles_beneficiarios` (
  `usuario_id` INT PRIMARY KEY,
  `condicion_especial` VARCHAR(150) DEFAULT NULL,
  `personas_a_cargo` INT DEFAULT 0,
  `necesidades_urgentes` TEXT DEFAULT NULL,
  `prioridad` ENUM('alta', 'media', 'baja') DEFAULT 'media',
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SECCIÓN 4: ORGANIZACIONES COMUNITARIAS (1FN / 3FN)
-- (Con Perfil Público Completo y Redes Sociales Institucionales)
-- =========================================================================

DROP TABLE IF EXISTS `organizaciones`;
CREATE TABLE `organizaciones` (
  `id_organizacion` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario_representante` INT DEFAULT NULL,
  `nombre` VARCHAR(150) NOT NULL,
  `nit` VARCHAR(50) DEFAULT NULL,
  `representante_legal` VARCHAR(150) DEFAULT NULL,
  `id_categoria` INT DEFAULT NULL,
  `categoria` VARCHAR(100) DEFAULT NULL,
  `id_barrio` INT DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `barrio` VARCHAR(100) DEFAULT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `correo` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `mision` TEXT DEFAULT NULL,
  `vision` TEXT DEFAULT NULL,
  `sitio_web` VARCHAR(255) DEFAULT NULL,
  `redes_sociales` TEXT DEFAULT NULL,
  `logo` TEXT DEFAULT NULL,
  `foto_portada` TEXT DEFAULT NULL,
  `latitud` DECIMAL(10,8) DEFAULT NULL,
  `longitud` DECIMAL(11,8) DEFAULT NULL,
  `verificada` TINYINT DEFAULT 0,
  `estado_verificacion` VARCHAR(50) DEFAULT 'no_solicitado',
  `estado` TINYINT DEFAULT 1,
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_org_correo` (`correo`),
  INDEX `idx_org_nit` (`nit`),
  FOREIGN KEY (`id_usuario_representante`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL,
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL,
  FOREIGN KEY (`id_barrio`) REFERENCES `barrios` (`id_barrio`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Normalización 1FN: Redes Sociales de Organizaciones
DROP TABLE IF EXISTS `organizacion_redes_sociales`;
CREATE TABLE `organizacion_redes_sociales` (
  `id_red` INT AUTO_INCREMENT PRIMARY KEY,
  `organizacion_id` INT NOT NULL,
  `plataforma` ENUM('facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'otra') NOT NULL,
  `url_perfil` VARCHAR(255) NOT NULL,
  UNIQUE KEY `uq_org_plataforma` (`organizacion_id`, `plataforma`),
  FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones` (`id_organizacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SECCIÓN 5: EVENTOS Y POSTULACIONES (1FN / 2FN / 3FN / BCNF)
-- =========================================================================

-- 5.1 Eventos
DROP TABLE IF EXISTS `eventos`;
CREATE TABLE `eventos` (
  `id_evento` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `id_categoria` INT NOT NULL,
  `organizacion_id` INT NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `id_barrio` INT DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `barrio` VARCHAR(100) DEFAULT NULL,
  `punto_referencia` VARCHAR(255) DEFAULT NULL,
  `nombre_lugar` VARCHAR(150) DEFAULT NULL,
  `latitud` DECIMAL(10,8) DEFAULT NULL,
  `longitud` DECIMAL(11,8) DEFAULT NULL,
  `fecha` DATETIME NOT NULL,
  `fecha_fin` DATETIME DEFAULT NULL,
  `cupo` INT DEFAULT 0,
  `vacantes_voluntarios` INT DEFAULT 0,
  `vacantes_beneficiarios` INT DEFAULT 0,
  `ayuda_ofrecida` TEXT DEFAULT NULL,
  `imagen` TEXT DEFAULT NULL,
  `estado` TINYINT DEFAULT 1,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_evento_fecha` (`fecha`),
  INDEX `idx_evento_org` (`organizacion_id`),
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE RESTRICT,
  FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones` (`id_organizacion`) ON DELETE CASCADE,
  FOREIGN KEY (`id_barrio`) REFERENCES `barrios` (`id_barrio`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5.2 Postulaciones a Eventos (Intersección Normalizada)
DROP TABLE IF EXISTS `tabla_postulaciones`;
CREATE TABLE `tabla_postulaciones` (
  `id_postulacion` INT AUTO_INCREMENT PRIMARY KEY,
  `id_evento` INT NOT NULL,
  `id_usuario` INT NOT NULL,
  `tipo_postulacion` ENUM('voluntario', 'beneficiario') NOT NULL,
  `id_estado_postulacion` INT DEFAULT NULL,
  `estado_postulacion` ENUM('pendiente', 'aprobado', 'rechazado', 'confirmado', 'cancelado') DEFAULT 'pendiente',
  `fecha_postulacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_aprobacion` DATETIME DEFAULT NULL,
  `fecha_confirmacion` DATETIME DEFAULT NULL,
  `asistencia_confirmada` TINYINT(1) DEFAULT 0,
  `horas_acreditadas` DECIMAL(5,2) DEFAULT 0.00,
  `observaciones` TEXT DEFAULT NULL,
  UNIQUE KEY `unique_postulacion` (`id_evento`, `id_usuario`, `tipo_postulacion`),
  FOREIGN KEY (`id_evento`) REFERENCES `eventos` (`id_evento`) ON DELETE CASCADE,
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  FOREIGN KEY (`id_estado_postulacion`) REFERENCES `estados_postulacion` (`id_estado_postulacion`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5.3 Asistencia / Seguimiento de Eventos
DROP TABLE IF EXISTS `seguimiento_eventos`;
CREATE TABLE `seguimiento_eventos` (
  `id_seguimiento` INT AUTO_INCREMENT PRIMARY KEY,
  `evento_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_evento_usuario` (`evento_id`, `usuario_id`),
  FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id_evento`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SECCIÓN 6: DONACIONES (1FN / 2FN / 3FN)
-- =========================================================================

-- 6.1 Cabecera de Donaciones
DROP TABLE IF EXISTS `donaciones`;
CREATE TABLE `donaciones` (
  `id_donacion` INT AUTO_INCREMENT PRIMARY KEY,
  `id_categoria` INT DEFAULT NULL,
  `categoria` VARCHAR(100) DEFAULT NULL,
  `tipo` ENUM('Monetaria', 'Objeto') NOT NULL,
  `usuario_id` INT NOT NULL,
  `organizacion_id` INT NOT NULL,
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `estado` TINYINT DEFAULT 1,
  `observaciones` TEXT DEFAULT NULL,
  INDEX `idx_donacion_fecha` (`fecha`),
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones` (`id_organizacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6.2 Donaciones Monetarias
DROP TABLE IF EXISTS `donaciones_monetarias`;
CREATE TABLE `donaciones_monetarias` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `donacion_id` INT NOT NULL,
  `id_metodo_pago` INT DEFAULT NULL,
  `metodo` VARCHAR(50) NOT NULL,
  `cuenta` VARCHAR(50) NOT NULL,
  `referencia_transaccion` VARCHAR(100) DEFAULT NULL,
  `valor` DECIMAL(15,2) NOT NULL,
  FOREIGN KEY (`donacion_id`) REFERENCES `donaciones` (`id_donacion`) ON DELETE CASCADE,
  FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodos_pago` (`id_metodo_pago`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6.3 Donaciones de Objetos (Especie)
DROP TABLE IF EXISTS `donaciones_objetos`;
CREATE TABLE `donaciones_objetos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `donacion_id` INT NOT NULL,
  `id_categoria` INT DEFAULT NULL,
  `categoria` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `cantidad` INT NOT NULL,
  `unidad_medida` VARCHAR(30) DEFAULT 'unidades',
  `estado_conservacion` ENUM('nuevo', 'usado_excelente', 'usado_bueno', 'no_perecedero') DEFAULT 'nuevo',
  FOREIGN KEY (`donacion_id`) REFERENCES `donaciones` (`id_donacion`) ON DELETE CASCADE,
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SECCIÓN 7: SOLICITUDES DE BENEFICIARIOS (2FN / 3FN)
-- =========================================================================

DROP TABLE IF EXISTS `solicitudes`;
CREATE TABLE `solicitudes` (
  `id_solicitud` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `id_categoria` INT DEFAULT NULL,
  `titulo` VARCHAR(150) DEFAULT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `estado` ENUM('Pendiente', 'Aprobada', 'Rechazada') DEFAULT 'Pendiente',
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SECCIÓN 8: AUDITORÍA (3FN - Sin Dependencias Transitivas)
-- =========================================================================

DROP TABLE IF EXISTS `auditorias`;
CREATE TABLE `auditorias` (
  `id_audit` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL,
  `accion` VARCHAR(255) NOT NULL,
  `modulo_afectado` VARCHAR(50) DEFAULT 'general',
  `direccion_ip` VARCHAR(45) DEFAULT NULL,
  `detalles` TEXT DEFAULT NULL,
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `nombre_usuario` VARCHAR(150) DEFAULT NULL,
  `rol_usuario` VARCHAR(50) DEFAULT NULL,
  INDEX `idx_audit_usuario` (`id_usuario`),
  INDEX `idx_audit_fecha` (`fecha`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SECCIÓN 9: VERIFICACIONES DE ORGANIZACIONES (1FN / 3FN)
-- (Solo se gestionan documentos para verificar organizaciones)
-- =========================================================================

DROP TABLE IF EXISTS `solicitudes_verificacion`;
CREATE TABLE `solicitudes_verificacion` (
  `id_solicitud` INT AUTO_INCREMENT PRIMARY KEY,
  `organizacion_id` INT NOT NULL,
  `mensaje` TEXT DEFAULT NULL,
  `estado` ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',
  `respuesta_admin` TEXT DEFAULT NULL,
  `admin_revisor_id` INT DEFAULT NULL,
  `fecha_solicitud` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_respuesta` DATETIME DEFAULT NULL,
  `nombre_organizacion` VARCHAR(150) DEFAULT NULL,
  `correo_organizacion` VARCHAR(100) DEFAULT NULL,
  `nit` VARCHAR(50) DEFAULT NULL,
  `documentos` TEXT DEFAULT NULL,
  FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones` (`id_organizacion`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_revisor_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9.2 Documentos Adjuntos Normalizados (1FN) - Exclusivo para Organizaciones
DROP TABLE IF EXISTS `documentos_verificacion`;
CREATE TABLE `documentos_verificacion` (
  `id_documento` INT AUTO_INCREMENT PRIMARY KEY,
  `solicitud_id` INT NOT NULL,
  `tipo_documento` ENUM('rut', 'camara_comercio', 'cedula_representante', 'estados_financieros', 'otro') NOT NULL,
  `nombre_archivo` VARCHAR(255) NOT NULL,
  `url_archivo` TEXT NOT NULL,
  `fecha_subida` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes_verificacion` (`id_solicitud`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- SECCIÓN 10: VISTAS DE COMPATIBILIDAD RELACIONAL
-- =========================================================================

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
  pv.habilidades AS vol_habilidades,
  pv.intereses AS vol_intereses,
  pv.disponibilidad AS vol_disponibilidad,
  pv.horas_acumuladas AS vol_horas_acumuladas,
  pb.condicion_especial AS ben_condicion_especial,
  pb.personas_a_cargo AS ben_personas_a_cargo,
  pb.necesidades_urgentes AS ben_necesidades_urgentes
FROM `usuarios` u
LEFT JOIN `roles` r ON u.id_rol = r.id_rol
LEFT JOIN `barrios` b ON u.id_barrio = b.id_barrio
LEFT JOIN `perfiles_voluntarios` pv ON u.id_usuario = pv.usuario_id
LEFT JOIN `perfiles_beneficiarios` pb ON u.id_usuario = pb.usuario_id;

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

SET FOREIGN_KEY_CHECKS = 1;
