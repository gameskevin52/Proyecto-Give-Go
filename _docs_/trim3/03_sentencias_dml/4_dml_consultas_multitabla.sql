/* ************************************************************************************* */
/* ---------------------------------------- DML ---------------------------------------- */
/* ---------------------------- DATA MANIPULATION LANGUAGE ----------------------------- */
/* ------------------------- LENGUAJE DE MANIPULACIÓN DE DATOS ------------------------- */
/* -------------------------------- MULTITABLA / UNIÓN --------------------------------- */
/* ------------------------------------------------------------------------------------- */
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
-- CREA UNA TABA APARTIR DE OTRA TENIENDO EN CUENTA UNA COLUMNA DE REFERENCIA Y UN REGISTRO
CREATE TABLE DONACIONES_VALOR SELECT * FROM DONACIONES
WHERE donacion_valor = '50000';

-- -------------------------------------------
-- ELIMINA UN REGISTRO A PARTIR DE SU LLAVE 
DELETE FROM ORGANIZACIONES 
WHERE organizacion_id = '1';

-- ------------------------------------------------------------------------------------- --
-- 1.2. Datos Anexados. ---------------------------------------------------------------- --
--      INSERT INTO __ SELECT __ FROM __ : --------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- INTEGRA LA TABLA CREADA APARTIR DE UNA PRINCIPAL, EN LA PRINCIPAL
INSERT INTO ORGANIZACIONES SELECT * FROM ORGANIZACIONES_SOCIAL;

-- ELIMINA LA TABLA CREADA APARTIR DE UNA PRINCIPAL
DROP TABLE DONACIONES_VALOR;


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
-- UNE LA CONSULTAS DE DOS TABLAS EN UNA LA PRINCIPAL Y ELIMINA LOS DUPLCADOS
SELECT * FROM ORGANIZACIONES UNION 
SELECT * FROM ORGANIZACIONES_SOCIAL;

-- UNE LOS RESULTADOS DE DOS CONSULTAS DE DIFERENTES TABLAS EN UNA SOLA Y ELIMINA 
-- LOS REGISTROS DUPLICADOS.
SELECT * FROM ORGANIZACIONES WHERE organizacion_id = 2 UNION 
SELECT * FROM ORGANIZACIONES_SOCIAL WHERE organizacion_id = 1;

-- LA CONSULTA UNIRÁ LOS REGISTROS DE AMBAS TABLAS DONDE LAS DONACIONES
-- SUPEREN ESOS VALORES, ELIMINARÁ LOS DUPLICADOS Y CUMPLIRÁ CON LAS CONDICIONES.
SELECT * FROM DONACIONES WHERE donacion_valor > 50000 UNION 
SELECT * FROM DONACIONES_VALOR WHERE donacion_id = 5 AND donacion_valor > 4000;

-- UNE LOS RESULTADOS DE DOS CONSULTAS CUMPLIEND CON LAS CONDICIONES Y ELIMINA LOS 
-- REGISTROS DUPLICADOS.
SELECT donacion_id, donacion_tipo, donacion_valor 
FROM DONACIONES WHERE donacion_valor > 50000 UNION 
SELECT usuario_id, donaCion_nombre, donacion_valor 
FROM DONACIONES_VALOR WHERE usuario_id = 4 AND donacion_valor > 5000;

-- ------------------------------------------------------------------------------------- --
-- 2.1.2. UNION ALL. ------------------------------------------------------------------- --
--        SELECT __ FROM __ UNION ALL SELECT __ FROM __ : ------------------------------ --
-- ------------------------------------------------------------------------------------- --
-- UNE TODOS LOS REGISTROS DE AMBAS TABLAS Y ELIMIA LOS DUPLICADOS
SELECT * FROM DONACIONES UNION ALL
SELECT * FROM DONACIONES_VALOR;

-- ------------------------------------------------------------------------------------- --
-- 2.2. Unión Interna. ----------------------------------------------------------------- --
--      INNER JOIN, LEFT JOIN, RIGHT JOIN : -------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.2.1. INNER JOIN. ------------------------------------------------------------------ --
--        SELECT __ FROM __ INNER JOIN __ ON __.__ = __.__ : --------------------------- --
-- ------------------------------------------------------------------------------------- --
-- JUNTA LA INFORMACION DE AMBAS TABLAS EN UNA SOLA SIEMPRE Y CUANDO HAYA RELACION ENTRE ELLAS
SELECT * FROM USUARIOS 
INNER JOIN DONACIONES
ON USUARIOS.usuario_id = DONACIONES.usuario_id;

-- JUNTA LA INFORMACION DE LAS TRES TABLAS EN UNA SOLA SIEMPRE Y CUANDO HAYA RELACION ENTRE ELLAS
SELECT * FROM ORGANIZACIONES AS ORG
INNER JOIN USUARIOS AS USU
ON ORG.organizacion_id = USU.usuario_id
INNER JOIN DONACIONES AS DON
ON USU.usuario_id = DON.usuario_id;

-- MUESTRA LOS REGISTROS DE 4 TABLAS QUE TIENEN RELACION ENRE SI, SIEMPRE Y CUANDO 
-- HAYA RELACION ENTRE ELLAS
SELECT * FROM ORGANIZACIONES 
INNER JOIN USUARIOS 
ON ORGANIZACIONES.organizacion_id = USUARIOS.organizacion_id
INNER JOIN DONACIONES 
ON USUARIOS.usuario_id = DONACIONES.usuario_id
INNER JOIN EVENTOS
ON ORGANIZACIONES.organizacion_id = EVENTOS.organizacion_id;

## MUESTRA LA RELACION ESTRE LAS TRES TABLAS USUANDO UN INNER JOIN,
## SIEMPRE Y CUANDO HAYA RELACION ENTRE ELLAS
SELECT * FROM USUARIOS 
INNER JOIN ORGANIZACIONES
ON USUARIOS.usuario_id = ORGANIZACIONES.organizacion_id
INNER JOIN DONACIONES
ON ORGANIZACIONES.organizacion_id = DONACIONES.usuario_id;

-- ------------------------------------------------------------------------------------- --
-- 2.2.1.1. Con repeticiones. ---------------------------------------------------------- --
--          SELECT __ FROM __ INNER JOIN __ ON __.__ = __.__ : ------------------------- --
-- ------------------------------------------------------------------------------------- --
## CONSULTAR LOS USUARIOS CON LA RELACIÓN ENTRE TABLAS (EN ESTE CASO 2 TABLAS) GUIÁNDOSE DEL ID.
SELECT U.usuario_id, U.organizacion_id, usuario_nombre, usuario_apellido, usuario_estrato,
usuario_direccion, usuario_telefono
FROM USUARIOS AS U
INNER JOIN ORGANIZACIONES AS Org
ON Org.organizacion_id = U.organizacion_id;

-- ------------------------------------------------------------------------------------- --
## CONSULTAR LOS USUARIOS CON SU RELACIÓN ENTRE TABLAS (EN ESTE CASO 4 TABLAS) GUIÁNDOSE
## DEL ID Y MOSTRANDO LA INFORMACION SOLICITADA.
SELECT USUARIOS.usuario_id, ORGANIZACIONES.organizacion_id, organizacion_nombre,
evento_id, evento_nombre, organizacion_contraseña
FROM ORGANIZACIONES
INNER JOIN USUARIOS
ON ORGANIZACIONES.organizacion_id = USUARIOS.organizacion_id
INNER JOIN DONACIONES
ON USUARIOS.usuario_id = DONACIONES.usuario_id
INNER JOIN EVENTOS
ON ORGANIZACIONES.organizacion_id = EVENTOS.organizacion_id;

-- ------------------------------------------------------------------------------------- --
## CONSULTAR LOS USUARIOS CON SU RELACIÓN ENTRE TABLAS (EN ESTE CASO 3 TABLAS)GUIÁNDOSE 
## DEL ID Y MOSTRANDO LA INFORMACION SOLICITADA.
SELECT USUARIOS.usuario_id, ORGANIZACIONES.organizacion_id, organizacion_nombre,
donacion_valor, donacion_nombre, organizacion_contraseña
FROM ORGANIZACIONES
INNER JOIN USUARIOS
ON ORGANIZACIONES.organizacion_id = USUARIOS.organizacion_id
INNER JOIN DONACIONES
ON USUARIOS.usuario_id = DONACIONES.usuario_id;

-- ------------------------------------------------------------------------------------- --
-- 2.2.1.2. Sin repeticiones. ---------------------------------------------------------- --
--          SELECT DISTINCT __ FROM __ INNER JOIN __ ON __.__ = __.__ : ---------------- --
-- ------------------------------------------------------------------------------------- --
## ESTA CONSULTA DEVUELVE ÚNICAMENTE los IDs de los usuarios que están ASOCIADOS a una 
## organización EXISTENTE Y que además han REALIZADO al menos una donación, todo mediante 
## la relación de IDs entre las tres tablas (USUARIOS, ORGANIZACIONES y DONACIONES).
SELECT DISTINCT USUARIOS.usuario_id
FROM ORGANIZACIONES
INNER JOIN USUARIOS 
ON ORGANIZACIONES.organizacion_id = USUARIOS.organizacion_id
INNER JOIN DONACIONES 
ON USUARIOS.usuario_id = DONACIONES.usuario_id;

-- ------------------------------------------------------------------------------------- --
-- 2.2.1.2. Condicionada. -------------------------------------------------------------- --
--          WHERE, OPERADORES, ORDER BY : ---------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
## ESTA CONSULTA DEVUELVE TODAS LAS DONACIONES CON LA INFORMACION COMPLETA DEL USUARIO 
## (NOMBRES, APELLIDO, TELEFONO) Y LA ORGANIZACION A LA QUE PERTENECE, MEDIANTE LA RELACION
## DE IDs ENTRE LAS TRES TABLAS (USUARIOS, ORGANIZACIONES Y DONACIONES), ORDENADAS DE LA 
## DONACION DE MAYOR VALOR A LA DE MENOR VALOR.
SELECT Donaciones.donacion_id, Usuarios.usuario_id, Usuarios.usuario_nombre, 
Usuarios.usuario_apellido, Usuarios.usuario_telefono,Organizaciones.organizacion_nombre, 
Donaciones.donacion_valor, Donaciones.donacion_tipo, Donaciones.donacion_metodopago
FROM Usuarios
INNER JOIN Organizaciones 
ON Usuarios.organizacion_id = Organizaciones.organizacion_id
INNER JOIN Donaciones 
ON Usuarios.usuario_id = Donaciones.usuario_id
ORDER BY CAST(Donaciones.donacion_valor AS DECIMAL) DESC;

## ESTA CONSULTA DEVUELVE TODAS LAS DONACIONES DE TIPO MONETARIA HECHAS POR USUARIOS QUE 
## VIVEN EN MEDELLIN, CON LA INFORMACION COMPLETA DEL USUARIO (NOMBRES, APELLIDO, DIRECCION)
## Y LA ORGANIZACION A LA QUE PERTENECE, MEDIANTE LA RELACION DE IDs ENTRE LAS TRES TABLAS 
## (USUARIOS, ORGANIZACIONES Y DONACIONES), ORDENADAS DE LA DONACION DE MAYOR VALOR A LA DE 
## MENOR VALOR.

SELECT Donaciones.donacion_id, Usuarios.usuario_id, Usuarios.usuario_nombre, 
Usuarios.usuario_apellido, Usuarios.usuario_direccion, Organizaciones.organizacion_nombre, 
Donaciones.donacion_fecha, Usuarios.usuario_direccion, Donaciones.donacion_valor, 
Donaciones.donacion_tipo
FROM USUARIOS
INNER JOIN ORGANIZACIONES 
ON USUARIOS.organizacion_id = ORGANIZACIONES.organizacion_id
INNER JOIN DONACIONES 
ON USUARIOS.usuario_id = DONACIONES.usuario_id
WHERE USUARIOS.usuario_direccion = "Medellin" 
AND DONACIONES.donacion_tipo = "Monetaria"
ORDER BY CAST(DONACIONES.donacion_valor AS DECIMAL) DESC;

## ESTA CONSULTA CALCULA EL IVA (19%) Y EL TOTAL CON IVA PARA UNA DONACION ESPECIFICA 
## (donacion_id = 1), MOSTRANDO LA INFORMACION DE LA DONACION, EL USUARIO QUE LA HIZO 
## Y LA ORGANIZACION QUE LA RECIBE, MEDIANTE LA RELACION DE IDs ENTRE LAS TRES TABLAS 
## (DONACIONES, USUARIOS Y ORGANIZACIONES).

SELECT Donaciones.donacion_id, Usuarios.usuario_id, Organizaciones.organizacion_id,
Organizaciones.organizacion_nombre, Donaciones.donacion_nombre, Donaciones.donacion_valor,
Donaciones.donacion_categoria, Donaciones.donacion_tipo,
Donaciones.donacion_valor AS valor_parcial,
ROUND(CAST(Donaciones.donacion_valor AS DECIMAL) * 0.19, 2) AS iva,
CAST(Donaciones.donacion_valor AS DECIMAL) + 
ROUND(CAST(Donaciones.donacion_valor AS DECIMAL) * 0.19, 2) AS total,
Donaciones.donacion_valor AS total_pagar
FROM DONACIONES
INNER JOIN USUARIOS
ON Donaciones.usuario_id = Usuarios.usuario_id
INNER JOIN ORGANIZACIONES
ON Donaciones.organizacion_id = Organizaciones.organizacion_id
WHERE Donaciones.donacion_id = 1;

-- ------------------------------------------------------------------------------------- --
-- 2.2.2. LEFT JOIN. ------------------------------------------------------------------- --
--        SELECT __ FROM __ LEFT JOIN __ ON __.__ = __.__ : ---------------------------- --
-- ------------------------------------------------------------------------------------- --
## LA CONSULTA DEVUELVE USUARIOS QUE HAN DONADO, Y ADEMAS MUESTRA TODAS LAS DONACIONES QUE
## RECIBIO SU ORGANIZACION. POR ESO UN USUARIO PUEDE APARECER VARIAS VECES, UNA POR CADA
## DONACION EXTRA DE SU ORGANIZACION.
SELECT Donaciones.donacion_id, Usuarios.usuario_id, Usuarios.usuario_nombre, 
Usuarios.usuario_apellido, Usuarios.usuario_direccion, Organizaciones.organizacion_nombre, 
Donaciones.donacion_fecha, Usuarios.usuario_direccion, Donaciones.donacion_valor, 
Donaciones.donacion_tipo
FROM USUARIOS
INNER JOIN ORGANIZACIONES
ON USUARIOS.organizacion_id = ORGANIZACIONES.organizacion_id
INNER JOIN DONACIONES
ON USUARIOS.usuario_id = DONACIONES.usuario_id
LEFT JOIN DONACIONES AS DONACIONES_EXTRA
ON ORGANIZACIONES.organizacion_id = DONACIONES_EXTRA.organizacion_id;

## LA CONSULTA DEVUELVE LOS USUARIOS QUE PERTENECEN A UNA ORGANIZACION
## PERO NUNCA HAN HECHO UNA DONACION.
SELECT Donaciones.donacion_id, Usuarios.usuario_id, Usuarios.usuario_nombre, 
Usuarios.usuario_apellido, Usuarios.usuario_direccion, Organizaciones.organizacion_nombre
FROM USUARIOS
INNER JOIN ORGANIZACIONES
ON USUARIOS.organizacion_id = ORGANIZACIONES.organizacion_id
INNER JOIN DONACIONES
ON USUARIOS.usuario_id = DONACIONES.usuario_id
LEFT JOIN DONACIONES AS DONACIONES_EXTRA
ON ORGANIZACIONES.organizacion_id = DONACIONES_EXTRA.organizacion_id
WHERE DONACIONES.donacion_id IS NULL;

-- ------------------------------------------------------------------------------------- --
-- 2.2.3. RIGHT JOIN. ------------------------------------------------------------------ --
--        SELECT __ FROM __ RIGHT JOIN __ ON __.__ = __.__ : --------------------------- --
-- ------------------------------------------------------------------------------------- --
## LA CONSULTA DEVUELVE TODAS LAS DONACIONES (INCLUYENDO LAS QUE TIENEN USUARIO INEXISTENTE
## O NULO) Y SOLO LA INFORMACION DEL USUARIO SI EXISTE COINCIDENCIA.
SELECT * FROM USUARIOS
RIGHT JOIN DONACIONES
ON USUARIOS.usuario_id = DONACIONES.usuario_id;

-- NOTA: Esta consulta no Funciona, ya que cada pedido tiene asociado un cliente. No 
--       puede existir pedidos sin clientes
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.3. Subconsultas. ------------------------------------------------------------------ --
--      IN, NOT IN, ANY, ALL : --------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.3.1. Escalonada. ------------------------------------------------------------------ --
--        SELECT __ FROM __ WHERE __ IN (SELECT __ FROM __ WHERE __ ) : ---------------- --
-- ------------------------------------------------------------------------------------- --
## LA CONSULTA DEVUELVE EL NOMBRE Y VALOR DE LAS DONACIONES CUYO VALOR SEA MAYOR A 50000.
SELECT Donaciones.donacion_nombre, Donaciones.donacion_valor 
FROM DONACIONES 
INNER JOIN USUARIOS 
ON DONACIONES.usuario_id = USUARIOS.usuario_id
WHERE CAST(Donaciones.donacion_valor AS DECIMAL) > 50000;

## LA CONSULTA DEVUELVE EL NOMBRE Y VALOR DE LAS DONACIONES HECHAS POR USUARIOS QUE 
## TIENEN DONACIONES CON VALOR MAYOR A 50000.
SELECT Donaciones.donacion_nombre, Donaciones.donacion_valor 
FROM DONACIONES 
WHERE Donaciones.usuario_id IN 
(SELECT USUARIOS.usuario_id FROM USUARIOS WHERE CAST(Donaciones.donacion_valor AS DECIMAL) > 50000);

## LA CONSULTA DEVUELVE EL NOMBRE Y VALOR DE LAS DONACIONES HECHAS EXCLUSIVAMENTE POR
## USUARIOS QUE PERTENECEN A UNA ORGANIZACION (TIENEN organizacion_id DIFERENTE DE NULL).

SELECT Donaciones.donacion_nombre, Donaciones.donacion_valor 
FROM DONACIONES 
WHERE Donaciones.usuario_id NOT IN 
(SELECT USUARIOS.usuario_id FROM USUARIOS WHERE USUARIOS.organizacion_id IS NULL);

## LA CONSULTA DEVUELVE EL NOMBRE, APELLIDO Y DIRECCION DE LOS USUARIOS QUE
## HAN HECHO DONACIONES DE TIPO "MONETARIA".
SELECT Usuarios.usuario_nombre, Usuarios.usuario_apellido, Usuarios.usuario_direccion 
FROM USUARIOS
WHERE Usuarios.usuario_id IN
(SELECT Donaciones.usuario_id 
FROM DONACIONES 
WHERE Donaciones.donacion_tipo LIKE '%Monetaria%');

-- ------------------------------------------------------------------------------------- --
-- 2.3.2. Lista. ----------------------------------------------------------------------- --
--        SELECT __ FROM __ WHERE __ IN (SELECT __ FROM __ WHERE __ ) : ---------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.3.3. Correlacionada. -------------------------------------------------------------- --
--        SELECT __ FROM __ WHERE __ IN (SELECT __ FROM __ WHERE __ ) : ---------------- --
-- ------------------------------------------------------------------------------------- --


/* ************************************************************************************* */
/* ------------------------------ 3. CONSULTAS DE ACCIÓN ------------------------------- */
/* --------------------------------------- FINAL --------------------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- 3.1. Eliminar Datos de una Tabla Relacionada. --------------------------------------- --
--       : ----------------------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
## LA CONSULTA ELIMINA TODOS LOS USUARIOS QUE NUNCA HAN REALIZADO UNA DONACION. SOLO
## QUEDAN LOS USUARIOS QUE TIENEN AL MENOS UNA DONACION REGISTRADA.

DELETE USUARIOS FROM USUARIOS LEFT JOIN DONACIONES 
ON USUARIOS.usuario_id = DONACIONES.usuario_id
WHERE DONACIONES.usuario_id IS NULL;

 ## NOTA: Esta consulta es PELIGROSA porque elimina datos permanentemente.

/* ************************************************************************************* */