-- ===================================================
-- GIVE&GO DATABASE SCHEMA: DONACIONES (1FN, 2FN, 3FN)
-- ===================================================
-- Normalización aplicada:
-- 1FN: Cabecera y detalle separados según tipo de donación (monetaria vs especie).
-- 2FN: Dependencia funcional completa de la PK en tablas hijas respecto a donacion_id.
-- 3FN: Eliminación de cadenas repetitivas en categorías (`id_categoria` FK)
--      y métodos de pago (`id_metodo_pago` FK).

USE `giveandgo_v2`;

-- 1. Cabecera Principal de Donaciones
CREATE TABLE IF NOT EXISTS `donaciones` (
  `id_donacion` INT AUTO_INCREMENT PRIMARY KEY,
  `id_categoria` INT DEFAULT NULL,
  `categoria` VARCHAR(100) DEFAULT NULL, -- Mantenido para retrocompatibilidad
  `tipo` ENUM('Monetaria', 'Objeto') NOT NULL,
  `usuario_id` INT NOT NULL,
  `organizacion_id` INT NOT NULL,
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `estado` TINYINT DEFAULT 1, -- 1 = activo/completado, 0 = cancelado
  `observaciones` TEXT DEFAULT NULL,
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones` (`id_organizacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Detalle de Donaciones Monetarias
CREATE TABLE IF NOT EXISTS `donaciones_monetarias` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `donacion_id` INT NOT NULL,
  `id_metodo_pago` INT DEFAULT NULL,
  `metodo` VARCHAR(50) NOT NULL, -- 'tarjeta', 'nequi', 'daviplata', 'transferencia'
  `cuenta` VARCHAR(50) NOT NULL,
  `referencia_transaccion` VARCHAR(100) DEFAULT NULL,
  `valor` DECIMAL(15,2) NOT NULL,
  FOREIGN KEY (`donacion_id`) REFERENCES `donaciones` (`id_donacion`) ON DELETE CASCADE,
  FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodos_pago` (`id_metodo_pago`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Detalle de Donaciones de Objetos / En Especie
CREATE TABLE IF NOT EXISTS `donaciones_objetos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `donacion_id` INT NOT NULL,
  `id_categoria` INT DEFAULT NULL,
  `categoria` VARCHAR(100) NOT NULL, -- Mantenido para retrocompatibilidad
  `descripcion` TEXT NOT NULL,
  `cantidad` INT NOT NULL,
  `unidad_medida` VARCHAR(30) DEFAULT 'unidades', -- 'kg', 'unidades', 'cajas', 'kits'
  `estado_conservacion` ENUM('nuevo', 'usado_excelente', 'usado_bueno', 'no_perecedero') DEFAULT 'nuevo',
  FOREIGN KEY (`donacion_id`) REFERENCES `donaciones` (`id_donacion`) ON DELETE CASCADE,
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
