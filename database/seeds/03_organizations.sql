-- ===================================================
-- GIVE&GO DATABASE SEED: ORGANIZACIONES NORMALIZADAS
-- ===================================================

USE `giveandgo_v2`;

INSERT INTO `organizaciones` (
  `id_organizacion`, `id_usuario_representante`, `nombre`, `nit`, `representante_legal`,
  `id_categoria`, `categoria`, `id_barrio`, `direccion`, `barrio`,
  `telefono`, `correo`, `password`, `descripcion`, `mision`, `vision`, `sitio_web`,
  `latitud`, `longitud`, `verificada`, `estado_verificacion`, `estado`
) VALUES
(
  1, 101, 'Fundación Manos por Kennedy', '901.456.789-1', 'Claudia Marcela Rincón',
  1, 'Alimentos', 1, 'Calle 38 Sur # 78-45', 'Kennedy Central',
  '+57 300 000 0000', 'contacto@manosporkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
  'Institución comunitaria enfocada en brindar seguridad alimentaria y comedores en Kennedy Central.',
  'Erradicar el hambre en la localidad de Kennedy mediante redes solidarias comunitarias.',
  'Ser el banco de alimentos comunitario modelo en Bogotá para el 2030.',
  'https://manosporkennedy.org', 4.61900000, -74.15200000, 1, 'aprobada', 1
),
(
  2, 102, 'Fundación Bogotá Solidaria', '900.890.123-4', 'Javier Eduardo Morales',
  3, 'Salud', 2, 'Carrera 80 # 40B Sur-12', 'Castilla',
  '+57 300 000 0000', 'info@bogotasolidaria.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
  'Fundación sin ánimo de lucro enfocada en desarrollo, salud básica y asistencia a adultos mayores en Castilla.',
  'Promover el bienestar integral de la población de la tercera edad vulnerable.',
  'Consolidar centros de atención comunitaria integral en todo el suroccidente de Bogotá.',
  'https://bogotasolidaria.org', 4.63850000, -74.14800000, 1, 'aprobada', 1
),
(
  3, 103, 'Asociación Social Ciudad Kennedy', '901.112.334-5', 'Marta Liliana Bermúdez',
  4, 'Medio Ambiente', 3, 'Avenida Ciudad de Cali # 13-08', 'Patio Bonito',
  '+57 300 000 0000', 'hola@ciudadkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
  'Organización barrial para la recuperación ambiental de humedales y apoyo pedagógico comunitario.',
  'Recuperar los ecosistemas hídricos de Kennedy y fomentar la educación ambiental infantil.',
  'Tener humedales protegidos y niños líderes ambientales en cada UPZ de Kennedy.',
  'https://ciudadkennedy.org', 4.62800000, -74.16800000, 0, 'pendiente', 1
)
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);

-- Redes Sociales de Organizaciones (1FN - Exclusivas para Organizaciones)
INSERT INTO `organizacion_redes_sociales` (`organizacion_id`, `plataforma`, `url_perfil`) VALUES
(1, 'facebook', 'https://facebook.com/manosporkennedy'),
(1, 'instagram', 'https://instagram.com/manosporkennedy'),
(2, 'facebook', 'https://facebook.com/bogotasolidaria'),
(3, 'twitter', 'https://twitter.com/ciudadkennedy_org')
ON DUPLICATE KEY UPDATE `url_perfil`=VALUES(`url_perfil`);
