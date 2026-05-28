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
('Admin', 'Edier', 'Alberto', 'Gomez', 'Perez', '3101234567', 'edier.gomez@email.com', '$2y$10$e0myZ4Q./80t515/e8W2OO5x01rO'),
('Admin', 'Ana', NULL, 'Martinez', 'Rodriguez', '3159876543', 'ana.martinez@email.com', '$2y$10$k1mzX4Q./90t616/f9W3PP6y12sP'),
('Voluntario', 'Juan', 'David', 'Castro', NULL, '3204567890', 'juan.castro@email.com', '$2y$10$r2nzY5R./01u717/g0X4QQ7z23tQ'),
('Beneficiario', 'Maria', 'Fernanda', 'Lopez', 'Silva', '3007654321', 'maria.lopez@email.com', '$2y$10$s3ozZ6S./12v818/h1Y5RR8a34uR'),
('Voluntario', 'Luis', NULL, 'Mejia', 'Torres', '3123456789', 'luis.mejia@email.com', '$2y$10$t4paA7T./23w919/i2Z6SS9b45vS');

-- Inserción en Organizaciones
INSERT INTO Organizaciones (nombre_organizaciones, direccion_organizaciones, correo_organizaciones, password_organizaciones) VALUES 
('Fundación Manos Abiertas', 'Calle 45 # 12-34, Bogotá', 'contacto@manosabiertas.org', '$2y$10$e0myZ4Q./80t515/e8W2OO5x01rO'),
('EcoPlaneta Verde', 'Avenida Siempre Viva 742', 'info@ecoplaneta.org', '$2y$10$k1mzX4Q./90t616/f9W3PP6y12sP'),
('Banco de Alimentos Solidario', 'Carrera 10 # 5-67, Medellín', 'donaciones@bancosolidario.org', '$2y$10$r2nzY5R./01u717/g0X4QQ7z23tQ'),
('Asociación Tejiendo Futuro', 'Diagonal 23 # 45-10, Cali', 'proyectos@tejiendofuturo.org', '$2y$10$s3ozZ6S./12v818/h1Y5RR8a34uR'),
('Red de Apoyo Infantil', 'Calle de la Amargura 123, Cartagena', 'auxilio@redinfantil.org', '$2y$10$t4paA7T./23w919/i2Z6SS9b45vS');

-- Inserción en Eventos
INSERT INTO Eventos (nombre_eventos, categoria_eventos, descripcion_eventos, fecha_evento, estado_evento, id_Organizaciones) VALUES 
('Colecta Navideña', 'Solidaridad', 'Entrega de regalos a niños', '2026-12-24 10:00:00', 1, 1),
('Siembra de Árboles', 'Ecológico', 'Reforestación del bosque', '2026-06-15 08:00:00', 1, 2),
('Comedor Comunitario', 'Alimentos', 'Almuerzos para habitantes de calle', '2026-05-20 12:00:00', 0, 3),
('Taller de Lectura', 'Educación', 'Clases de lectoescritura', '2026-07-10 14:00:00', 1, 4),
('Brigada de Salud', 'Salud', 'Atención médica y medicinas', '2026-04-18 07:00:00', 0, 5);

-- Inserción en Donaciones
INSERT INTO Donaciones (categoria_donaciones, tipo_donaciones, fecha_donacion, id_Organizaciones, id_Usuarios) VALUES 
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