-- ===================================================
-- GIVE&GO DATABASE SCHEMA: ORGANIZACIONES (1FN, 2FN, 3FN)
-- ===================================================
-- Normalización aplicada:
-- 1FN: Redes sociales institucionales atómicas en tabla hija `organizacion_redes_sociales`.
-- 2FN: Dependencia funcional completa de la PK `id_organizacion`.
-- 3FN: `id_categoria` FK hacia `categorias`, `id_barrio` FK hacia `barrios(id_barrio)`.
--      Las organizaciones sí cuentan con perfil público detallado (misión, visión, web, logo, redes).

USE `giveandgo_v2`;

CREATE TABLE IF NOT EXISTS `organizaciones` (
  `id_organizacion` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario_representante` INT DEFAULT NULL,
  `nombre` VARCHAR(150) NOT NULL,
  `nit` VARCHAR(50) DEFAULT NULL,
  `representante_legal` VARCHAR(150) DEFAULT NULL,
  `id_categoria` INT DEFAULT NULL,
  `categoria` VARCHAR(100) DEFAULT NULL, -- Mantenido para retrocompatibilidad
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
  `redes_sociales` TEXT DEFAULT NULL, -- Mantenido para retrocompatibilidad
  `logo` TEXT DEFAULT NULL,
  `foto_portada` TEXT DEFAULT NULL,
  `latitud` DECIMAL(10,8) DEFAULT NULL,
  `longitud` DECIMAL(11,8) DEFAULT NULL,
  `verificada` TINYINT DEFAULT 0, -- 0 = No verificada, 1 = Verificada
  `estado_verificacion` VARCHAR(50) DEFAULT 'no_solicitado', -- 'no_solicitado', 'pendiente', 'aprobada', 'rechazada'
  `estado` TINYINT DEFAULT 1, -- 1 = activo, 0 = inactivo
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_org_correo` (`correo`),
  INDEX `idx_org_nit` (`nit`),
  FOREIGN KEY (`id_usuario_representante`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL,
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL,
  FOREIGN KEY (`id_barrio`) REFERENCES `barrios` (`id_barrio`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla Normalizada de Enlaces de Redes Sociales de Organizaciones (1FN)
CREATE TABLE IF NOT EXISTS `organizacion_redes_sociales` (
  `id_red` INT AUTO_INCREMENT PRIMARY KEY,
  `organizacion_id` INT NOT NULL,
  `plataforma` ENUM('facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'otra') NOT NULL,
  `url_perfil` VARCHAR(255) NOT NULL,
  UNIQUE KEY `uq_org_plataforma` (`organizacion_id`, `plataforma`),
  FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones` (`id_organizacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
