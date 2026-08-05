/* ************************************************************************************* */
/* ---------------------------------------- DML ---------------------------------------- */
/* ---------------------------- DATA MANIPULATION LANGUAGE ----------------------------- */
/* ------------------------- LENGUAJE DE MANIPULACIÓN DE DATOS ------------------------- */
/* ------------------------------------- UNA TABLA ------------------------------------- */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
/* ------------------------------------------------------------------------------------- */
/* 1. CONSULTAS DE ACCIÓN [Inicio] : . INSERT INTO, UPDATE, DELETE                       */
/* 1.1. Crear o Registrar : .......... INSERT INTO __ VALUES ( __ , __ )                 */
/* 1.1.1. Datos Correctos : .......... INSERT INTO __ VALUES ( __ , __ )                 */
/* ------------------------------------------------------------------------------------- */
/* BIBLIOGRAFÍA                                                                          */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
/* EN CONSOLA: XAMPP / SHELL / cd mysql/bin / mysql -h localhost -u root -p / ENTER      */
/* ************************************************************************************* */


/* ************************************************************************************* */
/* -------------------------- 1. CONSULTAS DE ACCIÓN [Inicio] -------------------------- */
/* ---------------------------- INSERT INTO, UPDATE, DELETE ---------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- 1.1. Crear o Registrar. ------------------------------------------------------------- --
--      INSERT INTO __ VALUES ( __ , __ ) : -------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 1.1.1. Datos Correctos -------------------------------------------------------------- --
--        INSERT INTO __ VALUES ( __ , __ ) : ------------------------------------------ --
-- ------------------------------------------------------------------------------------- --
-- 11. Datos Semilla Iniciales
-- Categorías iniciales
INSERT INTO categorias (id_categoria, nombre, descripcion, estado) VALUES
(1, 'Alimentos', 'Donaciones de alimentos', 1),
(2, 'Educación', 'Apoyo educativo', 1),
(3, 'Salud', 'Campañas de salud', 1),
(4, 'Medio Ambiente', 'Reforestación de zonas verdes', 1),
(5, 'Económico', 'Aportaciones monetarias', 1);

-- Usuarios iniciales
-- Contraseña encriptada para 'Admin123*'
INSERT INTO usuarios (id_usuario, rol, nombre1, nombre2, apellido1, apellido2, telefono, correo, password, estado) VALUES
(1, 'Admin', 'Administrador', 'General', 'General', NULL, '+57 300 123 4567', 'admin@giveandgo.com', '$2b$10$tZ9C.mJjXNco/e.e2jV9SeAAL68L16S78A9oGv2o62H9R1pW61qE.', 1),
(999, 'Voluntario', 'Donante', NULL, 'Anónimo', NULL, NULL, 'anonimo@giveandgo.com', 'none', 1),
-- Contraseña encriptada para 'User123*'
(2, 'Voluntario', 'Carlos', 'Andrés', 'Mendoza', 'Castro', '+57 310 987 6543', 'carlos@volunteer.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1),
(3, 'Voluntario', 'Sofía', NULL, 'Pérez', NULL, '+57 315 222 3333', 'sofia@volunteer.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1),
(4, 'Beneficiario', 'Juan', NULL, 'Gómez', NULL, '+57 320 444 5555', 'juan@beneficiary.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1),
(5, 'Beneficiario', 'María', NULL, 'Rodríguez', NULL, '+57 301 555 6666', 'maria@beneficiary.com', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1);

-- Organizaciones iniciales
-- Vinculamos también a la tabla 'usuarios' para su login centralizado
INSERT INTO usuarios (id_usuario, rol, nombre1, nombre2, apellido1, apellido2, telefono, correo, password, estado) VALUES
(101, 'Organizacion', 'Fundación Manos por Kennedy', NULL, 'Organización', NULL, '+57 300 000 0000', 'contacto@manosporkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1),
(102, 'Organizacion', 'Fundación Bogotá Solidaria', NULL, 'Organización', NULL, '+57 300 000 0000', 'info@bogotasolidaria.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1),
(103, 'Organizacion', 'Asociación Social Ciudad Kennedy', NULL, 'Organización', NULL, '+57 300 000 0000', 'hola@ciudadkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 1);

INSERT INTO organizaciones (id_organizacion, nombre, direccion, telefono, correo, password, descripcion, estado) VALUES
(1, 'Fundación Manos por Kennedy', 'Calle 38 Sur # 78-45, Kennedy Central, Bogotá D.C.', '+57 300 000 0000', 'contacto@manosporkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 'Institución comunitaria enfocada en brindar seguridad alimentaria en Kennedy.', 1),
(2, 'Fundación Bogotá Solidaria', 'Carrera 80 # 40B Sur-12, Castilla, Bogotá D.C.', '+57 300 000 0000', 'info@bogotasolidaria.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 'Fundación sin ánimo de lucro enfocada en desarrollo y asistencia a adultos mayores.', 1),
(3, 'Asociación Social Ciudad Kennedy', 'Avenida Ciudad de Cali # 13-08, Patio Bonito, Bogotá D.C.', '+57 300 000 0000', 'hola@ciudadkennedy.org', '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.', 'Organización para la recuperación ambiental y el apoyo pedagógico.', 1);

-- Eventos iniciales
INSERT INTO eventos (id_evento, nombre, id_categoria, descripcion, direccion, fecha, cupo, estado, organizacion_id) VALUES
(1, 'Jornada de Donación en Kennedy Central', 1, 'Ayúdanos a clasificar y empaquetar alimentos recibidos para las familias vulnerables de la localidad de Kennedy en nuestro centro comunitario.', 'Calle 38 Sur # 78-45, Kennedy Central', '2026-07-15 09:00:00', 50, 1, 1),
(2, 'Campaña Solidaria Patio Bonito', 2, 'Buscamos voluntarios para apoyar en el reforzamiento escolar y tutorías los fines de semana para niños del sector de Patio Bonito.', 'Avenida Ciudad de Cali # 13-08', '2026-07-20 08:00:00', 20, 1, 1),
(3, 'Reforestación del Humedal El Burro', 4, 'Jornada de siembra de especies nativas y limpieza en el Humedal El Burro de Kennedy. ¡Trae ropa cómoda y guantes!', 'Calle 8A con Carrera 82, Humedal El Burro', '2026-08-05 07:00:00', 100, 1, 3),
(4, 'Jornada Comunitaria Castilla', 3, 'Campaña de salud básica preventiva y entrega de kits de aseo para adultos mayores del barrio Castilla.', 'Carrera 80 # 40B Sur-12, Castilla', '2026-06-30 09:00:00', 30, 1, 2);

-- Solicitudes iniciales
INSERT INTO solicitudes (id_solicitud, usuario_id, titulo, descripcion, estado) VALUES
(1, 4, 'Apoyo alimentario en Patio Bonito', 'Solicito mercado básico no perecedero para mi núcleo familiar de 4 personas en el barrio Patio Bonito, Kennedy.', 'Pendiente'),
(2, 5, 'Útiles escolares en Castilla', 'Necesito cuadernos, lápices y útiles escolares para mis dos hijos de primaria en Castilla.', 'Aprobada'),
(3, 4, 'Kit de medicamentos esenciales', 'Solicitud de apoyo para adquirir medicamentos de control diario para un adulto mayor en el barrio Kennedy Central.', 'Rechazada');

-- Donación 1
INSERT INTO donaciones (id_donacion, categoria, tipo, usuario_id, organizacion_id, estado, observaciones) VALUES
(1, 'Económico', 'Monetaria', 2, 1, 1, 'Donación para la compra de suministros alimentarios.');
INSERT INTO donaciones_monetarias (id, metodo, cuenta, valor, donacion_id) VALUES
(1, 'tarjeta', '**** **** **** 4321', 150000.00, 1);

-- Donación 2
INSERT INTO donaciones (id_donacion, categoria, tipo, usuario_id, organizacion_id, estado, observaciones) VALUES
(2, 'Alimentos', 'Objeto', 3, 2, 1, 'Aporte en especie para el asilo de Castilla.');
INSERT INTO donaciones_objetos (id, categoria, descripcion, cantidad, donacion_id) VALUES
(1, 'Alimentos', '10 kg de arroz, 5 kg de legumbres y aceite vegetal', 15, 2);

-- Auditorías iniciales
INSERT INTO auditorias (fecha, accion, id_usuario, nombre_usuario, rol_usuario) VALUES
('2026-07-16T10:00:00.000Z', 'Inicio de sesión exitoso del Administrador', 1, 'Administrador General', 'Admin'),
('2026-07-16T11:15:00.000Z', 'Creación de convocatoria exitosa: Reforestación del Humedal El Burro', 1, 'Administrador General', 'Admin'),
('2026-07-16T12:30:00.000Z', 'Inscripción de voluntario en el evento de Reforestación', 2, 'Carlos Mendoza', 'Voluntario'),
('2026-07-16T13:45:00.000Z', 'Registro de nueva donación monetaria', 2, 'Carlos Mendoza', 'Voluntario');
