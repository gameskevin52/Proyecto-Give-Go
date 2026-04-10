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
/* 1.1.1. Datos Correctos : .......... Ver Archivo '1_dml_insercion.sql'                 */
/* 1.1.2. Datos Incorrectos : ........ INSERT INTO __ VALUES ( __ , __ )                 */
/* 1.2. Actualizar : ................. UPDATE __ SET __ = __ WHERE __ = __               */
/* 1.3. Eliminar : ................... DELETE FROM __ WHERE __ = __                      */
/* 2. CONSULTAS DE SELECCIÓN : ....... SELECT                                            */
/* 2.1. Generales : .................. SELECT * FROM __                                  */
/* 2.2. Específicas : ................ SELECT __ , __ FROM __                            */
/* 2.3. Con Criterios: ............... SELECT __ FROM __ WHERE __ = __                   */
/* 2.4. Con Operadores Lógicos : ..... OR, AND, NOT                                      */
/* 2.4.1. 0 [OR] : ................... SELECT __ FROM __ WHERE __ = __ OR __ = __        */
/* 2.4.2. Y [AND] : .................. SELECT __ FROM __ WHERE __ = __ AND __ = __       */
/* 2.4.3. No [NOT] : ................. SELECT __ FROM __ WHERE __ NOT IN ( __ )          */
/* 2.5. Con Operadores Comparación : . <>, <, <=, >, >=                                  */
/* 2.5.1. Diferente [<>] : ........... SELECT __ FROM __ WHERE __ <> __                  */
/* 2.5.2. Menor que [<] : ............ SELECT __ FROM __ WHERE __ <  __                  */
/* 2.5.3. Mayor que [>] : ............ SELECT __ FROM __ WHERE __ >  __                  */
/* 2.5.4. Menor o igual [<=] : ....... SELECT __ FROM __ WHERE __ <=  __                 */
/* 2.5.5. Mayor o igual [>=] : ....... SELECT __ FROM __ WHERE __ >=  __                 */
/* 2.6. Con otros Operadores : ....... LIKE '_%' , BETWEEN __ AND __ , IN ( __ , __ )    */
/* 2.6.1. Comodín [LIKE '_%'] : ...... SELECT __ FROM __ WHERE __ LIKE '_%'              */
/* 2.6.2. Entre [BETWEEN] : .......... SELECT __ FROM __ WHERE __ BETWEEN __ AND __      */
/* 2.6.3. Lista [IN ( __ )] : ........ SELECT __ FROM __ WHERE __ IN( __ , __ )          */
/* 2.7. Ordenadas : .................. ORDER BY __                                       */
/* 2.7.1. Ascendente [ASC] : ......... SELECT __ FROM __ WHERE __ = __ ORDER BY __ ASC   */
/* 2.7.2. Descendente [DESC] : ....... SELECT __ FROM __ WHERE __ = __ ORDER BY __ DESC  */
/* 2.7.3. Combinadas : ............... SELECT __ FROM __ WHERE __ = __ ORDER BY __       */
/* 2.8. Calculadas con Funciones: .... GROUP BY __                                       */
/* 2.8.1. Suma [SUM()] : ............. SELECT __ , SUM( __ ) FROM __ GROUP BY __         */
/* 2.8.2. Promedio [AVG()] : ......... SELECT __ , AVG( __ ) FROM __ GROUP BY __         */
/* 2.8.3. Máximo [MAX()] : ........... SELECT __ , MAX( __ ) FROM __ GROUP BY __         */
/* 2.8.4. Mínimo [MIN()] : ........... SELECT __ , MIN( __ ) FROM __ GROUP BY __         */
/* 2.8.5. Conteo [COUNT()] : ......... SELECT __ , COUNT( __ ) FROM __ GROUP BY __       */
/* 2.9. Calculadas con Alias : ....... SELECT __ , FUN( __ ) AS __ FROM __               */
/* 2.10. Calculadas Condicionantes : . GROUP BY __ HAVING __ = __ OR __ = __             */
/* 2.11. Calculadas con Operadores : . SELECT __ , __ , ROUND( __*0.19,2) AS __ FROM __  */
/* 2.12. Calculadas con Fechas : ..... NOW(), DATE_FORMAT(), TIMESTAMPDIFF()             */
/* 2.12.1. Fecha Actual : ............ NOW()                                             */
/* 2.12.2. Formato Fecha : ........... DATE_FORMAT(NOW(), '%Y-%m-%d')                    */
/* 2.12.3. Direfencia Fechas : ....... TIMESTAMPDIFF(DAY, __ , NOW())                    */
/* 3. CONSULTAS DE ACCIÓN [Final] : .. INSERT INTO, UPDATE, DELETE                       */
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
--        Ver Archivo '1_dml_insercion.sql' : ------------------------------------------ --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 1.1.2. Datos Incorrectos ------------------------------------------------------------ --
--        INSERT INTO __ VALUES ( __ , __ ) : ------------------------------------------ --
-- ------------------------------------------------------------------------------------- --
-- INSERTA DATOS A LAS TABLAS
INSERT INTO Organizaciones VALUES
(null,'Fundacion Esperanza', 'Social', 'Calle 10 #23-45', 'clave123');

INSERT INTO Usuarios VALUES
(null,'Nicolay Diagelo','Cajamarca',' cr 84 # 34 sur','371637224','tres','nico123', 1);

INSERT INTO MENSAJES VALUES 
(null, 'Alerta', '2026-03-01', 'Mantenimiento', 'Sistema en mantenimiento', 'Activa', 2, 1);

INSERT INTO DONACIONES VALUES
(null, 'Donacion Escolar', 'Educacion', 'Monetaria', 'Tarjeta', '50000', 1, 1);

INSERT INTO Seguimiento_Eventos VALUES
(null,'En Proceso');

INSERT INTO Eventos VALUES
(5,'2022-09-15','Evento de Medio Ambiente','Calle 90 # 12-34','Medio Ambiente','Promover conciencia ambiental y conservación',5,5);

INSERT INTO Usuario_Eventos VALUES
(1,2);

-- ------------------------------------------------------------------------------------- --
-- 1.2. Actualizar. -------------------------------------------------------------------- --
--      UPDATE __ SET __ = __ WHERE __ = __ : ------------------------------------------ --
-- ------------------------------------------------------------------------------------- --
-- ACTUALIZA EL DATO DE UNA TABLA GUIANDOSE DEL ID
UPDATE ORGANIZACION SET 
organizacion_nombre = 'Salud para uno y para Todos'
WHERE organizacion_id = 3;

UPDATE USUARIOS SET 
usuario_nombre = 'Maria Alejandra'
WHERE usuario_id = 4;

UPDATE MENSAJES SET 
mensajes_asunto = 'donacion'
WHERE eventos_id = '3';

UPDATE DONACIONES SET 
donacion_tipo = 'Material'
WHERE donacion_id = '1';

UPDATE Seguimiento_Eventos SET 
seguimiento_estado = 'Completado'
WHERE eventos_id = '2';

UPDATE EVENTOS SET 
eventos_id = '6'
WHERE eventos_id = '2';

-- ------------------------------------------------------------------------------------- --
-- 1.3. Eliminar. ---------------------------------------------------------------------- --
--      DELETE FROM __ WHERE __ = __ : ------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- ELIMINAR DATOS DE UNA TABLA TENIENDO EN CUENTA EL ID
DELETE FROM ORGANIZACIONES 
WHERE organizacion_id = '5';

DELETE FROM USUARIOS 
WHERE usuario_id = '5';

DELETE FROM MENSAJES 
WHERE mensaje_id = '5';

DELETE FROM DONACIONES 
WHERE donacion_id = '5';

DELETE FROM Seguimiento_Eventos 
WHERE seguimiento_id = '5';

DELETE FROM EVENTOS 
WHERE evento_id = '5';


/* ************************************************************************************* */
/* ----------------------------- 2. CONSULTAS DE SELECCIÓN ----------------------------- */
/* --------------------------------------- SELECT -------------------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- 2.1. Generales. --------------------------------------------------------------------- --
--      SELECT * FROM __ : ------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA TABLA COMPLETA DE UNA TABLA CON SU INFORMACION
SELECT * FROM ORGANIZACIONES;
SELECT * FROM USUARIOS;
SELECT * FROM MENSAJES;
SELECT * FROM DONACIONES;
SELECT * FROM Seguimiento_Eventos;
SELECT * FROM EVENTOS;
SELECT * FROM USUARIO_EVENTOS;

-- ------------------------------------------------------------------------------------- --
-- 2.2. Específicas. ------------------------------------------------------------------- --
--      SELECT __ , __ FROM __ : ------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA INFORMACION ESPECIFICANDO COLUMNAS QUE DESEA MOSTRAR
SELECT organizacion_id, organizacion_nombre, organizacion_categoria FROM ORGANIZACIONES;
SELECT organizacion_id, usuario_nombre, usuario_estrato FROM USUARIOS;
SELECT mensaje_tipo, mensaje_descripcion, usuario_id FROM MENSAJES;
SELECT donacion_nombre, donacion_tipo, usuario_id, organizacion_id  FROM DONACIONES;
SELECT seguimiento_id, seguimiento_estado FROM SEGUIMIENTO_EVENTOS;
SELECT evento_fecha, evento_nombre, organizacion_id, Seguimiento_Eventos_Seguimiento FROM EVENTOS;
SELECT usuario_id, evento_id FROM USUARIO_EVENTOS;

-- ------------------------------------------------------------------------------------- --
-- 2.3. Con Criterios. ----------------------------------------------------------------- --
--      SELECT __ , __ FROM __ WHERE __ = __ : ----------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LAS COLUMNAS ESPECIFICAS DE UNA TABLA GUIANDOSE POR EL ID A MOSTRAR 
SELECT organizacion_id, organizacion_nombre, organizacion_categoria FROM ORGANIZACIONES
WHERE organizacion_id = 4;

SELECT usuario_nombre, usuario_estrato, organizacion_id FROM USUARIOS
WHERE usuario_id = 2;

SELECT mensaje_fecha, mensaje_tipo, mensaje_descripcion, organiacion_id FROM MENSAJES
WHERE mensaje_id = 1;

SELECT donacion_id, donacion_nombre, donacion_categoria, donacion_tipo FROM DONACIONES
WHERE donacion_id = 5;

SELECT seguimiento_id, seguimiento_estado FROM SEGUIMIENTO_EVENTOS
WHERE seguimiento_id = 3;

SELECT evento_fecha, Seguimiento_Eventos_Seguimiento, organizacion_id FROM EVENTOS
WHERE evento_id = 2;

SELECT usuario_id, evento_id FROM USUARIO_EVENTOS
WHERE evento_id = 2;

-- ------------------------------------------------------------------------------------- --
-- 2.4. Con Operadores Lógicos. -------------------------------------------------------- --
--      OR, AND, NOT : ----------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.4.1. O [OR] . --------------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ = __ OR __ = __ : ---------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA INFOMACION DE CADA UNO DE LOS ID SEGUN LAS INDICACIONES DE LAS COLUMNAS A MOSTRAR UTILIZANDO EL OR
SELECT organizacion_id, organizacion_nombre, organizacion_categoria FROM ORGANIZACIONES
WHERE organizacion_id = 2 OR organizacion_id = 4;

SELECT usuario_id, usuario_nombre, usuario_estrato, organizacion_id FROM USUARIOS
WHERE usuario_id = 2 OR usuario_id = 3;

SELECT mensaje_id, mensaje_fecha, mensaje_tipo, mensaje_descripcion, organiacion_id FROM MENSAJES
WHERE mensaje_id = 1 OR mensaje_id = 11;

SELECT donacion_id, donacion_nombre, donacion_categoria, donacion_tipo FROM DONACIONES
WHERE donacion_id = 5 OR donacion_id = 1;

SELECT seguimiento_id, seguimiento_estado FROM SEGUIMIENTO_EVENTOS
WHERE seguimiento_id = 3 OR seguimiento_id = 8;

SELECT evento_id, evento_fecha, Seguimiento_Eventos_Seguimiento, organizacion_id FROM EVENTOS
WHERE evento_id = 2 OR evento_id = 4;

SELECT evento_id, usuario_id FROM USUARIO_EVENTOS
WHERE evento_id = 2 OR evento_id = 1;

-- ------------------------------------------------------------------------------------- --
-- 2.4.2. Y [AND] . -------------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ = __ AND __ = __ : --------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LAS COLUMNAS DE UNA TABLA Y LA INFORMACION QUE CUMPLA LA CONDICION AND
SELECT organizacion_id, organizacion_nombre, organizacion_categoria FROM ORGANIZACIONES
WHERE organizacion_categoria = 'Social' AND organizacion_nombre = 'Fundacion Esperanza';

SELECT usuario_id, usuario_apellido, usuario_nombre, usuario_estrato, organizacion_id FROM USUARIOS
WHERE usuario_estrato = 'tres' AND usuario_apellido = 'Cajamarca';

SELECT mensaje_id, mensaje_fecha, mensaje_tipo, mensaje_descripcion, organiacion_id FROM MENSAJES
WHERE mensaje_fecha = '2026-03-01' AND mensaje_tipo = 'Alerta';

SELECT donacion_id, donacion_nombre, donacion_categoria, donacion_tipo FROM DONACIONES
WHERE donacion_tipo = 'Monetaria' AND donacion_categoria = 'Educacion';

SELECT seguimiento_id, seguimiento_estado FROM SEGUIMIENTO_EVENTOS
WHERE seguimiento_id = '2' AND seguimiento_estado = 'En Proceso';

SELECT evento_id, evento_fecha, evento_categoria, Seguimiento_Eventos_Seguimiento, organizacion_id FROM EVENTOS
WHERE evento_categoria = 'Salud' AND Seguimiento_Eventos_Seguimiento = '4';

SELECT evento_id, usuario_id FROM USUARIO_EVENTOS
WHERE evento_id = '2' AND usuario_id = '1';

-- ------------------------------------------------------------------------------------- --
-- 2.4.3. NO [NOT] . ------------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ = __ AND __ = __ : --------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LAS COLUMNAS DE UNA TABLA Y LA INFORMACION SIN MOSTRAR CIERTA INFORMACION (NOT IN)
SELECT organizacion_id, organizacion_nombre, organizacion_categoria FROM ORGANIZACIONES
WHERE organizacion_categoria NOT IN ('Salud');

SELECT usuario_id, usuario_apellido, usuario_nombre, usuario_estrato, organizacion_id FROM USUARIOS
WHERE usuario_estrato NOT IN ('tres');

SELECT mensaje_id, mensaje_fecha, mensaje_tipo, mensaje_descripcion, organiacion_id FROM MENSAJES
WHERE mensaje_tipo NOT IN ('Alerta');

SELECT donacion_id, donacion_nombre, donacion_categoria, donacion_tipo, donacion_metodopago FROM DONACIONES
WHERE donacion_metodopago NOT IN ('Tarjeta');

SELECT seguimiento_id, seguimiento_estado FROM SEGUIMIENTO_EVENTOS
WHERE seguimiento_estado NOT IN ('Cancelado');

SELECT evento_id, evento_fecha, evento_categoria, Seguimiento_Eventos_Seguimiento, organizacion_id FROM EVENTOS
WHERE evento_nombre NOT IN ('Evento de Construcción');

SELECT evento_id, usuario_id FROM USUARIO_EVENTOS
WHERE usuario_id NOT IN ('2');

-- ------------------------------------------------------------------------------------- --
-- 2.5. Con Operadores de Comparación. --------------------------------------- --
--      <>, <, <=, >, >= : ------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.5.1. Diferente [<>] . ------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ <> __ : -------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA INFORMACION EN LA QUE EL VALOR SEA MAYOR O MENOR (NO =) AL VALOR ESTABLECIDO
SELECT * FROM DONACIONES WHERE donacion_valor <> 50000;
SELECT * FROM USUARIOS WHERE usuario_estrato <> '2';
-- ------------------------------------------------------------------------------------- --
-- 2.5.2. Menor que [<] . -------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ < __ : --------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA INFORMACION EN LA QUE EL VALOR SEA MENOR (NO =) AL VALOR ESTABLECIDO
SELECT * FROM DONACIONES WHERE donacion_valor < 80000;
SELECT * FROM USUARIOS WHERE usuario_estrato < '3';
-- ------------------------------------------------------------------------------------- --
-- 2.5.3. Mayor que [>] . -------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ > __ : --------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA INFORMACION EN LA QUE EL VALOR SEA MAYOR (NO =) AL VALOR ESTABLECIDO
SELECT * FROM DONACIONES WHERE donacion_valor > 80000;
SELECT * FROM USUARIOS WHERE usuario_estrato > '2';
-- ------------------------------------------------------------------------------------- --
-- 2.5.4. Menor o igual que [<=] . ----------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ > __ : --------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA INFORMACION EN LA QUE EL VALOR SEA MENOR O IGUAL AL VALOR ESTABLECIDO
SELECT * FROM DONACIONES WHERE donacion_valor <= 80000;
SELECT * FROM USUARIOS WHERE usuario_estrato <= '3';
-- ------------------------------------------------------------------------------------- --
-- 2.5.5. Mayor o igual que [>=] . ----------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ > __ : --------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA INFORMACION EN LA QUE EL VALOR SEA MAYOR O IGUAL AL VALOR ESTABLECIDO
SELECT * FROM DONACIONES WHERE donacion_valor >= 80000;
SELECT * FROM USUARIOS WHERE usuario_estrato >= '3';
-- ------------------------------------------------------------------------------------- --
-- 2.6. Con otros Operadores. ---------------------------------------------------------- --
--      LIKE, BETWEEN, IN -------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.6.1. Comodín [LIKE '_%'] . -------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ LIKE '_%' : ---------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA UNA TABLA Y MUESTRA UNA COLUMNA EN LA QUE LA INFORMACION INICIE CON 
-- LA LETRA USANDO UN COMODIN PARA EL RESTO ('%') 
SELECT * FROM ORGANIZACIONES WHERE organizacion_categoria LIKE 's%';
SELECT * FROM USUARIOS WHERE usuario_nombre LIKE 'm%';
SELECT * FROM MENSAJES WHERE mensaje_notificacion LIKE 'a%';
SELECT * FROM DONACIONES WHERE donacion_metodopago LIKE 't%';
SELECT * FROM SEGUIMIENTO_EVENTOS WHERE seguimiento_estado LIKE 'p%';
SELECT * FROM EVENTOS WHERE evento_categoria LIKE 'e%';
SELECT * FROM USUARIO_EVENTOS WHERE evento_id LIKE '1%';
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA UNA TABLA Y MUESTRA UNA COLUMNA EN LA QUE LA INFORMACION CON LA LETRA EN CIERTA UBICACION  
-- (EN ESTE CASO LA DOS) USE POSTERIORMENTE UN COMODIN ('%') PARA EL RESTO DE LA FRASE  
SELECT * FROM ORGANIZACIONES WHERE organizacion_categoria LIKE '_o%';
SELECT * FROM USUARIOS WHERE usuario_nombre LIKE '_a%';
SELECT * FROM MENSAJES WHERE mensaje_notificacion LIKE '_e%';
SELECT * FROM DONACIONES WHERE donacion_metodopago LIKE '_r%';
SELECT * FROM SEGUIMIENTO_EVENTOS WHERE seguimiento_estado LIKE '_e%';
SELECT * FROM EVENTOS WHERE evento_categoria LIKE '_a%';
SELECT * FROM USUARIO_EVENTOS WHERE evento_id LIKE '_2%';

-- ------------------------------------------------------------------------------------- --
-- 2.6.2. Entre [BETWEEN] . ------------------------------------------------------------ --
--        SELECT __ , __ FROM __ WHERE __ BETWEEN __ AND __ : -------------------------- --
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA LA TABLA Y COLUMNA EN LA QUE SEA UN RANGO DE FECHA DETERMINADA POR (AND)
SELECT * FROM EVENTOS 
WHERE evento_fecha BETWEEN '2022-05-15' AND '2022-07-10';

SELECT * FROM EVENTOS 
WHERE evento_fecha >= '2022-05-15' AND evento_fecha <= '2022-07-10';

-- ------------------------------------------------------------------------------------- --
-- 2.6.3. Lista [IN ( __ )] . ---------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ IN( __ , __ ) : ------------------------------ --
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA LA TABLA Y COLUMNA EN LA QUE CONTENGA LA INFORMACION BUSCADA
SELECT * FROM DONACIONES 
WHERE donacion_valor IN (80000);

-- ------------------------------------------------------------------------------------- --
-- 2.7. Ordenadas. --------------------------------------------------------------------- --
--      ORDER BY, ASC, DESC : ---------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.7.1. Ascendente [ASC] . ----------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ = __ ORDER BY __ ASC; : ---------------------- --
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA LA TABLA Y COLUMNA ESPECIFICA EN LA QUE SE MUESTRE 
-- UNICAMENTE SU INFORMACION DE FORMA ASCENDENTE TENIENDO EN CUENTA EL ID
SELECT * FROM ORGANIZACIONES 
WHERE organizacion_id = 2 
ORDER BY organizacion_id;

SELECT * FROM USUARIOS 
WHERE usuario_id = 3 
ORDER BY usuario_id;

SELECT * FROM MENSAJES 
WHERE mensaje_id = 1 
ORDER BY mensaje_id;

SELECT * FROM DONACIONES 
WHERE donacion_id = 2 
ORDER BY usuario_id;

SELECT * FROM SEGUIMIENTO_EVENTOS 
WHERE seguimiento_estado = "PENDIENTE"
ORDER BY seguimiento_id;

SELECT * FROM EVENTOS 
WHERE evento_categoria = "Educación"
ORDER BY evento_id;

SELECT * FROM USUARIO_EVENTOS 
WHERE usuario_id = 2 
ORDER BY evento_id;
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA UNA TABLA EN LA QUE SE MUESTRE UNICAMENTE LA INFORMACION DE 
-- LAS OPCIONES DE FORMA ASCENDENTE
SELECT * FROM ORGANIZACIONES
WHERE organizacion_id = 2 OR organizacion_id = 3 
ORDER BY organizacion_nombre ASC;

SELECT * FROM USUARIOS
WHERE usuario_id = 2 OR usuario_id = 3 
ORDER BY usuario_nombre ASC;

SELECT * FROM MENSAJES
WHERE mensaje_id = 2 OR mensaje_id = 3 
ORDER BY mensaje_tipo ASC;

SELECT * FROM DONACIONES 
WHERE donacion_metodopago = "Tarjeta" OR donacion_metodopago = "Efectivo"
ORDER BY usuario_id ASC;

SELECT * FROM SEGUIMIENTO_EVENTOS
WHERE seguimiento_id = 2 OR seguimiento_id = 3 
ORDER BY seguimiento_estado ASC;

SELECT * FROM EVENTOS
WHERE evento_id = 2 OR evento_id = 3 
ORDER BY evento_fecha ASC;

SELECT * FROM USUARIO_EVENTOS
WHERE usuario_id = 2 OR evento_id = 3 
ORDER BY usuario_id ASC;

-- ------------------------------------------------------------------------------------- --
-- 2.7.2. Descendente [DESC] . --------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ = __ ORDER BY __ DES; : ---------------------- --
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA LA TABLA Y COLUMNA ESPECIFICA EN LA QUE SE MUESTRE 
-- UNICAMENTE SU INFORMACION DE FORMA DESCENDENTE TENIENDO EN CUENTA EL ID
SELECT * FROM ORGANIZACIONES 
WHERE organizacion_id = 2 
ORDER BY organizacion_id DESC;

SELECT * FROM USUARIOS 
WHERE usuario_id = 2 
ORDER BY usuario_id DESC;

SELECT * FROM MENSAJES 
WHERE mensaje_id = 1 
ORDER BY mensaje_id DESC;

SELECT * FROM DONACIONES 
WHERE donacion_metodopago = "Tarjeta"
ORDER BY usuario_id DESC;

SELECT * FROM SEGUIMIENTO_EVENTOS 
WHERE seguimiento_estado = "PENDIENTE"
ORDER BY seguimiento_id DESC;

SELECT * FROM EVENTOS 
WHERE evento_categoria = "Educación"
ORDER BY eventos_id DESC;

SELECT * FROM USUARIO_EVENTOS 
WHERE usuario_id = 2 
ORDER BY evento_id DESC;
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA UNA TABLA EN LA QUE SE MUESTRE UNICAMENTE LA INFORMACION DE 
-- LAS OPCIONES DE FORMA DESCENDENTE
SELECT * FROM ORGANIZACIONES
WHERE organizacion_id = 2 OR organizacion_id = 3 
ORDER BY organizacion_nombre DESC;

SELECT * FROM USUARIOS
WHERE usuario_id = 2 OR usuario_id = 3 
ORDER BY usuario_nombre DESC;

SELECT * FROM MENSAJES
WHERE mensaje_id = 2 OR mensaje_id = 3 
ORDER BY mensaje_tipo DESC;

SELECT * FROM DONACIONES 
WHERE donacion_metodopago = "Tarjeta" OR donacion_metodopago = "Efectivo"
ORDER BY usuario_id DESC;

SELECT * FROM SEGUIMIENTO_EVENTOS
WHERE seguimiento_id = 2 OR seguimiento_id = 3 
ORDER BY seguimiento_estado DESC;

SELECT * FROM EVENTOS
WHERE evento_id = 2 OR evento_id = 3 
ORDER BY evento_fecha DESC;

SELECT * FROM USUARIO_EVENTOS
WHERE usuario_id = 2 OR evento_id = 3 
ORDER BY usuario_id DESC;
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA UNA TABLA EN LA QUE SE MUESTRE UNICAMENTE LA INFORMACION DE 
-- LAS OPCIONES ID DE FORMA DESCENDENTE
SELECT * FROM ORGANIZACIONES
WHERE organizacion_id = 2 OR organizacion_id = 3 
ORDER BY organizacion_categoria DESC;

SELECT * FROM USUARIOS
WHERE usuario_id = 2 OR usuario_id = 3 
ORDER BY usuario_estrato DESC;

SELECT * FROM MENSAJES
WHERE mensaje_id = 2 OR mensaje_id = 3 
ORDER BY mensaje_fecha DESC;

SELECT * FROM DONACIONES
WHERE donacion_id = 2 OR donacion_id = 3 
ORDER BY donacion_metodopago DESC;

SELECT * FROM SEGUIMIENTO_EVENTOS
WHERE seguimiento_id = 2 OR seguimiento_id = 3 
ORDER BY seguimiento_estado DESC;

SELECT * FROM EVENTOS
WHERE evento_id = 2 OR evento_id = 3 
ORDER BY evento_fecha DESC;

SELECT * FROM USUARIO_EVENTOS
WHERE usuario_id = 2 OR evento_id = 3 
ORDER BY usuario_id DESC;

-- ------------------------------------------------------------------------------------- --
-- 2.7.3. Combinadas . ----------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ = __ ORDER BY __ DES; : ---------------------- --
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA UNA TABLA EN LA QUE SE MUESTRE UNICAMENTE LA INFORMACION DE 
-- LAS OPCIONES ID DE FORMA DESCENDENTE Y OTRA INFORMACION SOLICITADA DE FORMA DESCENDENTE 
SELECT * FROM ORGANIZACIONES
WHERE organizacion_id = 2 OR organizacion_id = 3 
ORDER BY organizacion_id ASC, organizacion_contraseña DESC;

SELECT * FROM USUARIOS
WHERE usuario_id = 2 OR usuario_id = 3 
ORDER BY usuario_id ASC, usuario_contraseña DESC;

SELECT * FROM MENSAJES
WHERE mensaje_id = 2 OR mensaje_id = 3 
ORDER BY mensaje_id ASC, mensaje_tipo DESC;

SELECT * FROM DONACIONES
WHERE donacion_id = 2 OR donacion_id = 3 
ORDER BY donacion_id ASC, donacion_valor DESC;

SELECT * FROM SEGUIMIENTO_EVENTOS
WHERE seguimiento_id = 2 OR seguimiento_id = 3 
ORDER BY seguimiento_id ASC, seguimiento_estado DESC;

SELECT * FROM EVENTOS
WHERE evento_fecha  OR evento_id = 3 
ORDER BY evento_id ASC, evento_fecha DESC;

SELECT * FROM USUARIO_EVENTOS
WHERE usuario_id = 2 OR evento_id = 3 
ORDER BY usuario_id ASC, evento_id DESC;

-- ------------------------------------------------------------------------------------- --
-- 2.8. Calculadas con Funciones. ------------------------------------------------------ --
--      GROUP BY : --------------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.8.1. Suma [SUM()] . --------------------------------------------------------------- --
--        SELECT __ , SUM( __ ) FROM __ GROUP BY __ : ---------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- REALICE UNA CONSULTA EN LA QUE SE SUMEN VALORES, TOTAL DE DONACIONES, 
-- UN SOLO USUARIO, DE CADA USUARIO
SELECT SUM(donacion_valor) FROM DONACIONES;

SELECT usuario_id, SUM(donacion_valor) FROM DONACIONES 
WHERE usuario_id = '1';

SELECT usuario_id, SUM(donacion_valor) FROM DONACIONES 
GROUP BY usuario_id;

-- ------------------------------------------------------------------------------------- --
-- 2.8.2. Promedio [AVG()] . ----------------------------------------------------------- --
--        SELECT __ , AVG( __ ) FROM __ GROUP BY __ : ---------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- REALICE UNA CONSULTA EN LA QUE SE SAQUE EL PROMEDIO DE LOS VALORES, PROMEDIO DE DONACIONES, 
-- Y EL PROMEDIO DONADO DE CADA USUARIO
SELECT usuario_id, AVG(donacion_valor) FROM DONACIONES 
WHERE usuario_id = '2';

SELECT usuario_id, AVG(donacion_valor) FROM DONACIONES 
GROUP BY usuario_id;

-- ------------------------------------------------------------------------------------- --
-- 2.8.3. Máximo [MAX()] . ------------------------------------------------------------- --
--         SELECT __ , MAX( __ ) FROM __ GROUP BY __ : --------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- REALICE UNA CONSULTA EN LA QUE SE SAQUE EL VALOR MAS ALTO DE DONACIONES EN UN USUARIO
-- Y EL VALOR MAS ALTO DE DONACIONES EN CADA USUARIO
SELECT usuario_id, MAX(donacion_valor) FROM DONACIONES 
WHERE usuario_id = '3';

SELECT usuario_id, MAX(donacion_valor) FROM DONACIONES 
GROUP BY usuario_id;

-- ------------------------------------------------------------------------------------- --
-- 2.8.4. Mínimo [MIN()] . ------------------------------------------------------------- --
--          SELECT __ , MIN( __ ) FROM __ GROUP BY __ : -------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- REALICE UNA CONSULTA EN LA QUE SE SAQUE EL VALOR MAS BAJO DE DONACIONES EN UN USUARIO
-- Y EL VALOR MAS BAJO DE DONACIONES EN CADA USUARIO
SELECT usuario_id, MIN(donacion_valor) FROM DONACIONES 
WHERE usuario_id = '3';

SELECT usuario_id, MIN(donacion_valor) FROM DONACIONES 
GROUP BY usuario_id;

-- ------------------------------------------------------------------------------------- --
-- 2.8.5. Conteo [COUNT()] . ----------------------------------------------------------- --
--        SELECT __ , COUT( __ ) FROM __ GROUP BY __ : --------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- REALICE UNA CONSULTA EN LA QUE SE SAQUE LA CANTIDAD DE DONACIONES QUE REALIZO UN USUARIO
-- Y LA CANTIDAD DE DONACIONES QUE REALIZO CADA USUARIO
SELECT donacion_metodopago, COUNT(organizacion_id) FROM DONACIONES 
WHERE organizacion_id = '2'
GROUP BY donacion_metodopago;

SELECT donacion_metodopago, COUNT(organizacion_id) FROM DONACIONES 
WHERE organizacion_id
GROUP BY donacion_metodopago;

-- ------------------------------------------------------------------------------------- --
-- 2.9. Calculadas con Alias. ---------------------------------------------------------- --
--      SELECT __ , FUN( __ ) AS __ : -------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- REALICE CONSULTAS EN LA QUE CON LOS VALORES SE REALICE: (TOTAL DE DONACIONES, 
-- DONACIONES DE CADA USUARIO,
-- EL PROMEDIO DE CADA USUARIO, 
-- LA DONACION MAXIMA DE CADA USUARIO,
-- LA DONACION MAS BAJA DE CADA USUARIO,
-- LA CANTIDAD DE DONACIONES DE CADA USUARIO) Y LE PONGA UN ALIAS A CADA CONSULTA
SELECT SUM(donacion_valor) AS suma_donaciones FROM DONACIONES;

SELECT usuario_id, SUM(donacion_valor) AS suma_donaciones
FROM DONACIONES 
GROUP BY usuario_id
ORDER BY suma_donaciones ASC;

SELECT usuario_id, AVG(donacion_valor) AS promedio_donaciones
FROM DONACIONES 
GROUP BY usuario_id
ORDER BY promedio_donaciones DESC;

SELECT usuario_id, MAX(donacion_valor) AS maximo_donaciones
FROM DONACIONES 
GROUP BY usuario_id
ORDER BY maximo_donaciones DESC;

SELECT usuario_id, MIN(donacion_valor) AS minimo_donaciones
FROM DONACIONES 
GROUP BY usuario_id
ORDER BY minimo_donaciones ASC;

SELECT usuario_id, COUNT(donacion_valor) AS minimo_donaciones
FROM DONACIONES 
GROUP BY usuario_id
ORDER BY minimo_donaciones DESC;

-- ------------------------------------------------------------------------------------- --
-- 2.10. Calculadas Condicionantes. ---------------------------------------------------- --
--      SELECT __ , FUN( __ ) AS __ FROM __ GROUP BY __ HAVING __ = __ OR __ = __ : ---- --
-- ------------------------------------------------------------------------------------- --
-- CALCULA LA SUMA DE LAS DONACIONES HECHAS EN EFECTIVO POR EL USUARIO 3 Y LAS ORDENA DE FORMA ASCENDENTE.
SELECT usuario_id, donacion_metodopago, SUM(donacion_valor) AS suma_donaciones
FROM DONACIONES 
GROUP BY donacion_id HAVING usuario_id ='3' AND donacion_metodopago ='Efectivo' 
ORDER BY suma_donaciones ASC;

-- CALCULA EL PROMEDIO DE LAS DONACIONES HECHAS EN EFECTIVO POR EL USUARIO 3 Y LAS ORDENA DE FORMA ASCENDENTE.
SELECT usuario_id, donacion_metodopago, AVG(donacion_valor) AS promedio_donaciones
FROM DONACIONES 
GROUP BY donacion_id HAVING usuario_id ='3' AND donacion_metodopago ='Efectivo' 
ORDER BY promedio_donaciones ASC;

-- CALCULA LA DONACION MAS ALTA HECHA EN EFECTIVO POR EL USUARIO 3 Y LAS ORDENA DE FORMA ASCENDENTE.
SELECT usuario_id, donacion_metodopago, MAX(donacion_valor) AS promedio_donaciones
FROM DONACIONES 
GROUP BY donacion_id HAVING usuario_id ='3' AND donacion_metodopago ='Efectivo' 
ORDER BY promedio_donaciones ASC;

-- CALCULA LA DONACION MAS BAJA HECHA EN EFECTIVO POR EL USUARIO 3 Y LAS ORDENA DE FORMA ASCENDENTE.
SELECT usuario_id, donacion_metodopago, MIN(donacion_valor) AS promedio_donaciones
FROM DONACIONES 
GROUP BY donacion_id HAVING usuario_id ='3' AND donacion_metodopago ='Efectivo' 
ORDER BY promedio_donaciones ASC;

-- CALCULA LA CANTIDAD DE DONACIONES HECHAS EN EFECTIVO POR EL USUARIO 3 Y LAS ORDENA DE FORMA ASCENDENTE.
SELECT usuario_id, donacion_metodopago, COUNT(donacion_valor) AS promedio_donaciones
FROM DONACIONES 
GROUP BY donacion_id HAVING usuario_id ='3' AND donacion_metodopago ='Efectivo' 
ORDER BY promedio_donaciones ASC;

-- ------------------------------------------------------------------------------------- --
-- 2.11. Calculadas con Operadores. ---------------------------------------------------- --
--        SELECT __ , __ , __*0.19 AS __ FROM __ : ------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- SACAR EL IVA DE LA DONACCION
SELECT donacion_nombre, donacion_valor, donacion_valor * 0.19 
FROM DONACIONES;

-- SACAR EL IVA DE LA DONACION Y AGREGALE UN ALIAS
SELECT donacion_nombre, donacion_valor, donacion_valor * 0.19 AS iva_donacion 
FROM DONACIONES;

-- QUITAR LOS DECIMALES AL PORCENTAJE DEL IVA
SELECT donacion_nombre, donacion_valor, ROUND(donacion_valor*0.19,2) AS iva_donacion 
FROM DONACIONES;

-- ------------------------------------------------------------------------------------- --
-- 2.12. Calculadas con Fechas. -------------------------------------------------------- --
--       NOW(), DATE_FORMAT(), TIMESTAMPDIFF() : --------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.12.1. Fecha Actual. --------------------------------------------------------------- --
--         SELECT __ , __ , NOW() AS __ FROM __ : -------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LAS COLUMNAS __ CON LA FECHA Y HORA ACTUAL DEL SISTEMA
SELECT donacion_categoria, donacion_valor, NOW() FROM DONACIONES;

-- MUESTRA LAS COLUMNAS __ CON LA FECHA Y HORA ACTUAL DEL SISTEMA AGREGANDOLE UN ALIAS 
SELECT donacion_categoria, donacion_valor, NOW() AS fecha_actual FROM DONACIONES;

-- ------------------------------------------------------------------------------------- --
-- 2.12.2. Formato de Fecha. ----------------------------------------------------------- --
--         SELECT __ , __ , DATE_FORMAT(NOW(), '%Y-%m-%d') AS __ FROM __ : ------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LAS COLUMNAS __ CON LA FECHA ACTUAL DEL SISTEMA Y LE AGREGA UN ALIAS
SELECT usuario_id, usuario_nombre, 
DATE_FORMAT(NOW(),'%Y-%m-%d') AS fecha_actual 
FROM USUARIOS;

-- ------------------------------------------------------------------------------------- --
-- 2.12.3. Diferencia Fechas. ---------------------------------------------------------- --
--         SELECT __ , fecha , --------------------------------------------------------- --
--         DATE_FORMAT(NOW(), '%Y-%m-%d') AS __ , -------------------------------------- --
--         TIMESTAMPDIFF(DAY, __ , NOW()) AS __ , -------------------------------------- --
--         FROM __ : ------------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LOS EVENTOS Y CALCULA CUÁNTO TIEMPO HA PASADO DESDE CADA EVENTO HASTA LA 
-- FECHA ACTUAL EN AÑOS, MESES Y DÍAS.
SELECT evento_id, evento_nombre, evento_fecha,
DATE_FORMAT(NOW(),'%Y-%m-%d') AS fecha_actual,
TIMESTAMPDIFF(YEAR, evento_fecha, NOW()) AS años_transcurridos,
TIMESTAMPDIFF(MONTH, evento_fecha, NOW()) AS meses_transcurridos, 
TIMESTAMPDIFF(DAY, evento_fecha, NOW()) - 
TIMESTAMPDIFF(MONTH, evento_fecha, NOW()) * 30 AS dias_transcurridos
FROM EVENTOS;


/* ************************************************************************************* */
/* -------------------------- 3. CONSULTAS DE ACCIÓN [Final] --------------------------- */
/* ---------------------------- INSERT INTO, UPDATE, DELETE ---------------------------- */
/* ************************************************************************************* */

INSERT INTO USUARIOS VALUES
(null,'Edier','Toro',' cr 84 # 34 sur','371637224',2,'Edya123', 2);

-- INSERTAR NUEVOS DATOS PERO CON LA FECHA ACTUAL
INSERT INTO MENSAJES VALUES
(NULL ,'Notificacion',DATE_FORMAT(NOW(),'%Y-%m-%d'),'Mantenimiento Sistema',
'Sistema en mantenimiento...', 'Activa', 3, 1);

INSERT INTO EVENTOS VALUES
(NULL,DATE_FORMAT(NOW(),'%Y-%m-%d'), 'Titerestelares','Calle 45 # 34-56',
 'Infantil','Obra de teatro para niños con cancer', 3,1);

-- INSERTAR NUEVOS DATOS INCLUYECDO EL IVA
INSERT INTO DONACIONES VALUES
(null,'Fondos Maternos','Comunidad','Monetaria',
	'Tarjeta', 500000 * 0.19, 2,5);


/* ************************************************************************************* */