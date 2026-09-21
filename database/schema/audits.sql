-- ===================================================
-- GIVE&GO DATABASE SCHEMA: AUDITORÍAS / LOGS (3FN)
-- ===================================================
-- Normalización aplicada:
-- 3FN: Eliminación de la dependencia transitiva:
-- id_audit -> id_usuario -> (nombre_usuario, rol_usuario)
-- El nombre y el rol se obtienen mediante JOIN sobre la tabla `usuarios`.
-- Se normaliza el tipo de dato de `fecha` a TIMESTAMP para soporte de ordenación e índices.

USE `giveandgo_v2`;

CREATE TABLE IF NOT EXISTS `auditorias` (
  `id_audit` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL,
  `accion` VARCHAR(255) NOT NULL,
  `modulo_afectado` VARCHAR(50) DEFAULT 'general',
  `direccion_ip` VARCHAR(45) DEFAULT NULL,
  `detalles` TEXT DEFAULT NULL,
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Columnas redundantes mantenidas para retrocompatibilidad histórica directa
  `nombre_usuario` VARCHAR(150) DEFAULT NULL,
  `rol_usuario` VARCHAR(50) DEFAULT NULL,
  INDEX `idx_audit_usuario` (`id_usuario`),
  INDEX `idx_audit_fecha` (`fecha`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
