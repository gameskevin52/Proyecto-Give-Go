-- ===================================================
-- GIVE&GO DATABASE SCHEMA: USUARIOS & PERFILES (1FN, 2FN, 3FN)
-- ===================================================
-- Normalización aplicada:
-- 1FN: Atributos atómicos. No se solicitan documentos de identidad a personas.
--      Las redes sociales y perfiles públicos se reservan exclusivamente a organizaciones.
-- 2FN: Dependencia funcional completa de la clave primaria `id_usuario`.
-- 3FN: Relación a catálogo de roles (`id_rol`) y división barrial de Kennedy (`id_barrio`).
--      Especialización en sub-entidades (perfil voluntario, perfil beneficiario)
--      evitando columnas nulas innecesarias.

USE `giveandgo_v2`;

-- 1. Tabla Principal de Usuarios (Entidad Base / Supertipo)
CREATE TABLE IF NOT EXISTS `usuarios` (
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
  `estado` TINYINT DEFAULT 1, -- 1 = activo, 0 = inactivo
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_usuario_correo` (`correo`),
  FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE SET NULL,
  FOREIGN KEY (`id_barrio`) REFERENCES `barrios` (`id_barrio`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Subtipo Normalizado: Perfil Voluntario (Especialización EER)
CREATE TABLE IF NOT EXISTS `perfiles_voluntarios` (
  `usuario_id` INT PRIMARY KEY,
  `habilidades` TEXT DEFAULT NULL,
  `intereses` TEXT DEFAULT NULL,
  `disponibilidad` VARCHAR(100) DEFAULT NULL,
  `horas_acumuladas` DECIMAL(8,2) DEFAULT 0.00,
  `eventos_asistidos` INT DEFAULT 0,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Subtipo Normalizado: Perfil Beneficiario (Especialización EER)
CREATE TABLE IF NOT EXISTS `perfiles_beneficiarios` (
  `usuario_id` INT PRIMARY KEY,
  `condicion_especial` VARCHAR(150) DEFAULT NULL,
  `personas_a_cargo` INT DEFAULT 0,
  `necesidades_urgentes` TEXT DEFAULT NULL,
  `prioridad` ENUM('alta', 'media', 'baja') DEFAULT 'media',
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
