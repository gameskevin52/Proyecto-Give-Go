-- =========================================================================
-- GIVE&GO DATABASE SEEDS: CONSOLIDATED INITIAL DATA (v3.1 - LOCALIDAD KENNEDY)
-- Ordenado estrictamente respetando restricciones FK y Formas Normales
-- =========================================================================

USE `giveandgo_v2`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Catálogos Base
INSERT INTO `roles` (`id_rol`, `codigo`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'Admin', 'Administrador', 'Control total de la plataforma y auditoría', 1),
(2, 'Voluntario', 'Voluntario', 'Participante comunitario en causas y donante', 1),
(3, 'Beneficiario', 'Beneficiario', 'Receptor de asistencia social y ayudas', 1),
(4, 'Organizacion', 'Organización', 'Fundación o entidad gestora de causas', 1)
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);

INSERT INTO `metodos_pago` (`id_metodo_pago`, `codigo`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'tarjeta', 'Tarjeta de Crédito/Débito', 'Pasarela electrónica PSE/Visa/MasterCard', 1),
(2, 'nequi', 'Nequi', 'Billetera digital Bancolombia', 1),
(3, 'daviplata', 'Daviplata', 'Billetera digital Davivienda', 1),
(4, 'transferencia', 'Transferencia Bancaria', 'Cuenta corriente o ahorros empresarial', 1),
(5, 'efectivo', 'Efectivo / Punto Físico', 'Entrega directa en la sede de la entidad', 1)
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);

INSERT INTO `estados_postulacion` (`id_estado_postulacion`, `codigo`, `nombre`, `descripcion`) VALUES
(1, 'pendiente', 'Pendiente de Revisión', 'Solicitud recibida pendiente de evaluación por la organización'),
(2, 'aprobado', 'Aprobado', 'El aspirante ha sido admitido para el evento'),
(3, 'rechazado', 'Rechazado', 'La postulación no cumplió los requisitos o se llenó el cupo'),
(4, 'confirmado', 'Asistencia Confirmada', 'El usuario ratificó su presencia en la jornada'),
(5, 'cancelado', 'Cancelado', 'El usuario o la organización retiraron la postulación')
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);

-- 2. Categorías Sociales
INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'Alimentos', 'Seguridad alimentaria, comedores comunitarios y paquetes nutricionales', 1),
(2, 'Educación', 'Tutorías escolares, alfabetización, talleres artísticos y recreativos', 1),
(3, 'Salud', 'Jornadas preventivas, salud integral, tamizajes y acompañamiento a adultos mayores', 1),
(4, 'Medio Ambiente', 'Recuperación de humedales, reforestación urbana, huertas y reciclaje', 1),
(5, 'Económico', 'Fondos rotatorios de emergencia solidaria comunitaria y apoyos directos', 1),
(6, 'Otros', 'Asistencia logística general y servicios para la comunidad', 1)
ON DUPLICATE KEY UPDATE `nombre`=VALUES(`nombre`);

-- 3. Barrios de la Localidad de Kennedy (3FN)
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

-- 4. Direcciones Georreferenciadas de Kennedy
INSERT INTO `direcciones` (`id_direccion`, `id_barrio`, `direccion_linea`, `punto_referencia`, `latitud`, `longitud`) VALUES
(1, 1, 'Calle 38 Sur # 78-45', 'Frente al Parque Central de Kennedy', 4.61900000, -74.15200000),
(2, 2, 'Carrera 80 # 40B Sur-12', 'Diagonal al Polideportivo Castilla', 4.63850000, -74.14800000),
(3, 3, 'Avenida Ciudad de Cali # 13-08', 'Estación TM Patio Bonito', 4.62800000, -74.16800000),
(4, 4, 'Avenida Las Américas # 86-20', 'Biblioteca Pública El Tintal', 4.63100000, -74.15800000)
ON DUPLICATE KEY UPDATE `direccion_linea`=VALUES(`direccion_linea`);

-- 5. Usuarios Base (Sin documentos personales)
INSERT INTO `usuarios` (
  `id_usuario`, `id_rol`, `rol`, `nombre1`, `nombre2`, `apellido1`, `apellido2`,
  `fecha_nacimiento`, `telefono`, `correo`, `password`,
  `id_barrio`, `direccion`, `barrio`, `foto`, `biografia`, `estado`
) VALUES
(1, 1, 'Admin', 'Administrador', 'General', 'General', NULL, '1985-05-12', '+57 300 123 4567', 'admin@giveandgo.com', '$2b$10$tZ9C.mJjXNco/e.e2jV9SeAAL68L16S78A9oGv2o62H9R1pW61qE.', 1, 'Calle 38 Sur # 78-45', 'Kennedy Central', NULL, 'Administrador general de la plataforma comunitaria.', 1),
(999, 2, 'Voluntario', 'Donante', NULL, 'Anónimo', NULL, '1990-01-01', NULL, 'anonimo@giveandgo.com', 'none', 1, 'Calle 38 Sur # 78-45', 'Kennedy Central', NULL, 'Perfil genérico para donaciones anónimas.', 1),
(2, 2, 'Voluntario', 'Carlos', 'Andrés', 'Mendoza', 'Castro', '1995-08-20', '+57 310 987 6543', 'carlos@volunteer.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 2, 'Carrera 80 # 40B Sur-12', 'Castilla', NULL, 'Voluntario con vocación social en Kennedy.', 1),
(3, 2, 'Voluntario', 'Sofía', NULL, 'Pérez', NULL, '1998-11-15', '+57 315 222 3333', 'sofia@volunteer.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 4, 'Avenida Las Américas # 86-20', 'El Tintal', NULL, 'Líder juvenil comunitaria en El Tintal.', 1),
(4, 3, 'Beneficiario', 'Juan', NULL, 'Gómez', NULL, '1982-03-10', '+57 320 444 5555', 'juan@beneficiary.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 3, 'Carrera 86 # 38 Sur-25', 'Patio Bonito', NULL, 'Padre de familia residente en Patio Bonito.', 1),
(5, 3, 'Beneficiario', 'María', NULL, 'Rodríguez', NULL, '1979-09-24', '+57 301 555 6666', 'maria@beneficiary.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 2, 'Calle 8A con Carrera 82', 'Castilla', NULL, 'Madre comunitaria en Castilla.', 1),
(101, 4, 'Organizacion', 'Fundación Manos por Kennedy', NULL, 'Organización', NULL, NULL, '+57 300 000 0000', 'contacto@manosporkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1, 'Calle 38 Sur # 78-45', 'Kennedy Central', NULL, 'Cuenta puente institucional.', 1),
(102, 4, 'Organizacion', 'Fundación Bogotá Solidaria', NULL, 'Organización', NULL, NULL, '+57 300 000 0000', 'info@bogotasolidaria.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 2, 'Carrera 80 # 40B Sur-12', 'Castilla', NULL, 'Cuenta puente institucional.', 1),
(103, 4, 'Organizacion', 'Asociación Social Ciudad Kennedy', NULL, 'Organización', NULL, NULL, '+57 300 000 0000', 'hola@ciudadkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 3, 'Avenida Ciudad de Cali # 13-08', 'Patio Bonito', NULL, 'Cuenta puente institucional.', 1)
ON DUPLICATE KEY UPDATE `correo`=VALUES(`correo`);

-- 6. Especialización de Perfiles (EER)
INSERT INTO `perfiles_voluntarios` (`usuario_id`, `habilidades`, `intereses`, `disponibilidad`, `horas_acumuladas`, `eventos_asistidos`) VALUES
(2, 'Primeros auxilios, logística, pedagogía básica', 'Seguridad alimentaria, reforestación', 'Fines de semana mañanas', 36.50, 6),
(3, 'Tutoría infantil, arte, organización de eventos', 'Educación comunitaria, infancia', 'Tardes entre semana', 18.00, 3)
ON DUPLICATE KEY UPDATE `horas_acumuladas`=VALUES(`horas_acumuladas`);

INSERT INTO `perfiles_beneficiarios` (`usuario_id`, `condicion_especial`, `personas_a_cargo`, `necesidades_urgentes`, `prioridad`) VALUES
(4, 'Madre/Padre cabeza de hogar', 4, 'Mercado no perecedero, pañales y útiles de aseo', 'alta'),
(5, 'Adulto mayor sin pensión', 2, 'Medicamentos hipertensión, ropa abrigada y alimentos', 'alta')
ON DUPLICATE KEY UPDATE `personas_a_cargo`=VALUES(`personas_a_cargo`);

-- 7. Organizaciones Comunitarias
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

-- 8. Redes Sociales de Organizaciones (1FN - Exclusivas para Organizaciones)
INSERT INTO `organizacion_redes_sociales` (`organizacion_id`, `plataforma`, `url_perfil`) VALUES
(1, 'facebook', 'https://facebook.com/manosporkennedy'),
(1, 'instagram', 'https://instagram.com/manosporkennedy'),
(2, 'facebook', 'https://facebook.com/bogotasolidaria'),
(3, 'twitter', 'https://twitter.com/ciudadkennedy_org')
ON DUPLICATE KEY UPDATE `url_perfil`=VALUES(`url_perfil`);

-- 9. Eventos Comunitarios
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

-- 10. Postulaciones a Eventos (2FN / BCNF)
INSERT INTO `tabla_postulaciones` (
  `id_postulacion`, `id_evento`, `id_usuario`, `tipo_postulacion`, `id_estado_postulacion`,
  `estado_postulacion`, `fecha_postulacion`, `fecha_aprobacion`, `asistencia_confirmada`, `horas_acreditadas`, `observaciones`
) VALUES
(1, 1, 2, 'voluntario', 2, 'aprobado', '2026-07-01 10:00:00', '2026-07-02 14:00:00', 1, 4.00, 'Voluntario con experiencia en clasificación logística'),
(2, 1, 4, 'beneficiario', 2, 'aprobado', '2026-07-01 11:30:00', '2026-07-02 14:15:00', 1, 0.00, 'Beneficiario con núcleo de 4 personas registrado'),
(3, 3, 2, 'voluntario', 2, 'aprobado', '2026-07-05 09:15:00', '2026-07-06 11:00:00', 0, 0.00, 'Inscrito para equipo de siembra matutina'),
(4, 2, 3, 'voluntario', 1, 'pendiente', '2026-07-08 16:20:00', NULL, 0, 0.00, 'Postulación para pedagogía y refuerzo de lectura')
ON DUPLICATE KEY UPDATE `estado_postulacion`=VALUES(`estado_postulacion`);

-- 11. Seguimiento de Eventos
INSERT INTO `seguimiento_eventos` (`id_seguimiento`, `evento_id`, `usuario_id`) VALUES
(1, 1, 2),
(2, 1, 4)
ON DUPLICATE KEY UPDATE `fecha`=CURRENT_TIMESTAMP;

-- 12. Solicitudes de Beneficiarios
INSERT INTO `solicitudes` (`id_solicitud`, `usuario_id`, `id_categoria`, `titulo`, `descripcion`, `estado`) VALUES
(1, 4, 1, 'Apoyo alimentario en Patio Bonito', 'Solicito mercado básico no perecedero para mi núcleo familiar de 4 personas en el barrio Patio Bonito, Kennedy.', 'Pendiente'),
(2, 5, 2, 'Útiles escolares en Castilla', 'Necesito cuadernos, lápices y útiles escolares para mis dos hijos de primaria en Castilla.', 'Aprobada'),
(3, 4, 3, 'Kit de medicamentos esenciales', 'Solicitud de apoyo para adquirir medicamentos de control diario para un adulto mayor en el barrio Kennedy Central.', 'Rechazada')
ON DUPLICATE KEY UPDATE `titulo`=VALUES(`titulo`);

-- 13. Donaciones
INSERT INTO `donaciones` (`id_donacion`, `id_categoria`, `categoria`, `tipo`, `usuario_id`, `organizacion_id`, `estado`, `observaciones`) VALUES
(1, 5, 'Económico', 'Monetaria', 2, 1, 1, 'Donación para la compra de suministros alimentarios y verduras frescas.'),
(2, 1, 'Alimentos', 'Objeto', 3, 2, 1, 'Aporte en especie para el centro de adultos mayores de Castilla.')
ON DUPLICATE KEY UPDATE `tipo`=VALUES(`tipo`);

INSERT INTO `donaciones_monetarias` (`id`, `donacion_id`, `id_metodo_pago`, `metodo`, `cuenta`, `referencia_transaccion`, `valor`) VALUES
(1, 1, 1, 'tarjeta', '**** **** **** 4321', 'TX-GIVE-2026-98124', 150000.00)
ON DUPLICATE KEY UPDATE `valor`=VALUES(`valor`);

INSERT INTO `donaciones_objetos` (`id`, `donacion_id`, `id_categoria`, `categoria`, `descripcion`, `cantidad`, `unidad_medida`, `estado_conservacion`) VALUES
(1, 2, 1, 'Alimentos', '10 kg de arroz Diana, 5 kg de lentejas y 3 botellas de aceite vegetal', 15, 'kg / botellas', 'no_perecedero')
ON DUPLICATE KEY UPDATE `cantidad`=VALUES(`cantidad`);

-- 14. Auditorías (3FN)
INSERT INTO `auditorias` (`id_usuario`, `accion`, `modulo_afectado`, `direccion_ip`, `detalles`, `nombre_usuario`, `rol_usuario`) VALUES
(1, 'Inicio de sesión exitoso del Administrador', 'autenticacion', '192.168.1.10', 'Acceso desde panel administrativo', 'Administrador General', 'Admin'),
(1, 'Creación de convocatoria comunitaria en Kennedy Central', 'eventos', '192.168.1.10', 'ID Evento: 1 - Jornada de Donación', 'Administrador General', 'Admin'),
(2, 'Inscripción confirmada como voluntario', 'postulaciones', '186.84.90.12', 'Evento: Reforestación Humedal El Burro', 'Carlos Andrés Mendoza', 'Voluntario'),
(2, 'Donación monetaria procesada exitosamente', 'donaciones', '186.84.90.12', 'Monto: $150,000 COP via Pasarela', 'Carlos Andrés Mendoza', 'Voluntario');

-- 15. Solicitudes de Verificación y Documentos (Solo Organizaciones)
INSERT INTO `solicitudes_verificacion` (
  `id_solicitud`, `organizacion_id`, `mensaje`, `estado`, `respuesta_admin`, `admin_revisor_id`, `fecha_solicitud`, `fecha_respuesta`,
  `nombre_organizacion`, `correo_organizacion`, `nit`, `documentos`
) VALUES
(
  1, 1, 'Adjunto el RUT 2026 y la certificación de existencia de la Cámara de Comercio de Bogotá para certificar a Fundación Manos por Kennedy.',
  'aprobada', 'Documentación legal verificada exitosamente. Entidad certificada.', 1, '2026-06-01 10:00:00', '2026-06-02 15:30:00',
  'Fundación Manos por Kennedy', 'contacto@manosporkennedy.org', '901.456.789-1', 'RUT_2026.pdf, CamaraComercio_Bogota.pdf'
),
(
  2, 3, 'Presentamos documentos probatorios para verificación de la Asociación Social Ciudad Kennedy.',
  'pendiente', NULL, NULL, '2026-07-10 14:20:00', NULL,
  'Asociación Social Ciudad Kennedy', 'hola@ciudadkennedy.org', '901.112.334-5', 'RUT_Asociacion.pdf'
)
ON DUPLICATE KEY UPDATE `estado`=VALUES(`estado`);

-- Documentos de Verificación de Organizaciones (1FN)
INSERT INTO `documentos_verificacion` (`id_documento`, `solicitud_id`, `tipo_documento`, `nombre_archivo`, `url_archivo`) VALUES
(1, 1, 'rut', 'RUT_2026_ManosPorKennedy.pdf', 'https://storage.giveandgo.org/docs/rut_manos_2026.pdf'),
(2, 1, 'camara_comercio', 'Certificado_CamaraComercio_2026.pdf', 'https://storage.giveandgo.org/docs/camara_comercio_manos.pdf'),
(3, 2, 'rut', 'RUT_CiudadKennedy.pdf', 'https://storage.giveandgo.org/docs/rut_ciudad_kennedy.pdf')
ON DUPLICATE KEY UPDATE `nombre_archivo`=VALUES(`nombre_archivo`);

SET FOREIGN_KEY_CHECKS = 1;
