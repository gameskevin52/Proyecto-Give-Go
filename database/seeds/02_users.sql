-- ===================================================
-- GIVE&GO DATABASE SEED: USUARIOS INICIALES NORMALIZADOS
-- Nota: Contraseñas encriptadas con bcrypt salt rounds = 10
-- Admin: 'Admin123*'
-- Voluntarios y Beneficiarios: 'User123*'
-- No se solicitan documentos personales ni redes sociales a personas.
-- ===================================================

USE `giveandgo_v2`;

INSERT INTO `usuarios` (
  `id_usuario`, `id_rol`, `rol`, `nombre1`, `nombre2`, `apellido1`, `apellido2`,
  `fecha_nacimiento`, `telefono`, `correo`, `password`,
  `id_barrio`, `direccion`, `barrio`, `foto`, `biografia`, `estado`
) VALUES
(1, 1, 'Admin', 'Administrador', 'General', 'General', NULL, '1985-05-12', '+57 300 123 4567', 'admin@giveandgo.com', '$2b$10$tZ9C.mJjXNco/e.e2jV9SeAAL68L16S78A9oGv2o62H9R1pW61qE.', 1, 'Calle 38 Sur # 78-45', 'Kennedy Central', NULL, 'Administrador general de la plataforma comunitaria.', 1),
(999, 2, 'Voluntario', 'Donante', NULL, 'Anónimo', NULL, '1990-01-01', NULL, 'anonimo@giveandgo.com', 'none', 1, 'Calle 38 Sur # 78-45', 'Kennedy Central', NULL, 'Perfil genérico para donaciones anónimas.', 1),
(2, 2, 'Voluntario', 'Carlos', 'Andrés', 'Mendoza', 'Castro', '1995-08-20', '+57 310 987 6543', 'carlos@volunteer.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 2, 'Carrera 80 # 40B Sur-12', 'Castilla', NULL, 'Voluntario apasionado por el trabajo social y pedagógico.', 1),
(3, 2, 'Voluntario', 'Sofía', NULL, 'Pérez', NULL, '1998-11-15', '+57 315 222 3333', 'sofia@volunteer.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 4, 'Avenida Las Américas # 86-20', 'El Tintal', NULL, 'Estudiante de trabajo social comprometida con Kennedy.', 1),
(4, 3, 'Beneficiario', 'Juan', NULL, 'Gómez', NULL, '1982-03-10', '+57 320 444 5555', 'juan@beneficiary.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 3, 'Carrera 86 # 38 Sur-25', 'Patio Bonito', NULL, 'Padre de familia residente en Patio Bonito.', 1),
(5, 3, 'Beneficiario', 'María', NULL, 'Rodríguez', NULL, '1979-09-24', '+57 301 555 6666', 'maria@beneficiary.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 2, 'Calle 8A con Carrera 82', 'Castilla', NULL, 'Madre comunitaria residente en Castilla.', 1),
(101, 4, 'Organizacion', 'Fundación Manos por Kennedy', NULL, 'Organización', NULL, NULL, '+57 300 000 0000', 'contacto@manosporkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1, 'Calle 38 Sur # 78-45', 'Kennedy Central', NULL, 'Cuenta puente de la fundación.', 1),
(102, 4, 'Organizacion', 'Fundación Bogotá Solidaria', NULL, 'Organización', NULL, NULL, '+57 300 000 0000', 'info@bogotasolidaria.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 2, 'Carrera 80 # 40B Sur-12', 'Castilla', NULL, 'Cuenta puente de la fundación.', 1),
(103, 4, 'Organizacion', 'Asociación Social Ciudad Kennedy', NULL, 'Organización', NULL, NULL, '+57 300 000 0000', 'hola@ciudadkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 3, 'Avenida Ciudad de Cali # 13-08', 'Patio Bonito', NULL, 'Cuenta puente de la fundación.', 1)
ON DUPLICATE KEY UPDATE `correo`=VALUES(`correo`);

-- Subtipo Perfil Voluntario
INSERT INTO `perfiles_voluntarios` (`usuario_id`, `habilidades`, `intereses`, `disponibilidad`, `horas_acumuladas`, `eventos_asistidos`) VALUES
(2, 'Primeros auxilios, logística, pedagogía básica', 'Seguridad alimentaria, reforestación', 'Fines de semana mañanas', 36.50, 6),
(3, 'Tutoría infantil, arte, organización de eventos', 'Educación comunitaria, infancia', 'Tardes entre semana', 18.00, 3)
ON DUPLICATE KEY UPDATE `horas_acumuladas`=VALUES(`horas_acumuladas`);

-- Subtipo Perfil Beneficiario
INSERT INTO `perfiles_beneficiarios` (`usuario_id`, `condicion_especial`, `personas_a_cargo`, `necesidades_urgentes`, `prioridad`) VALUES
(4, 'Madre/Padre cabeza de hogar', 4, 'Mercado no perecedero, pañales y útiles de aseo', 'alta'),
(5, 'Adulto mayor sin pensión', 2, 'Medicamentos hipertensión, ropa abrigada y alimentos', 'alta')
ON DUPLICATE KEY UPDATE `personas_a_cargo`=VALUES(`personas_a_cargo`);
