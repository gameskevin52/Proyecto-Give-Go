-- ===================================================
-- GIVE&GO DATABASE SEED: EVENTOS Y POSTULACIONES (3FN)
-- ===================================================

USE `giveandgo_v2`;

INSERT INTO `eventos` (
  `id_evento`, `nombre`, `id_categoria`, `organizacion_id`, `descripcion`,
  `id_barrio`, `direccion`, `barrio`,
  `punto_referencia`, `nombre_lugar`, `latitud`, `longitud`, `fecha`, `cupo`,
  `vacantes_voluntarios`, `vacantes_beneficiarios`, `ayuda_ofrecida`, `estado`
) VALUES
(
  1, 'Jornada de Donación en Kennedy Central', 1, 1,
  'Ayúdanos a clasificar y empaquetar alimentos recibidos para las familias vulnerables de la localidad de Kennedy.',
  1, 'Calle 38 Sur # 78-45', 'Kennedy Central',
  'A una cuadra de la Plaza Central de Kennedy', 'Sede Comunitaria Manos por Kennedy', 4.61900000, -74.15200000,
  '2026-07-15 09:00:00', 50, 20, 30, 'Paquete nutricional no perecedero para 3 semanas.', 1
),
(
  2, 'Campaña Solidaria Patio Bonito', 2, 1,
  'Buscamos voluntarios para apoyar en el reforzamiento escolar y tutorías los fines de semana para niños de básica primaria.',
  3, 'Avenida Ciudad de Cali # 13-08', 'Patio Bonito',
  'Frente a la estación de TransMilenio Patio Bonito', 'Salón Comunal Sector 2', 4.62800000, -74.16800000,
  '2026-07-20 08:00:00', 20, 10, 10, 'Kits de útiles escolares y refrigerio pedagógico.', 1
),
(
  3, 'Reforestación del Humedal El Burro', 4, 3,
  'Jornada ecológica de siembra de 100 especies arbóreas nativas y recolección de residuos en la ronda del Humedal El Burro.',
  2, 'Calle 8A con Carrera 82', 'Castilla',
  'Entrada principal por el sendero peatonal', 'Reserva Humedal El Burro', 4.64200000, -74.15600000,
  '2026-08-05 07:00:00', 100, 80, 20, 'Capacitación en botánica nativa, herramientas y refrigerio.', 1
),
(
  4, 'Jornada Comunitaria Castilla', 3, 2,
  'Campaña de salud básica preventiva, toma de presión, tamizaje nutricional y entrega de kits de aseo para adultos mayores.',
  2, 'Carrera 80 # 40B Sur-12', 'Castilla',
  'Al lado del Polideportivo Castilla', 'Centro de Vida San Jerónimo', 4.63850000, -74.14800000,
  '2026-06-30 09:00:00', 30, 15, 15, 'Atención médica general básica y kit de aseo personal.', 1
)
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);

-- Postulaciones Normalizadas con Estados Relacionales
INSERT INTO `tabla_postulaciones` (
  `id_postulacion`, `id_evento`, `id_usuario`, `tipo_postulacion`, `id_estado_postulacion`,
  `estado_postulacion`, `fecha_postulacion`, `fecha_aprobacion`, `asistencia_confirmada`, `horas_acreditadas`, `observaciones`
) VALUES
(1, 1, 2, 'voluntario', 2, 'aprobado', '2026-07-01 10:00:00', '2026-07-02 14:00:00', 1, 4.00, 'Voluntario con experiencia en clasificación logística'),
(2, 1, 4, 'beneficiario', 2, 'aprobado', '2026-07-01 11:30:00', '2026-07-02 14:15:00', 1, 0.00, 'Beneficiario con núcleo de 4 personas registrado'),
(3, 3, 2, 'voluntario', 2, 'aprobado', '2026-07-05 09:15:00', '2026-07-06 11:00:00', 0, 0.00, 'Inscrito para equipo de siembra matutina'),
(4, 2, 3, 'voluntario', 1, 'pendiente', '2026-07-08 16:20:00', NULL, 0, 0.00, 'Postulación para pedagogía y refuerzo de lectura')
ON DUPLICATE KEY UPDATE `estado_postulacion`=VALUES(`estado_postulacion`);

-- Seguimiento
INSERT INTO `seguimiento_eventos` (`id_seguimiento`, `evento_id`, `usuario_id`) VALUES
(1, 1, 2),
(2, 1, 4)
ON DUPLICATE KEY UPDATE `fecha`=CURRENT_TIMESTAMP;
