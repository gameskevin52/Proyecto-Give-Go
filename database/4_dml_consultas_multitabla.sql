/* ************************************************************************************* */
/* ---------------------------------------- DML ---------------------------------------- */
/* ---------------------------- DATA MANIPULATION LANGUAGE ----------------------------- */
/* ------------------------- LENGUAJE DE MANIPULACIÓN DE DATOS ------------------------- */
/* -------------------------------- MULTITABLA / UNIÓN --------------------------------- */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
/* BASE DE DATOS: give_and_go                                                           */
/* TABLAS: Usuarios, Organizaciones, Eventos, Donaciones, Monetarios, Objetos,          */
/*         Seguimiento_Eventos                                                          */
/* ************************************************************************************* */
/* ------------------------------------------------------------------------------------- */
/* 1. CONSULTAS DE ACCIÓN [Inicio]                                                       */
/* 1.1. Crear una Tabla con Otra : ... CREATE TABLE _ SELECT _ FROM _ WHERE _ = _        */
/* 1.2. Insertar Datos Anexados : .... INSERT INTO _ SELECT _ FROM _                     */
/* 2. CONSULTAS DE SELECCIÓN                                                             */
/* 2.1. Unión Externa : .............. UNION, UNION ALL                                  */
/* 2.1.1. UNION : .................... SELECT _ FROM _ UNION SELECT _ FROM _             */
/* 2.1.2. UNION ALL : ................ SELECT _ FROM _ UNION ALL SELECT _ FROM _         */
/* 2.2. Unión Interna : .............. INNER JOIN, LEFT JOIN, RIGHT JOIN                 */
/* 2.2.1. INNER JOIN : ............... SELECT _ FROM _ INNER JOIN _ ON _._ = _._         */
/* 2.2.1.1. Con Repeticiones : ....... INNER JOIN                                        */
/* 2.2.1.2. Sin Repeticiones : ....... DISTINCT                                          */
/* 2.2.1.3. Condicionada : ........... WHERE, OPERADORES, ORDER BY                       */
/* 2.2.2. LEFT JOIN : ................ SELECT _ FROM _ LEFT JOIN _ ON _._ = _._          */
/* 2.2.2. RIGHT JOIN : ............... SELECT _ FROM _ RIGHT JOIN _ ON _._ = _._         */
/* 2.3. Subconsultas : ............... IN, NOT IN                                        */
/* 2.3.1. Escalonada : ............... SELECT _ FROM _ WHERE _ IN (SELECT _ FROM _ )     */
/* 2.3.2. Lista : .................... SELECT _ FROM _ WHERE _ IN (SELECT _ FROM _ )     */
/* 2.3.2. Correlacionada : ........... SELECT _ FROM _ WHERE _ IN (SELECT _ FROM _ )     */
/* 3. CONSULTAS DE ACCIÓN [Final]                                                        */
/* ------------------------------------------------------------------------------------- */
/* BIBLIOGRAFÍA                                                                          */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
/* EN CONSOLA: XAMPP / SHELL / cd mysql/bin / mysql -h localhost -u root -p / ENTER      */
/* ************************************************************************************* */


/* ************************************************************************************* */
/* ------------------------------ 1. CONSULTAS DE ACCIÓN ------------------------------- */
/* -------------------------------------- INICIO --------------------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- 1.1. Crear una Tabla a partir de Otra. ---------------------------------------------- --
--      CREATE TABLE __ SELECT __ FROM __ WHERE __ = __ : ------------------------------ --
-- ------------------------------------------------------------------------------------- --
-- CREA UNA TABLA APARTIR DE OTRA TENIENDO EN CUENTA UNA COLUMNA DE REFERENCIA Y UN REGISTRO
CREATE TABLE Donaciones_Monetarias SELECT * FROM Donaciones
WHERE tipo_donaciones = 'Monetaria';

-- CREA UNA TABLA CON DONACIONES DE ALTO VALOR
CREATE TABLE Donaciones_Grandes SELECT d.*, m.valor_total 
FROM Donaciones d
INNER JOIN Monetarios m ON d.id_Donaciones = m.id_Donaciones
WHERE m.valor_total > 100000;

-- -------------------------------------------
-- ELIMINA UN REGISTRO A PARTIR DE SU LLAVE 
DELETE FROM Organizaciones 
WHERE id_Organizaciones = 1;

-- ------------------------------------------------------------------------------------- --
-- 1.2. Datos Anexados. ---------------------------------------------------------------- --
--      INSERT INTO __ SELECT __ FROM __ : --------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- INTEGRA LA TABLA CREADA APARTIR DE UNA PRINCIPAL, EN LA PRINCIPAL
INSERT INTO Organizaciones SELECT * FROM Organizaciones_Social;

-- INSERTA DONACIONES MONETARIAS A UNA TABLA DE RESPALDO
INSERT INTO Donaciones_Respaldo SELECT * FROM Donaciones WHERE tipo_donaciones = 'Monetaria';

-- ELIMINA LA TABLA CREADA APARTIR DE UNA PRINCIPAL
DROP TABLE Donaciones_Monetarias;
DROP TABLE Donaciones_Grandes;
DROP TABLE Donaciones_Respaldo;


/* ************************************************************************************* */
/* ----------------------------- 2. CONSULTAS DE SELECCIÓN ----------------------------- */
/* -------------------------- EXTERNA, INTERNA Y SUBCONSULTAS -------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- 2.1. Unión Externa. ----------------------------------------------------------------- --
--      UNION, UNION ALL : ------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.1.1. UNION. ----------------------------------------------------------------------- --
--        SELECT __ FROM __ UNION SELECT __ FROM __ : ---------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- UNE LAS CONSULTAS DE DOS TABLAS EN UNA LA PRINCIPAL Y ELIMINA LOS DUPLICADOS
SELECT id_Organizaciones, nombre_organizaciones FROM Organizaciones UNION 
SELECT id_Organizaciones, nombre_organizaciones FROM Organizaciones_Social;

-- UNE LOS RESULTADOS DE DOS CONSULTAS DE DIFERENTES TABLAS EN UNA SOLA Y ELIMINA 
-- LOS REGISTROS DUPLICADOS.
SELECT id_Organizaciones, nombre_organizaciones FROM Organizaciones WHERE id_Organizaciones = 1 UNION 
SELECT id_Organizaciones, nombre_organizaciones FROM Organizaciones_Social WHERE id_Organizaciones = 2;

-- LA CONSULTA UNIRÁ LOS REGISTROS DE DONACIONES CON LAS MONETARIAS DONDE LOS VALORES
-- SUPEREN CIERTOS MONTOS, ELIMINARÁ LOS DUPLICADOS Y CUMPLIRÁ CON LAS CONDICIONES.
SELECT d.id_Donaciones, d.categoria_donaciones, m.valor_total 
FROM Donaciones d
INNER JOIN Monetarios m ON d.id_Donaciones = m.id_Donaciones
WHERE m.valor_total > 50000 UNION 
SELECT d.id_Donaciones, d.categoria_donaciones, m.valor_total 
FROM Donaciones d
INNER JOIN Monetarios m ON d.id_Donaciones = m.id_Donaciones
WHERE d.id_Donaciones = 1 AND m.valor_total > 4000;

-- UNE LOS RESULTADOS DE DOS CONSULTAS CUMPLIENDO CON LAS CONDICIONES Y ELIMINA LOS 
-- REGISTROS DUPLICADOS.
SELECT d.id_Donaciones, d.tipo_donaciones, m.valor_total 
FROM Donaciones d
INNER JOIN Monetarios m ON d.id_Donaciones = m.id_Donaciones
WHERE m.valor_total > 50000 UNION 
SELECT d.id_Donaciones, d.tipo_donaciones, m.valor_total 
FROM Donaciones d
INNER JOIN Monetarios m ON d.id_Donaciones = m.id_Donaciones
WHERE d.id_Donaciones = 1 AND m.valor_total > 5000;

-- ------------------------------------------------------------------------------------- --
-- 2.1.2. UNION ALL. ------------------------------------------------------------------- --
--        SELECT __ FROM __ UNION ALL SELECT __ FROM __ : ------------------------------ --
-- ------------------------------------------------------------------------------------- --
-- UNE TODOS LOS REGISTROS DE AMBAS TABLAS Y NO ELIMINA LOS DUPLICADOS
SELECT id_Donaciones, categoria_donaciones, tipo_donaciones FROM Donaciones UNION ALL
SELECT id_Donaciones, categoria_donaciones, tipo_donaciones FROM Donaciones_Monetarias;

-- ------------------------------------------------------------------------------------- --
-- 2.2. Unión Interna. ----------------------------------------------------------------- --
--      INNER JOIN, LEFT JOIN, RIGHT JOIN : -------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.2.1. INNER JOIN. ------------------------------------------------------------------ --
--        SELECT __ FROM __ INNER JOIN __ ON __.__ = __.__ : --------------------------- --
-- ------------------------------------------------------------------------------------- --
-- JUNTA LA INFORMACION DE AMBAS TABLAS EN UNA SOLA SIEMPRE Y CUANDO HAYA RELACION ENTRE ELLAS
SELECT * FROM Usuarios 
INNER JOIN Donaciones
ON Usuarios.id_Usuarios = Donaciones.id_Usuarios;

-- JUNTA LA INFORMACION DE LAS TRES TABLAS EN UNA SOLA SIEMPRE Y CUANDO HAYA RELACION ENTRE ELLAS
SELECT * FROM Organizaciones AS Org
INNER JOIN Eventos AS Eve
ON Org.id_Organizaciones = Eve.id_Organizaciones
INNER JOIN Seguimiento_Eventos AS Seg
ON Eve.id_Eventos = Seg.id_Eventos;

-- MUESTRA LOS REGISTROS DE 4 TABLAS QUE TIENEN RELACION ENTRE SI, SIEMPRE Y CUANDO 
-- HAYA RELACION ENTRE ELLAS
SELECT * FROM Organizaciones 
INNER JOIN Eventos 
ON Organizaciones.id_Organizaciones = Eventos.id_Organizaciones
INNER JOIN Seguimiento_Eventos 
ON Eventos.id_Eventos = Seguimiento_Eventos.id_Eventos
INNER JOIN Usuarios
ON Seguimiento_Eventos.id_Usuarios = Usuarios.id_Usuarios;

-- MUESTRA LA RELACION ENTRE LAS TRES TABLAS USANDO UN INNER JOIN,
-- SIEMPRE Y CUANDO HAYA RELACION ENTRE ELLAS
SELECT * FROM Usuarios 
INNER JOIN Donaciones
ON Usuarios.id_Usuarios = Donaciones.id_Usuarios
INNER JOIN Monetarios
ON Donaciones.id_Donaciones = Monetarios.id_Donaciones;

-- ------------------------------------------------------------------------------------- --
-- 2.2.1.1. Con repeticiones. ---------------------------------------------------------- --
--          SELECT __ FROM __ INNER JOIN __ ON __.__ = __.__ : ------------------------- --
-- ------------------------------------------------------------------------------------- --
-- CONSULTAR LOS USUARIOS CON LA RELACIÓN ENTRE TABLAS (EN ESTE CASO 2 TABLAS) GUIÁNDOSE DEL ID.
SELECT U.id_Usuarios, U.nombre1_usuario, U.apellido1_usuario, U.telefono_usuario,
U.correo_usuario, U.roles
FROM Usuarios AS U
INNER JOIN Donaciones AS D
ON D.id_Usuarios = U.id_Usuarios;

-- CONSULTAR LOS USUARIOS CON SU RELACIÓN ENTRE TABLAS (EN ESTE CASO 4 TABLAS) GUIÁNDOSE
-- DEL ID Y MOSTRANDO LA INFORMACION SOLICITADA.
SELECT U.id_Usuarios, Org.id_Organizaciones, Org.nombre_organizaciones,
Eve.id_Eventos, Eve.nombre_eventos, Org.password_organizaciones
FROM Organizaciones AS Org
INNER JOIN Eventos AS Eve
ON Org.id_Organizaciones = Eve.id_Organizaciones
INNER JOIN Seguimiento_Eventos AS Seg
ON Eve.id_Eventos = Seg.id_Eventos
INNER JOIN Usuarios AS U
ON Seg.id_Usuarios = U.id_Usuarios;

-- CONSULTAR LOS USUARIOS CON SU RELACIÓN ENTRE TABLAS (EN ESTE CASO 3 TABLAS) GUIÁNDOSE 
-- DEL ID Y MOSTRANDO LA INFORMACION SOLICITADA.
SELECT U.id_Usuarios, Org.id_Organizaciones, Org.nombre_organizaciones,
m.valor_total, d.categoria_donaciones, Org.password_organizaciones
FROM Organizaciones AS Org
INNER JOIN Donaciones AS d
ON Org.id_Organizaciones = d.id_Organizaciones
INNER JOIN Usuarios AS U
ON d.id_Usuarios = U.id_Usuarios
INNER JOIN Monetarios AS m
ON d.id_Donaciones = m.id_Donaciones;

-- ------------------------------------------------------------------------------------- --
-- 2.2.1.2. Sin repeticiones (DISTINCT). ----------------------------------------------- --
--          SELECT DISTINCT __ FROM __ INNER JOIN __ ON __.__ = __.__ : ---------------- --
-- ------------------------------------------------------------------------------------- --
-- ESTA CONSULTA DEVUELVE ÚNICAMENTE los IDs de los usuarios que están ASOCIADOS a una 
-- organización EXISTENTE Y que además han REALIZADO al menos una donación, todo mediante 
-- la relación de IDs entre las tres tablas (USUARIOS, ORGANIZACIONES y DONACIONES).
SELECT DISTINCT U.id_Usuarios, U.nombre1_usuario, U.apellido1_usuario
FROM Usuarios AS U
INNER JOIN Donaciones AS D
ON U.id_Usuarios = D.id_Usuarios
INNER JOIN Organizaciones AS Org
ON D.id_Organizaciones = Org.id_Organizaciones;

-- ------------------------------------------------------------------------------------- --
-- 2.2.1.3. Condicionada (WHERE, ORDER BY). ------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- ESTA CONSULTA DEVUELVE TODAS LAS DONACIONES CON LA INFORMACION COMPLETA DEL USUARIO 
-- (NOMBRES, APELLIDO, TELEFONO) Y LA ORGANIZACION A LA QUE PERTENECE, MEDIANTE LA RELACION
-- DE IDs ENTRE LAS TRES TABLAS (USUARIOS, ORGANIZACIONES Y DONACIONES Y MONETARIOS), 
-- ORDENADAS DE LA DONACION DE MAYOR VALOR A LA DE MENOR VALOR.
SELECT D.id_Donaciones, U.id_Usuarios, U.nombre1_usuario, 
U.apellido1_usuario, U.telefono_usuario, Org.nombre_organizaciones, 
M.valor_total, D.tipo_donaciones
FROM Usuarios AS U
INNER JOIN Donaciones AS D
ON U.id_Usuarios = D.id_Usuarios
INNER JOIN Organizaciones AS Org
ON D.id_Organizaciones = Org.id_Organizaciones
INNER JOIN Monetarios AS M
ON D.id_Donaciones = M.id_Donaciones
ORDER BY M.valor_total DESC;

-- ESTA CONSULTA DEVUELVE TODAS LAS DONACIONES DE TIPO MONETARIA HECHAS POR USUARIOS QUE 
-- TIENEN UN CORREO DE GMAIL, CON LA INFORMACION COMPLETA DEL USUARIO (NOMBRES, APELLIDO, CORREO)
-- Y LA ORGANIZACION A LA QUE PERTENECE, MEDIANTE LA RELACION DE IDs ENTRE LAS TRES TABLAS 
-- (USUARIOS, ORGANIZACIONES, DONACIONES Y MONETARIOS), ORDENADAS DE LA DONACION DE MAYOR VALOR 
-- A LA DE MENOR VALOR.
SELECT D.id_Donaciones, U.id_Usuarios, U.nombre1_usuario, 
U.apellido1_usuario, U.correo_usuario, Org.nombre_organizaciones, 
D.fecha_donacion, M.valor_total, D.tipo_donaciones
FROM Usuarios AS U
INNER JOIN Donaciones AS D
ON U.id_Usuarios = D.id_Usuarios
INNER JOIN Organizaciones AS Org
ON D.id_Organizaciones = Org.id_Organizaciones
INNER JOIN Monetarios AS M
ON D.id_Donaciones = M.id_Donaciones
WHERE U.correo_usuario LIKE '%@gmail.com' 
AND D.tipo_donaciones = 'Monetaria'
ORDER BY M.valor_total DESC;

-- ESTA CONSULTA CALCULA EL IVA (19%) Y EL TOTAL CON IVA PARA UNA DONACION ESPECIFICA 
-- (donacion_id = 1), MOSTRANDO LA INFORMACION DE LA DONACION, EL USUARIO QUE LA HIZO 
-- Y LA ORGANIZACION QUE LA RECIBE, MEDIANTE LA RELACION DE IDs ENTRE LAS TRES TABLAS 
-- (DONACIONES, USUARIOS, ORGANIZACIONES Y MONETARIOS).
SELECT D.id_Donaciones, U.id_Usuarios, Org.id_Organizaciones,
Org.nombre_organizaciones, D.categoria_donaciones, D.tipo_donaciones,
M.valor_total AS valor_parcial,
ROUND(M.valor_total * 0.19, 2) AS iva,
M.valor_total + ROUND(M.valor_total * 0.19, 2) AS total_con_iva
FROM Donaciones AS D
INNER JOIN Usuarios AS U
ON D.id_Usuarios = U.id_Usuarios
INNER JOIN Organizaciones AS Org
ON D.id_Organizaciones = Org.id_Organizaciones
INNER JOIN Monetarios AS M
ON D.id_Donaciones = M.id_Donaciones
WHERE D.id_Donaciones = 1;

-- ------------------------------------------------------------------------------------- --
-- 2.2.2. LEFT JOIN. ------------------------------------------------------------------- --
--        SELECT __ FROM __ LEFT JOIN __ ON __.__ = __.__ : ---------------------------- --
-- ------------------------------------------------------------------------------------- --
-- LA CONSULTA DEVUELVE USUARIOS QUE HAN DONADO, Y ADEMAS MUESTRA TODAS LAS DONACIONES QUE
-- RECIBIO SU ORGANIZACION. POR ESO UN USUARIO PUEDE APARECER VARIAS VECES, UNA POR CADA
-- DONACION EXTRA DE SU ORGANIZACION.
SELECT D.id_Donaciones, U.id_Usuarios, U.nombre1_usuario, 
U.apellido1_usuario, U.correo_usuario, Org.nombre_organizaciones, 
D.fecha_donacion, M.valor_total, D.tipo_donaciones
FROM Usuarios AS U
INNER JOIN Donaciones AS D
ON U.id_Usuarios = D.id_Usuarios
INNER JOIN Organizaciones AS Org
ON U.id_Usuarios IS NOT NULL
LEFT JOIN Monetarios AS M
ON D.id_Donaciones = M.id_Donaciones;

-- LA CONSULTA DEVUELVE LOS USUARIOS QUE PERTENECEN A UNA ORGANIZACION
-- PERO NUNCA HAN HECHO UNA DONACION.
SELECT U.id_Usuarios, U.nombre1_usuario, U.apellido1_usuario, 
U.correo_usuario, U.telefono_usuario
FROM Usuarios AS U
LEFT JOIN Donaciones AS D
ON U.id_Usuarios = D.id_Usuarios
WHERE D.id_Donaciones IS NULL;

-- ------------------------------------------------------------------------------------- --
-- 2.2.3. RIGHT JOIN. ------------------------------------------------------------------ --
--        SELECT __ FROM __ RIGHT JOIN __ ON __.__ = __.__ : --------------------------- --
-- ------------------------------------------------------------------------------------- --
-- LA CONSULTA DEVUELVE TODAS LAS DONACIONES (INCLUYENDO LAS QUE TIENEN USUARIO INEXISTENTE
-- O NULO) Y SOLO LA INFORMACION DEL USUARIO SI EXISTE COINCIDENCIA.
SELECT U.id_Usuarios, U.nombre1_usuario, D.id_Donaciones, D.categoria_donaciones, D.tipo_donaciones
FROM Usuarios AS U
RIGHT JOIN Donaciones AS D
ON U.id_Usuarios = D.id_Usuarios;

-- DEVUELVE TODOS LOS EVENTOS CON SUS ORGANIZACIONES, INCLUSO SI LA ORGANIZACIÓN FUE ELIMINADA
SELECT E.id_Eventos, E.nombre_eventos, Org.nombre_organizaciones
FROM Eventos AS E
RIGHT JOIN Organizaciones AS Org
ON E.id_Organizaciones = Org.id_Organizaciones;

-- ------------------------------------------------------------------------------------- --
-- 2.3. Subconsultas. ------------------------------------------------------------------ --
--      IN, NOT IN, ANY, ALL : --------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.3.1. Subconsulta Escalonada (IN). ------------------------------------------------- --
--        SELECT __ FROM __ WHERE __ IN (SELECT __ FROM __ WHERE __ ) : ---------------- --
-- ------------------------------------------------------------------------------------- --
-- LA CONSULTA DEVUELVE EL NOMBRE Y VALOR DE LAS DONACIONES CUYO VALOR SEA MAYOR A 50000.
SELECT d.categoria_donaciones, m.valor_total 
FROM Donaciones d
INNER JOIN Monetarios m ON d.id_Donaciones = m.id_Donaciones
WHERE m.valor_total > 50000;

-- LA CONSULTA DEVUELVE EL NOMBRE Y VALOR DE LAS DONACIONES HECHAS POR USUARIOS QUE 
-- TIENEN DONACIONES CON VALOR MAYOR A 50000.
SELECT d.categoria_donaciones, m.valor_total 
FROM Donaciones d
INNER JOIN Monetarios m ON d.id_Donaciones = m.id_Donaciones
WHERE d.id_Usuarios IN 
(SELECT U.id_Usuarios FROM Usuarios U WHERE m.valor_total > 50000);

-- LA CONSULTA DEVUELVE EL NOMBRE Y VALOR DE LAS DONACIONES HECHAS EXCLUSIVAMENTE POR
-- USUARIOS QUE PERTENECEN A UNA ORGANIZACION (TIENEN id_Organizaciones EN DONACIONES).
SELECT d.categoria_donaciones, d.tipo_donaciones 
FROM Donaciones d 
WHERE d.id_Usuarios NOT IN 
(SELECT U.id_Usuarios FROM Usuarios U WHERE U.id_Usuarios IS NULL);

-- LA CONSULTA DEVUELVE EL NOMBRE, APELLIDO Y CORREO DE LOS USUARIOS QUE
-- HAN HECHO DONACIONES DE TIPO "MONETARIA".
SELECT U.nombre1_usuario, U.apellido1_usuario, U.correo_usuario 
FROM Usuarios U
WHERE U.id_Usuarios IN
(SELECT D.id_Usuarios 
FROM Donaciones D 
WHERE D.tipo_donaciones = 'Monetaria');

-- LA CONSULTA DEVUELVE LAS ORGANIZACIONES QUE HAN RECIBIDO DONACIONES MONETARIAS
SELECT Org.nombre_organizaciones, Org.correo_organizaciones
FROM Organizaciones Org
WHERE Org.id_Organizaciones IN
(SELECT D.id_Organizaciones 
FROM Donaciones D 
WHERE D.tipo_donaciones = 'Monetaria');

-- ------------------------------------------------------------------------------------- --
-- 2.3.2. Subconsulta de Lista (IN con lista de valores). ------------------------------ --
--        SELECT __ FROM __ WHERE __ IN (valor1, valor2, valor3) : --------------------- --
-- ------------------------------------------------------------------------------------- --
-- DEVUELVE LOS USUARIOS QUE TIENEN ROLES ESPECÍFICOS
SELECT * FROM Usuarios 
WHERE roles IN ('Voluntario', 'Beneficiario');

-- DEVUELVE LAS DONACIONES DE CATEGORÍAS ESPECÍFICAS
SELECT * FROM Donaciones 
WHERE categoria_donaciones IN ('Salud', 'Educacion', 'Alimentos');

-- ------------------------------------------------------------------------------------- --
-- 2.3.3. Subconsulta Correlacionada. -------------------------------------------------- --
--        SELECT __ FROM __ WHERE __ OPERADOR (SELECT __ FROM __ WHERE __ = __ ) : ----- --
-- ------------------------------------------------------------------------------------- --
-- DEVUELVE LOS USUARIOS QUE HAN DONADO MÁS QUE EL PROMEDIO DE TODAS LAS DONACIONES
SELECT DISTINCT U.id_Usuarios, U.nombre1_usuario, U.apellido1_usuario
FROM Usuarios U
WHERE EXISTS (
    SELECT 1 FROM Donaciones D
    INNER JOIN Monetarios M ON D.id_Donaciones = M.id_Donaciones
    WHERE D.id_Usuarios = U.id_Usuarios
    AND M.valor_total > (SELECT AVG(valor_total) FROM Monetarios)
);

-- DEVUELVE LOS EVENTOS QUE TIENEN AL MENOS UN SEGUIMIENTO
SELECT E.id_Eventos, E.nombre_eventos, E.categoria_eventos
FROM Eventos E
WHERE EXISTS (
    SELECT 1 FROM Seguimiento_Eventos S
    WHERE S.id_Eventos = E.id_Eventos
);

-- DEVUELVE LAS ORGANIZACIONES QUE NO TIENEN NINGÚN EVENTO ASOCIADO
SELECT Org.id_Organizaciones, Org.nombre_organizaciones
FROM Organizaciones Org
WHERE NOT EXISTS (
    SELECT 1 FROM Eventos E
    WHERE E.id_Organizaciones = Org.id_Organizaciones
);

-- DEVUELVE LOS USUARIOS QUE HAN HECHO DONACIONES MAYORES AL PROMEDIO (con correlación)
SELECT U.id_Usuarios, U.nombre1_usuario, 
       (SELECT SUM(M.valor_total) FROM Donaciones D 
        INNER JOIN Monetarios M ON D.id_Donaciones = M.id_Donaciones
        WHERE D.id_Usuarios = U.id_Usuarios) AS total_donado
FROM Usuarios U
HAVING total_donado > (SELECT AVG(valor_total) FROM Monetarios);


/* ************************************************************************************* */
/* ------------------------------ 3. CONSULTAS DE ACCIÓN ------------------------------- */
/* --------------------------------------- FINAL --------------------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- 3.1. Eliminar Datos de una Tabla Relacionada. --------------------------------------- --
--       DELETE FROM __ USING __ INNER JOIN __ WHERE __ : ------------------------------ --
-- ------------------------------------------------------------------------------------- --
-- LA CONSULTA ELIMINA TODOS LOS USUARIOS QUE NUNCA HAN REALIZADO UNA DONACION. SOLO
-- QUEDAN LOS USUARIOS QUE TIENEN AL MENOS UNA DONACION REGISTRADA.

DELETE U FROM Usuarios U
LEFT JOIN Donaciones D ON U.id_Usuarios = D.id_Usuarios
WHERE D.id_Donaciones IS NULL;

-- NOTA: Esta consulta es PELIGROSA porque elimina datos permanentemente.
-- Se recomienda hacer un respaldo antes de ejecutarla.

-- ELIMINA LAS ORGANIZACIONES QUE NO TIENEN EVENTOS ASOCIADOS
DELETE Org FROM Organizaciones Org
LEFT JOIN Eventos E ON Org.id_Organizaciones = E.id_Organizaciones
WHERE E.id_Eventos IS NULL;

-- ELIMINA LAS DONACIONES QUE NO TIENEN REGISTRO EN MONETARIOS NI EN OBJETOS
DELETE D FROM Donaciones D
LEFT JOIN Monetarios M ON D.id_Donaciones = M.id_Donaciones
LEFT JOIN Objetos O ON D.id_Donaciones = O.id_Donaciones
WHERE M.id_Monetarios IS NULL AND O.id_Objetos IS NULL;


/* ************************************************************************************* */
/* ------------------------------- FIN DEL ARCHIVO ------------------------------------- */
/* ************************************************************************************* */