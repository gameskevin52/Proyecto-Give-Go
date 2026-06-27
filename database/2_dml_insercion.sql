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
INSERT INTO Usuarios (roles, nombre1_usuario, nombre2_usuario, apellido1_usuario, apellido2_usuario, telefono_usuario, correo_usuario, password_usuario) VALUES 
('Admin', 'Edier', 'Alberto', 'Gomez', 'Perez', '3101234567', 'admin1@email.com', '12345'),
('Admin', 'Ana', NULL, 'Martinez', 'Rodriguez', '3159876543', 'admin2@email.com', '12345'),
('Voluntario', 'Juan', 'David', 'Castro', NULL, '3204567890', 'voluntario1@email.com', '12345'),
('Beneficiario', 'Maria', 'Fernanda', 'Lopez', 'Silva', '3007654321', 'beneficiario1@email.com', '12345'),
('Voluntario', 'Luis', NULL, 'Mejia', 'Torres', '3123456789', 'voluntario2@email.com', '12345');

-- Inserción en Organizaciones
INSERT INTO Organizaciones (nombre_organizaciones, direccion_organizaciones, correo_organizaciones, password_organizaciones) VALUES 
('Fundación Manos Abiertas', 'Calle 45 # 12-34, Bogotá', 'organizacion1@gmail.com', '12345'),
('EcoPlaneta Verde', 'Avenida Siempre Viva 742', 'organizacion2@gmail.com', '12345'),
('Banco de Alimentos Solidario', 'Carrera 10 # 5-67, Medellín', 'organizacion3@gmail.com', '12345'),
('Asociación Tejiendo Futuro', 'Diagonal 23 # 45-10, Cali', 'organizacion4@gmail.com', '12345'),
('Red de Apoyo Infantil', 'Calle de la Amargura 123, Cartagena', 'organizacion5@gmail.com', '12345');

-- Inserción en Eventos
INSERT INTO Eventos (nombre_eventos, categoria_eventos, descripcion_eventos, fecha_evento, estado_evento, id_organizaciones) VALUES 
('Colecta Navideña', 'Solidaridad', 'Entrega de regalos a niños', '2026-12-24 10:00:00', 1, 1),
('Siembra de Árboles', 'Ecológico', 'Reforestación del bosque', '2026-06-15 08:00:00', 1, 2),
('Comedor Comunitario', 'Alimentos', 'Almuerzos para habitantes de calle', '2026-05-20 12:00:00', 0, 3),
('Taller de Lectura', 'Educación', 'Clases de lectoescritura', '2026-07-10 14:00:00', 1, 4),
('Brigada de Salud', 'Salud', 'Atención médica y medicinas', '2026-04-18 07:00:00', 0, 5);

-- Inserción en Donaciones
INSERT INTO Donaciones (categoria_donaciones, tipo_donaciones, fecha_donacion, id_organizaciones, id_usuarios) VALUES 
('Económico', 'Monetario', '2026-05-24 15:30:00', 1, 1),
('Económico', 'Monetario', '2026-05-25 09:15:00', 2, 3),
('Bienes', 'Objetos', '2026-05-22 11:00:00', 1, 2),
('Bienes', 'Objetos', '2026-05-23 16:45:00', 3, 5);

-- Inserción en Monetarios
INSERT INTO Monetarios (tipo_metodo, num_cuenta, valor_total, id_Donaciones) VALUES 
('Transferencia Bancaria', 'Ahorros-456789123', 150000.00, 1),
('Tarjeta de Crédito', 'Visa-****-8821', 500000.00, 2);

-- Inserción en Objetos
INSERT INTO Objetos (categoria_objeto, descripcion_de_evento, cantidad_total, id_Donaciones) VALUES 
('Medio Ambiente', 'Herramientas de jardinería y palas para la siembra', '15 kits', 3),
('Salud', 'Cajas de tapabocas, alcohol antiséptico y gasas', '50 cajas', 4);

-- Inserción en Seguimiento_Eventos (Usuarios inscritos a eventos)
INSERT INTO Seguimiento_Eventos (id_evento, id_usuario) VALUES 
(1, 3),  -- Juan Castro se unió a Colecta Navideña
(1, 4),  -- Maria Lopez se unió a Colecta Navideña
(2, 5),  -- Luis Mejia se unió a Siembra de Árboles
(3, 4),  -- Maria Lopez asistió al Comedor Comunitario
(5, 5);  -- Luis Mejia asistió a la Brigada de Salud