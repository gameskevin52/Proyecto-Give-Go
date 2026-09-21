-- ===================================================
-- GIVE&GO DATABASE SCHEMA: EVENTOS & POSTULACIONES (1FN, 2FN, 3FN, BCNF)
-- ===================================================
-- Normalización aplicada:
-- 1FN: Atributos atómicos.
-- 2FN: En postulaciones, los atributos dependen totalmente de la relación (evento, usuario).
-- 3FN: Ubicación geográfica vinculada a `barrios(id_barrio)` y estado a `estados_postulacion`.
-- BCNF: Cada determinante funcional es superclave.

USE `giveandgo_v2`;

-- 1. Tabla de Eventos de Voluntariado y Jornadas
CREATE TABLE IF NOT EXISTS `eventos` (
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
  `estado` TINYINT DEFAULT 1, -- 1 = activo, 2 = finalizado, 0 = cancelado
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_evento_fecha` (`fecha`),
  INDEX `idx_evento_org` (`organizacion_id`),
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE RESTRICT,
  FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones` (`id_organizacion`) ON DELETE CASCADE,
  FOREIGN KEY (`id_barrio`) REFERENCES `barrios` (`id_barrio`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Postulaciones (Intersección Normalizada: Usuarios x Eventos)
CREATE TABLE IF NOT EXISTS `tabla_postulaciones` (
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

-- 3. Tabla de Seguimiento de Eventos / Asistencia Registrada
CREATE TABLE IF NOT EXISTS `seguimiento_eventos` (
  `id_seguimiento` INT AUTO_INCREMENT PRIMARY KEY,
  `evento_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_evento_usuario` (`evento_id`, `usuario_id`),
  FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id_evento`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
