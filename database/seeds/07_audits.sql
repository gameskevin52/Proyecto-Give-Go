-- ===================================================
-- GIVE&GO DATABASE SEED: AUDITORÍAS (3FN)
-- ===================================================

USE `giveandgo_v2`;

INSERT INTO `auditorias` (
  `id_usuario`, `accion`, `modulo_afectado`, `direccion_ip`, `detalles`, `nombre_usuario`, `rol_usuario`
) VALUES
(1, 'Inicio de sesión exitoso del Administrador', 'autenticacion', '192.168.1.10', 'Acceso desde panel administrativo', 'Administrador General', 'Admin'),
(1, 'Creación de convocatoria comunitaria en Kennedy Central', 'eventos', '192.168.1.10', 'ID Evento: 1 - Jornada de Donación', 'Administrador General', 'Admin'),
(2, 'Inscripción confirmada como voluntario', 'postulaciones', '186.84.90.12', 'Evento: Reforestación Humedal El Burro', 'Carlos Andrés Mendoza', 'Voluntario'),
(2, 'Donación monetaria procesada exitosamente', 'donaciones', '186.84.90.12', 'Monto: $150,000 COP via Pasarela', 'Carlos Andrés Mendoza', 'Voluntario');
