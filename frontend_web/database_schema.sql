-- Base de datos para GiveAndGo v2
CREATE DATABASE IF NOT EXISTS `giveandgo_v2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `giveandgo_v2`;

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` INT AUTO_INCREMENT PRIMARY KEY,
  `rol` ENUM('Admin', 'Voluntario', 'Beneficiario', 'Organizacion') NOT NULL,
  `nombre1` VARCHAR(50) NOT NULL,
  `nombre2` VARCHAR(50) DEFAULT NULL,
  `apellido1` VARCHAR(50) NOT NULL,
  `apellido2` VARCHAR(50) DEFAULT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `correo` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `estado` TINYINT DEFAULT 1, -- 1 = activo, 0 = inactivo
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Organizaciones
CREATE TABLE IF NOT EXISTS `organizaciones` (
  `id_organizacion` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `correo` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `estado` TINYINT DEFAULT 1, -- 1 = activo, 0 = inactivo
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla de Categorías de Eventos / Donaciones
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `estado` TINYINT DEFAULT 1 -- 1 = activo, 0 = inactivo
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabla de Eventos de Voluntariado
CREATE TABLE IF NOT EXISTS `eventos` (
  `id_evento` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `id_categoria` INT NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `fecha` DATETIME NOT NULL,
  `cupo` INT DEFAULT 0,
  `estado` TINYINT DEFAULT 1, -- 1 = activo, 2 = finalizado, 0 = cancelado
  `organizacion_id` INT NOT NULL,
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE RESTRICT,
  FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones` (`id_organizacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabla de Inscripciones a Eventos (Seguimiento de Eventos)
CREATE TABLE IF NOT EXISTS `seguimiento_eventos` (
  `id_seguimiento` INT AUTO_INCREMENT PRIMARY KEY,
  `evento_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_evento_usuario` (`evento_id`, `usuario_id`),
  FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id_evento`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabla de Cabecera de Donaciones
CREATE TABLE IF NOT EXISTS `donaciones` (
  `id_donacion` INT AUTO_INCREMENT PRIMARY KEY,
  `categoria` VARCHAR(100) DEFAULT NULL,
  `tipo` ENUM('Monetaria', 'Objeto') NOT NULL,
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` INT NOT NULL,
  `organizacion_id` INT NOT NULL,
  `estado` TINYINT DEFAULT 1, -- 1 = activo, 0 = inactivo
  `observaciones` TEXT DEFAULT NULL,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones` (`id_organizacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabla de Donaciones Monetarias
CREATE TABLE IF NOT EXISTS `donaciones_monetarias` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `metodo` VARCHAR(50) NOT NULL,
  `cuenta` VARCHAR(50) NOT NULL,
  `valor` DECIMAL(15,2) NOT NULL,
  `donacion_id` INT NOT NULL,
  FOREIGN KEY (`donacion_id`) REFERENCES `donaciones` (`id_donacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabla de Donaciones de Objetos (Especie)
CREATE TABLE IF NOT EXISTS `donaciones_objetos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `categoria` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `cantidad` INT NOT NULL,
  `donacion_id` INT NOT NULL,
  FOREIGN KEY (`donacion_id`) REFERENCES `donaciones` (`id_donacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabla de Solicitudes de Beneficiarios
CREATE TABLE IF NOT EXISTS `solicitudes` (
  `id_solicitud` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `titulo` VARCHAR(150) DEFAULT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `estado` ENUM('Pendiente', 'Aprobada', 'Rechazada') DEFAULT 'Pendiente',
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Datos Semilla Iniciales
-- Categorías iniciales
INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'Alimentos', 'Donaciones de alimentos', 1),
(2, 'Educación', 'Apoyo educativo', 1),
(3, 'Salud', 'Campañas de salud', 1),
(4, 'Medio Ambiente', 'Reforestación de zonas verdes', 1),
(5, 'Económico', 'Aportaciones monetarias', 1);

-- Usuarios iniciales
-- Contraseña encriptada para 'Admin123*'
INSERT INTO `usuarios` (`id_usuario`, `rol`, `nombre1`, `nombre2`, `apellido1`, `apellido2`, `telefono`, `correo`, `password`, `estado`) VALUES
(1, 'Admin', 'Administrador', 'General', 'General', NULL, '+57 300 123 4567', 'admin@giveandgo.com', '$2b$10$tZ9C.mJjXNco/e.e2jV9SeAAL68L16S78A9oGv2o62H9R1pW61qE.', 1),
-- Contraseña encriptada para 'User123*'
(2, 'Voluntario', 'Carlos', 'Andrés', 'Mendoza', 'Castro', '+57 310 987 6543', 'carlos@volunteer.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1),
(3, 'Voluntario', 'Sofía', NULL, 'Pérez', NULL, '+57 315 222 3333', 'sofia@volunteer.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1),
(4, 'Beneficiario', 'Juan', NULL, 'Gómez', NULL, '+57 320 444 5555', 'juan@beneficiary.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1),
(5, 'Beneficiario', 'María', NULL, 'Rodríguez', NULL, '+57 301 555 6666', 'maria@beneficiary.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1);

-- Organizaciones iniciales
-- Vinculamos también a la tabla 'usuarios' para su login centralizado
INSERT INTO `usuarios` (`id_usuario`, `rol`, `nombre1`, `nombre2`, `apellido1`, `apellido2`, `telefono`, `correo`, `password`, `estado`) VALUES
(101, 'Organizacion', 'Fundación Manos por Kennedy', NULL, 'Organización', NULL, '+57 300 000 0000', 'contacto@manosporkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1),
(102, 'Organizacion', 'Fundación Bogotá Solidaria', NULL, 'Organización', NULL, '+57 300 000 0000', 'info@bogotasolidaria.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1),
(103, 'Organizacion', 'Asociación Social Ciudad Kennedy', NULL, 'Organización', NULL, '+57 300 000 0000', 'hola@ciudadkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1);

INSERT INTO `organizaciones` (`id_organizacion`, `nombre`, `direccion`, `telefono`, `correo`, `password`, `descripcion`, `estado`) VALUES
(1, 'Fundación Manos por Kennedy', 'Calle 38 Sur # 78-45, Kennedy Central, Bogotá D.C.', '+57 300 000 0000', 'contacto@manosporkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 'Institución comunitaria enfocada en brindar seguridad alimentaria en Kennedy.', 1),
(2, 'Fundación Bogotá Solidaria', 'Carrera 80 # 40B Sur-12, Castilla, Bogotá D.C.', '+57 300 000 0000', 'info@bogotasolidaria.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 'Fundación sin ánimo de lucro enfocada en desarrollo y asistencia a adultos mayores.', 1),
(3, 'Asociación Social Ciudad Kennedy', 'Avenida Ciudad de Cali # 13-08, Patio Bonito, Bogotá D.C.', '+57 300 000 0000', 'hola@ciudadkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 'Organización para la recuperación ambiental y el apoyo pedagógico.', 1);

-- Eventos iniciales
INSERT INTO `eventos` (`id_evento`, `nombre`, `id_categoria`, `descripcion`, `direccion`, `fecha`, `cupo`, `estado`, `organizacion_id`) VALUES
(1, 'Jornada de Donación en Kennedy Central', 1, 'Ayúdanos a clasificar y empaquetar alimentos recibidos para las familias vulnerables de la localidad de Kennedy en nuestro centro comunitario.', 'Calle 38 Sur # 78-45, Kennedy Central', '2026-07-15 09:00:00', 50, 1, 1),
(2, 'Campaña Solidaria Patio Bonito', 2, 'Buscamos voluntarios para apoyar en el reforzamiento escolar y tutorías los fines de semana para niños del sector de Patio Bonito.', 'Avenida Ciudad de Cali # 13-08', '2026-07-20 08:00:00', 20, 1, 1),
(3, 'Reforestación del Humedal El Burro', 4, 'Jornada de siembra de especies nativas y limpieza en el Humedal El Burro de Kennedy. ¡Trae ropa cómoda y guantes!', 'Calle 8A con Carrera 82, Humedal El Burro', '2026-08-05 07:00:00', 100, 1, 3),
(4, 'Jornada Comunitaria Castilla', 3, 'Campaña de salud básica preventiva y entrega de kits de aseo para adultos mayores del barrio Castilla.', 'Carrera 80 # 40B Sur-12, Castilla', '2026-06-30 09:00:00', 30, 1, 2);

-- Solicitudes iniciales
INSERT INTO `solicitudes` (`id_solicitud`, `usuario_id`, `titulo`, `descripcion`, `estado`) VALUES
(1, 4, 'Apoyo alimentario en Patio Bonito', 'Solicito mercado básico no perecedero para mi núcleo familiar de 4 personas en el barrio Patio Bonito, Kennedy.', 'Pendiente'),
(2, 5, 'Útiles escolares en Castilla', 'Necesito cuadernos, lápices y útiles escolares para mis dos hijos de primaria en Castilla.', 'Aprobada'),
(3, 4, 'Kit de medicamentos esenciales', 'Solicitud de apoyo para adquirir medicamentos de control diario para un adulto mayor en el barrio Kennedy Central.', 'Rechazada');

-- Donación 1
INSERT INTO `donaciones` (`id_donacion`, `categoria`, `tipo`, `usuario_id`, `organizacion_id`, `estado`, `observaciones`) VALUES
(1, 'Económico', 'Monetaria', 2, 1, 1, 'Donación para la compra de suministros alimentarios.');
INSERT INTO `donaciones_monetarias` (`id`, `metodo`, `cuenta`, `valor`, `donacion_id`) VALUES
(1, 'tarjeta', '**** **** **** 4321', 150000.00, 1);

-- Donación 2
INSERT INTO `donaciones` (`id_donacion`, `categoria`, `tipo`, `usuario_id`, `organizacion_id`, `estado`, `observaciones`) VALUES
(2, 'Alimentos', 'Objeto', 3, 2, 1, 'Aporte en especie para el asilo de Castilla.');
INSERT INTO `donaciones_objetos` (`id`, `categoria`, `descripcion`, `cantidad`, `donacion_id`) VALUES
(1, 'Alimentos', '10 kg de arroz, 5 kg de legumbres y aceite vegetal', 15, 2);
