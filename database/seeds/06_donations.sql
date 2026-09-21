-- ===================================================
-- GIVE&GO DATABASE SEED: DONACIONES (3FN)
-- ===================================================

USE `giveandgo_v2`;

INSERT INTO `donaciones` (
  `id_donacion`, `id_categoria`, `categoria`, `tipo`, `usuario_id`, `organizacion_id`, `estado`, `observaciones`
) VALUES
(1, 5, 'Económico', 'Monetaria', 2, 1, 1, 'Donación para la compra de suministros alimentarios y verduras frescas.'),
(2, 1, 'Alimentos', 'Objeto', 3, 2, 1, 'Aporte en especie para el centro de adultos mayores de Castilla.')
ON DUPLICATE KEY UPDATE `tipo`=VALUES(`tipo`);

INSERT INTO `donaciones_monetarias` (
  `id`, `donacion_id`, `id_metodo_pago`, `metodo`, `cuenta`, `referencia_transaccion`, `valor`
) VALUES
(1, 1, 1, 'tarjeta', '**** **** **** 4321', 'TX-GIVE-2026-98124', 150000.00)
ON DUPLICATE KEY UPDATE `valor`=VALUES(`valor`);

INSERT INTO `donaciones_objetos` (
  `id`, `donacion_id`, `id_categoria`, `categoria`, `descripcion`, `cantidad`, `unidad_medida`, `estado_conservacion`
) VALUES
(1, 2, 1, 'Alimentos', '10 kg de arroz Diana, 5 kg de lentejas y 3 botellas de aceite vegetal', 15, 'kg / botellas', 'no_perecedero')
ON DUPLICATE KEY UPDATE `cantidad`=VALUES(`cantidad`);
