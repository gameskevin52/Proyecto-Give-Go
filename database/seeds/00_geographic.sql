-- ===================================================
-- GIVE&GO SEEDS: DIVISIÓN GEOGRÁFICA DE KENNEDY (3FN)
-- ===================================================
-- Catálogo representativo de UPZ y barrios de la Localidad de Kennedy, Bogotá D.C.

USE `giveandgo_v2`;

INSERT INTO `barrios` (`id_barrio`, `nombre`, `codigo_postal`, `estado`) VALUES
(1, 'Kennedy Central', '110821', 1),
(2, 'Castilla', '110831', 1),
(3, 'Patio Bonito', '110871', 1),
(4, 'El Tintal', '110841', 1),
(5, 'Timiza', '110851', 1),
(6, 'Mandalay', '110831', 1),
(7, 'Carvajal', '110851', 1),
(8, 'Pastrana', '110861', 1)
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);
