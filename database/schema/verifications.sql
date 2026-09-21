-- ===================================================
-- GIVE&GO DATABASE SCHEMA: SOLICITUDES DE VERIFICACIÓN (1FN, 2FN, 3FN)
-- ===================================================
-- Normalización aplicada:
-- 1FN: Archivos adjuntos atómicos en tabla dependiente `documentos_verificacion`.
-- 2FN: Dependencia funcional completa de la PK.
-- 3FN: Eliminación de la dependencia transitiva:
-- id_solicitud -> organizacion_id -> (nombre_organizacion, correo_organizacion, nit)

USE `giveandgo_v2`;

CREATE TABLE IF NOT EXISTS `solicitudes_verificacion` (
  `id_solicitud` INT AUTO_INCREMENT PRIMARY KEY,
  `organizacion_id` INT NOT NULL,
  `mensaje` TEXT DEFAULT NULL,
  `estado` ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',
  `respuesta_admin` TEXT DEFAULT NULL,
  `admin_revisor_id` INT DEFAULT NULL,
  `fecha_solicitud` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_respuesta` DATETIME DEFAULT NULL,
  -- Columnas desnormalizadas preservadas para retrocompatibilidad con queries existentes
  `nombre_organizacion` VARCHAR(150) DEFAULT NULL,
  `correo_organizacion` VARCHAR(100) DEFAULT NULL,
  `nit` VARCHAR(50) DEFAULT NULL,
  `documentos` TEXT DEFAULT NULL,
  FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones` (`id_organizacion`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_revisor_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla Normalizada de Documentos Probatorios (1FN)
CREATE TABLE IF NOT EXISTS `documentos_verificacion` (
  `id_documento` INT AUTO_INCREMENT PRIMARY KEY,
  `solicitud_id` INT NOT NULL,
  `tipo_documento` ENUM('rut', 'camara_comercio', 'cedula_representante', 'estados_financieros', 'otro') NOT NULL,
  `nombre_archivo` VARCHAR(255) NOT NULL,
  `url_archivo` TEXT NOT NULL,
  `fecha_subida` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes_verificacion` (`id_solicitud`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
