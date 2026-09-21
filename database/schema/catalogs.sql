-- ===================================================
-- GIVE&GO DATABASE SCHEMA: CATÁLOGOS BASE (1FN / 3FN)
-- ===================================================
-- Estos catálogos eliminan la duplicación de literales de cadena (VARCHAR),
-- permitiendo integridad referencial y cumpliendo 3FN al desacoplar
-- descripciones y códigos de las entidades operacionales.

USE `giveandgo_v2`;

-- 1. Catálogo de Roles del Sistema
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(30) NOT NULL UNIQUE,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `estado` TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Catálogo de Métodos de Pago / Donación Monetaria
CREATE TABLE IF NOT EXISTS `metodos_pago` (
  `id_metodo_pago` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(30) NOT NULL UNIQUE, -- 'tarjeta', 'nequi', 'daviplata', 'transferencia', 'efectivo'
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `estado` TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Catálogo de Estados de Postulaciones
CREATE TABLE IF NOT EXISTS `estados_postulacion` (
  `id_estado_postulacion` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(20) NOT NULL UNIQUE, -- 'pendiente', 'aprobado', 'rechazado', 'confirmado', 'cancelado'
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
