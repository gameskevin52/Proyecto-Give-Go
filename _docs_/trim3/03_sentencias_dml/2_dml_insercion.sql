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
INSERT INTO USUARIOS VALUES 
(NULL,'Admin', 'Edier', 'Alberto', 'Gomez', 'Perez', '3101234567', 'edier.gomez@email.com', '$2y$10$e0myZ4Q./80t515/e8W2OO5x01rO'),
(NULL,'Admin', 'Ana', NULL, 'Martinez', 'Rodriguez', '3159876543', 'ana.martinez@email.com', '$2y$10$k1mzX4Q./90t616/f9W3PP6y12sP'),
(NULL,'Voluntario', 'Juan', 'David', 'Castro', NULL, '3204567890', 'juan.castro@email.com', '$2y$10$r2nzY5R./01u717/g0X4QQ7z23tQ'),
(NULL,'Beneficiario', 'Maria', 'Fernanda', 'Lopez', 'Silva', '3007654321', 'maria.lopez@email.com', '$2y$10$s3ozZ6S./12v818/h1Y5RR8a34uR'),
(NULL,'Voluntario', 'Luis', NULL, 'Mejia', 'Torres', '3123456789', 'luis.mejia@email.com', '$2y$10$t4paA7T./23w919/i2Z6SS9b45vS'),


INSERT INTO ORGANIZACIONES VALUES
(NULL, 'Fundación Manos Abiertas', 'Calle 45 # 12-34, Bogotá', 'contacto@manosabiertas.org', '$2y$10$e0myZ4Q./80t515/e8W2OO5x01rO'),
(NULL, 'EcoPlaneta Verde', 'Avenida Siempre Viva 742', 'info@ecoplaneta.org', '$2y$10$k1mzX4Q./90t616/f9W3PP6y12sP'),
(NULL, 'Banco de Alimentos Solidario', 'Carrera 10 # 5-67, Medellín', 'donaciones@bancosolidario.org', '$2y$10$r2nzY5R./01u717/g0X4QQ7z23tQ'),
(NULL, 'Asociación Tejiendo Futuro', 'Diagonal 23 # 45-10, Cali', 'proyectos@tejiendofuturo.org', '$2y$10$s3ozZ6S./12v818/h1Y5RR8a34uR'),
(NULL, 'Red de Apoyo Infantil', 'Calle de la Amargura 123, Cartagena', 'auxilio@redinfantil.org', '$2y$10$t4paA7T./23w919/i2Z6SS9b45vS');


INSERT INTO Eventos VALUES
(NULL, 'Colecta Navideña', 'Solidaridad', 'Entrega de regalos a niños de bajos recursos', '2026-12-24 10:00:00', 1, 1),
(NULL, 'Siembra de Árboles', 'Ecológico', 'Reforestación del bosque local', '2026-06-15 08:00:00', 1, 2),
(NULL, 'Comedor Comunitario', 'Alimentos', 'Jornada de almuerzos para habitantes de calle', '2026-05-20 12:00:00', 0, 3),
(NULL, 'Taller de Lectura', 'Educación', 'Clases de lectoescritura para adultos', '2026-07-10 14:00:00', 1, 4),
(NULL, 'Brigada de Salud', 'Salud', 'Atención médica y entrega de medicinas', '2026-04-18 07:00:00', 0, 5);


INSERT INTO Donaciones VALUES
(NULL, 'Económico', 'Monetario', '2026-05-24 15:30:00', 1, 3),
(NULL, 'Económico', 'Monetario', '2026-05-25 09:15:00', 3, 4),
(NULL, 'Bienes', 'Objetos', '2026-05-22 11:00:00', 2, 6),
(NULL, 'Bienes', 'Objetos', '2026-05-23 16:45:00', 5, 7);


INSERT INTO Monetarios VALUES
(NULL, 'Transferencia Bancaria', 'Ahorros-456789123', 150000.00, 1),
(NULL, 'Tarjeta de Crédito', 'Visa-****-8821', 500000.00, 2);


INSERT INTO Objetos VALUES
(NULL, 'Medio Ambiente', 'Herramientas de jardinería y palas para la siembra', '15 kits', 3),
(NULL, 'Salud', 'Cajas de tapabocas, alcohol antiséptico y gasas', '50 cajas', 4);


INSERT INTO Seguimiento_Eventos (id_Eventos, id_Usuarios) VALUES
(1, 3), -- Juan Castro (Voluntario) se unió a Colecta Navideña
(1, 4), -- Maria Lopez (Voluntario) se unió a Colecta Navideña
(2, 5), -- Luis Mejia (Voluntario) se unió a Siembra de Árboles
(3, 6), -- Diana Ramirez (Beneficiario) asistió al Comedor Comunitario
(5, 7); -- Jorge Hernandez (Beneficiario) asistió a la Brigada de Salud


/* ************************************************************************************* */
/* ------------------------------------------------------------------------------------- */
/* ----------------------------------- BIBLIOGRAFÍA ------------------------------------ */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- Tutoriales de Programación ya. (s.f.). MySQL ya. Recuperado el 15 de Mayo de 2022,    --
--      de https://www.tutorialesprogramacionya.com/mysqlya/                             --
-- ------------------------------------------------------------------------------------- --
-- Pildoras Informáticas. (16 de Julio de 2015). Curso SQL.                              --
--      Recuperado el 16 de Abril de 2022, de [Archivo de Vídeo]                         --
--      https://www.youtube.com/playlist?list=PLU8oAlHdN5Bmx-LChV4K3MbHrpZKefNwn         --
--      página web                                                                       --
-- ------------------------------------------------------------------------------------- --