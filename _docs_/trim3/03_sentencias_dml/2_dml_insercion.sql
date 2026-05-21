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

INSERT INTO ORGANIZACIONES VALUES
(null,'Fundacion Esperanza', 'Social', 'Bogotá','fundacion@esperanza.org', sha1('clave123')),
(null,'Ayuda Comunitaria', 'Comunidad', 'Bogotá', 'ayuda@comunitaria.org', sha1('segura456')),
(null,'Salud para Todos', 'Salud', 'Bogotá', 'salud@para todos.org', sha1('salud789')),
(null,'Educacion Futuro', 'Educacion', 'Bogotá', 'educacion@futuro.org', sha1('edu321')),
(null,'Manos Solidarias', 'Humanitaria', 'Bogotá', 'manos@solidarias.org', sha1('mano654'));

INSERT INTO USUARIOS VALUES
(null,'Nicolay Diagelo','Cajamarca','Bogotá','371637224',2, 'nicolay@esperanza.org', sha1('nico123'), 2),
(null,'Zharick Sofia','Rodriguez Gutierres','Pereira','30294395',3, 'zharick@comunitaria.org', sha1('zharick123'), 4),
(null,'Kevin ','Hernandez Guzman','Medellin','3480902',2, 'kevin@para todos.org', sha1('kevin123'), 3),
(null,'Maria Alejandra ','Quiñones','Cartagena','3372883',3, 'maria@futuro.org', sha1('maria123'), 4),
(null,'Mateito ','Moreno Lopez','Bogotá','302897388',3, 'mateito@solidarias.org', sha1('mateito123'), 5),
(null,'Alexander ','Toro',' Pereira','3257894156',3, 'alexander@esperanza.org', sha1('alex123'), 1);

INSERT INTO MENSAJES VALUES 
(null, 'Alerta', '2026-03-01', 'Mantenimiento', 'Sistema en mantenimiento', 'Activa', 2, 1),
(null, 'Aviso', '2026-03-02', 'Actualizacion', 'Nueva version disponible', 'Activa', 3, 1),
(null, 'Recordatorio', '2026-03-03', 'Pago', 'Recordatorio de pago', 'Pendiente', 4, 2),
(null, 'Alerta', '2026-03-04', 'Seguridad', 'Cambio de contraseña', 'Activa', 5, 2),
(null, 'Informativo', '2026-03-05', 'Evento', 'Invitacion a evento', 'Enviada', 4, 3);

INSERT INTO DONACIONES VALUES
(null, 'Donacion Escolar', 'Educacion', 'Monetaria', 'Tarjeta', '50000', '2024-01-15', 'completada', 1, 1),
(null, 'Ayuda Alimentaria', 'Alimentos', 'Monetaria', 'Transferencia', '80000', '2024-01-20', 'aprobada', 2, 1),
(null, 'Apoyo Comunitario', 'Social', 'Monetaria', 'Efectivo', '30000', '2024-02-10', 'pendiente', 3, 2),
(null, 'Donacion Medica', 'Salud', 'Monetaria', 'Tarjeta', '120000', '2024-02-15', 'completada', 4, 2),
(null, 'Fondo Solidario', 'Comunidad', 'Monetaria', 'Transferencia', '60000', '2024-03-05', 'aprobada', 5, 3);
INSERT INTO SEGUIMIENTO_EVENTOS VALUES
(null,'En Proceso'),
(null,'Completado'),
(null,'Cancelado'),
(null,'Pendiente'),
(null,'Reprogramado');

INSERT INTO EVENTOS VALUES
(null,'2022-05-15','Evento de Caridad','Calle 45 # 34-56','Caridad','Evento para necesitadas',1,1),
(null,'2022-06-20','Evento de Construcción','Calle 34 # 45-67','Construcción','Construir viviendas para personas sin hogar',2,2),
(null,'2022-07-10','Evento de Educación','Calle 56 # 78-90','Educación','Promocionar educación a niños vulnerables',3,3),
(null,'2022-08-05','Evento de Salud','Calle 78 # 90-12','Salud','Brindar atención a comunidades desfavorecidas',4,4),
(null,'2022-09-15','Evento de Medio Ambiente','Calle 90 # 12-34','Medio Ambiente','Promover conciencia ambiental y conservación',5,5);

INSERT INTO USUARIO_EVENTOS VALUES
(1,2),
(2,2),
(3,3),
(4,4),
(5,5);

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