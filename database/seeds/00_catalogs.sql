-- ===================================================
-- GIVE&GO SEEDS: CATÁLOGOS BASE NORMALIZADOS
-- ===================================================

USE `giveandgo_v2`;

-- 1. Roles
INSERT INTO `roles` (`id_rol`, `codigo`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'Admin', 'Administrador', 'Control total de la plataforma y auditoría', 1),
(2, 'Voluntario', 'Voluntario', 'Participante comunitario en causas y donante', 1),
(3, 'Beneficiario', 'Beneficiario', 'Receptor de asistencia social y ayudas', 1),
(4, 'Organizacion', 'Organización', 'Fundación o entidad gestora de causas', 1)
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);

-- 2. Métodos de Pago
INSERT INTO `metodos_pago` (`id_metodo_pago`, `codigo`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'tarjeta', 'Tarjeta de Crédito/Débito', 'Pasarela electrónica PSE/Visa/MasterCard', 1),
(2, 'nequi', 'Nequi', 'Billetera digital Bancolombia', 1),
(3, 'daviplata', 'Daviplata', 'Billetera digital Davivienda', 1),
(4, 'transferencia', 'Transferencia Bancaria', 'Cuenta corriente o ahorros empresarial', 1),
(5, 'efectivo', 'Efectivo / Punto Físico', 'Entrega directa en la sede de la entidad', 1)
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);

-- 3. Estados de Postulación
INSERT INTO `estados_postulacion` (`id_estado_postulacion`, `codigo`, `nombre`, `descripcion`) VALUES
(1, 'pendiente', 'Pendiente de Revisión', 'Solicitud recibida pendiente de evaluación por la organización'),
(2, 'aprobado', 'Aprobado', 'El aspirante ha sido admitido para el evento'),
(3, 'rechazado', 'Rechazado', 'La postulación no cumplió los requisitos o se llenó el cupo'),
(4, 'confirmado', 'Asistencia Confirmada', 'El usuario ratificó su presencia en la jornada'),
(5, 'cancelado', 'Cancelado', 'El usuario o la organización retiraron la postulación')
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);
