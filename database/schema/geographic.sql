-- ===================================================
-- GIVE&GO DATABASE SCHEMA: DIVISIÓN GEOGRÁFICA (3FN)
-- ===================================================
-- El proyecto está enfocado exclusivamente en la Localidad de Kennedy
-- (Bogotá D.C., Colombia). Por consiguiente, no se requieren tablas
-- redundantes de países, departamentos, ciudades ni localidades.
-- La granularidad geográfica variable se gestiona a nivel de barrios de Kennedy.

USE `giveandgo_v2`;

-- 1. Catálogo de Barrios (Sectores y UPZ de la Localidad de Kennedy)
CREATE TABLE IF NOT EXISTS `barrios` (
  `id_barrio` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `codigo_postal` VARCHAR(20) DEFAULT '110821',
  `estado` TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Ubicaciones / Direcciones Georreferenciadas
-- Permite asociar puntos georreferenciados precisos (lat/long) reutilizables
CREATE TABLE IF NOT EXISTS `direcciones` (
  `id_direccion` INT AUTO_INCREMENT PRIMARY KEY,
  `id_barrio` INT DEFAULT NULL,
  `direccion_linea` VARCHAR(255) NOT NULL,
  `punto_referencia` VARCHAR(255) DEFAULT NULL,
  `latitud` DECIMAL(10,8) DEFAULT NULL,
  `longitud` DECIMAL(11,8) DEFAULT NULL,
  FOREIGN KEY (`id_barrio`) REFERENCES `barrios` (`id_barrio`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
