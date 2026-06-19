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
(NULL, 'Fundacion Esperanza', 'Calle 10 #23-45', 'contacto@fundacionesperanza.org', SHA2('clave123', 256));

INSERT INTO Usuarios VALUES
(NULL, 'Voluntario', 'Nicolay', 'Diagelo', 'Cajamarca', 'Mendoza', '371637224', 'nicolay@email.com', SHA2('nico123', 256));

INSERT INTO Donaciones VALUES
(NULL, 'Educacion', 'Monetaria', NOW(), 1, 1);

INSERT INTO Seguimiento_Eventos VALUES
(1, 1);

INSERT INTO Eventos VALUES
(NULL, 'Evento de Medio Ambiente', 'Medio Ambiente', 'Promover conciencia ambiental', '2025-06-15 10:00:00', 1, 1);

INSERT INTO Monetarios VALUES
(NULL, 'Tarjeta', '****1234', 50000.00, 1);

INSERT INTO Objetos VALUES
(NULL, 'Alimentos', 'Paquete de alimentos no perecederos', '5', 1);

-- ------------------------------------------------------------------------------------- --
-- 1.2. Actualizar. -------------------------------------------------------------------- --
--      UPDATE __ SET __ = __ WHERE __ = __ : ------------------------------------------ --
-- ------------------------------------------------------------------------------------- --
-- ACTUALIZA EL DATO DE UNA TABLA GUIANDOSE DEL ID
UPDATE Organizaciones SET 
nombre_organizaciones = 'Salud para todos'
WHERE id_Organizaciones = 1;

UPDATE Usuarios SET 
nombre1_usuario = 'Maria Alejandra'
WHERE id_Usuarios = 1;

UPDATE Donaciones SET 
categoria_donaciones = 'Salud'
WHERE id_Donaciones = 1;

UPDATE Monetarios SET 
valor_total = 75000.00
WHERE id_Monetarios = 1;

UPDATE Objetos SET 
cantidad_total = '10'
WHERE id_Objetos = 1;

UPDATE Eventos SET 
estado_evento = 0
WHERE id_Eventos = 1;

-- ------------------------------------------------------------------------------------- --
-- 1.3. Eliminar. ---------------------------------------------------------------------- --
--      DELETE FROM __ WHERE __ = __ : ------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- ELIMINAR DATOS DE UNA TABLA TENIENDO EN CUENTA EL ID
DELETE FROM Organizaciones 
WHERE id_Organizaciones = 2;

DELETE FROM Usuarios 
WHERE id_Usuarios = 2;

DELETE FROM Donaciones 
WHERE id_Donaciones = 2;

DELETE FROM Monetarios 
WHERE id_Monetarios = 2;

DELETE FROM Objetos 
WHERE id_Objetos = 2;

DELETE FROM Seguimiento_Eventos 
WHERE id_Eventos = 2 AND id_Usuarios = 2;

DELETE FROM Eventos 
WHERE id_Eventos = 2;


/* ************************************************************************************* */
/* ----------------------------- 2. CONSULTAS DE SELECCIÓN ----------------------------- */
/* --------------------------------------- SELECT -------------------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- 2.1. Generales. --------------------------------------------------------------------- --
--      SELECT * FROM __ : ------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA TABLA COMPLETA DE UNA TABLA CON SU INFORMACION
SELECT * FROM Organizaciones;
SELECT * FROM Usuarios;
SELECT * FROM Donaciones;
SELECT * FROM Seguimiento_Eventos;
SELECT * FROM Eventos;
SELECT * FROM Monetarios;
SELECT * FROM Objetos;

-- ------------------------------------------------------------------------------------- --
-- 2.2. Específicas. ------------------------------------------------------------------- --
--      SELECT __ , __ FROM __ : ------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA INFORMACION ESPECIFICANDO COLUMNAS QUE DESEA MOSTRAR
SELECT id_Organizaciones, nombre_organizaciones, direccion_organizaciones FROM Organizaciones;
SELECT id_Usuarios, nombre1_usuario, apellido1_usuario, roles FROM Usuarios;
SELECT id_Donaciones, categoria_donaciones, tipo_donaciones FROM Donaciones;
SELECT id_Eventos, id_Usuarios FROM Seguimiento_Eventos;
SELECT id_Eventos, nombre_eventos, categoria_eventos, fecha_evento FROM Eventos;
SELECT id_Monetarios, tipo_metodo, valor_total FROM Monetarios;
SELECT id_Objetos, categoria_objeto, cantidad_total FROM Objetos;

-- ------------------------------------------------------------------------------------- --
-- 2.3. Con Criterios. ----------------------------------------------------------------- --
--      SELECT __ , __ FROM __ WHERE __ = __ : ----------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LAS COLUMNAS ESPECIFICAS DE UNA TABLA GUIANDOSE POR EL ID A MOSTRAR 
SELECT id_Organizaciones, nombre_organizaciones, correo_organizaciones FROM Organizaciones
WHERE id_Organizaciones = 1;

SELECT nombre1_usuario, apellido1_usuario, correo_usuario FROM Usuarios
WHERE id_Usuarios = 1;

SELECT categoria_donaciones, tipo_donaciones, fecha_donacion FROM Donaciones
WHERE id_Donaciones = 1;

SELECT id_Eventos, id_Usuarios FROM Seguimiento_Eventos
WHERE id_Eventos = 1;

SELECT nombre_eventos, categoria_eventos, fecha_evento FROM Eventos
WHERE id_Eventos = 1;

SELECT tipo_metodo, valor_total FROM Monetarios
WHERE id_Donaciones = 1;

SELECT categoria_objeto, cantidad_total FROM Objetos
WHERE id_Donaciones = 1;

-- ------------------------------------------------------------------------------------- --
-- 2.4. Con Operadores Lógicos. -------------------------------------------------------- --
--      OR, AND, NOT : ----------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.4.1. O [OR] . --------------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ = __ OR __ = __ : ---------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA INFOMACION DE CADA UNO DE LOS ID SEGUN LAS INDICACIONES DE LAS COLUMNAS A MOSTRAR UTILIZANDO EL OR
SELECT id_Organizaciones, nombre_organizaciones FROM Organizaciones
WHERE id_Organizaciones = 1 OR id_Organizaciones = 2;

SELECT id_Usuarios, nombre1_usuario, roles FROM Usuarios
WHERE id_Usuarios = 1 OR id_Usuarios = 2;

SELECT id_Donaciones, categoria_donaciones FROM Donaciones
WHERE id_Donaciones = 1 OR id_Donaciones = 2;

SELECT id_Eventos, id_Usuarios FROM Seguimiento_Eventos
WHERE id_Eventos = 1 OR id_Eventos = 2;

SELECT id_Eventos, nombre_eventos FROM Eventos
WHERE id_Eventos = 1 OR id_Eventos = 2;

SELECT id_Monetarios, valor_total FROM Monetarios
WHERE id_Monetarios = 1 OR id_Monetarios = 2;

SELECT id_Objetos, categoria_objeto FROM Objetos
WHERE id_Objetos = 1 OR id_Objetos = 2;

-- ------------------------------------------------------------------------------------- --
-- 2.4.2. Y [AND] . -------------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ = __ AND __ = __ : --------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LAS COLUMNAS DE UNA TABLA Y LA INFORMACION QUE CUMPLA LA CONDICION AND
SELECT id_Organizaciones, nombre_organizaciones FROM Organizaciones
WHERE nombre_organizaciones = 'Fundacion Esperanza' AND direccion_organizaciones = 'Calle 10 #23-45';

SELECT id_Usuarios, nombre1_usuario, roles FROM Usuarios
WHERE roles = 'Voluntario' AND telefono_usuario = '371637224';

SELECT id_Donaciones, categoria_donaciones, tipo_donaciones FROM Donaciones
WHERE categoria_donaciones = 'Educacion' AND tipo_donaciones = 'Monetaria';

SELECT id_Eventos, id_Usuarios FROM Seguimiento_Eventos
WHERE id_Eventos = 1 AND id_Usuarios = 1;

SELECT id_Eventos, nombre_eventos, estado_evento FROM Eventos
WHERE estado_evento = 1 AND categoria_eventos = 'Medio Ambiente';

SELECT id_Monetarios, tipo_metodo, valor_total FROM Monetarios
WHERE tipo_metodo = 'Tarjeta' AND valor_total > 0;

SELECT id_Objetos, categoria_objeto FROM Objetos
WHERE categoria_objeto = 'Alimentos' AND cantidad_total > 0;

-- ------------------------------------------------------------------------------------- --
-- 2.4.3. NO [NOT] . ------------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ = __ AND __ = __ : --------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LAS COLUMNAS DE UNA TABLA Y LA INFORMACION SIN MOSTRAR CIERTA INFORMACION (NOT IN)
SELECT id_Organizaciones, nombre_organizaciones FROM Organizaciones
WHERE nombre_organizaciones NOT IN ('Salud para todos');

SELECT id_Usuarios, nombre1_usuario, roles FROM Usuarios
WHERE roles NOT IN ('Admin');

SELECT id_Donaciones, categoria_donaciones FROM Donaciones
WHERE categoria_donaciones NOT IN ('Salud');

SELECT id_Eventos, id_Usuarios FROM Seguimiento_Eventos
WHERE id_Usuarios NOT IN (2);

SELECT id_Eventos, nombre_eventos, estado_evento FROM Eventos
WHERE estado_evento NOT IN (0);

SELECT id_Monetarios, tipo_metodo FROM Monetarios
WHERE tipo_metodo NOT IN ('Efectivo');

SELECT id_Objetos, categoria_objeto FROM Objetos
WHERE categoria_objeto NOT IN ('Ropa');

-- ------------------------------------------------------------------------------------- --
-- 2.5. Con Operadores de Comparación. ------------------------------------------------- --
--      <>, <, <=, >, >= : ------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.5.1. Diferente [<>] . ------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ <> __ : -------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA INFORMACION EN LA QUE EL VALOR SEA MAYOR O MENOR (NO =) AL VALOR ESTABLECIDO
SELECT * FROM Monetarios WHERE valor_total <> 50000;
SELECT * FROM Usuarios WHERE id_Usuarios <> 1;
SELECT * FROM Eventos WHERE estado_evento <> 1;

-- ------------------------------------------------------------------------------------- --
-- 2.5.2. Menor que [<] . -------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ < __ : --------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA INFORMACION EN LA QUE EL VALOR SEA MENOR (NO =) AL VALOR ESTABLECIDO
SELECT * FROM Monetarios WHERE valor_total < 80000;
SELECT * FROM Eventos WHERE id_Eventos < 5;
SELECT * FROM Donaciones WHERE id_Donaciones < 3;

-- ------------------------------------------------------------------------------------- --
-- 2.5.3. Mayor que [>] . -------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ > __ : --------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA INFORMACION EN LA QUE EL VALOR SEA MAYOR (NO =) AL VALOR ESTABLECIDO
SELECT * FROM Monetarios WHERE valor_total > 80000;
SELECT * FROM Eventos WHERE id_Eventos > 2;
SELECT * FROM Usuarios WHERE id_Usuarios > 1;

-- ------------------------------------------------------------------------------------- --
-- 2.5.4. Menor o igual que [<=] . ----------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ > __ : --------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA INFORMACION EN LA QUE EL VALOR SEA MENOR O IGUAL AL VALOR ESTABLECIDO
SELECT * FROM Monetarios WHERE valor_total <= 80000;
SELECT * FROM Eventos WHERE id_Eventos <= 3;
SELECT * FROM Donaciones WHERE id_Donaciones <= 2;

-- ------------------------------------------------------------------------------------- --
-- 2.5.5. Mayor o igual que [>=] . ----------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ > __ : --------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LA INFORMACION EN LA QUE EL VALOR SEA MAYOR O IGUAL AL VALOR ESTABLECIDO
SELECT * FROM Monetarios WHERE valor_total >= 80000;
SELECT * FROM Eventos WHERE id_Eventos >= 3;
SELECT * FROM Usuarios WHERE id_Usuarios >= 1;

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
SELECT * FROM Organizaciones WHERE nombre_organizaciones LIKE 'F%';
SELECT * FROM Usuarios WHERE nombre1_usuario LIKE 'M%';
SELECT * FROM Donaciones WHERE categoria_donaciones LIKE 'E%';
SELECT * FROM Seguimiento_Eventos WHERE id_Eventos LIKE '1%';
SELECT * FROM Eventos WHERE categoria_eventos LIKE 'M%';
SELECT * FROM Monetarios WHERE tipo_metodo LIKE 'T%';
SELECT * FROM Objetos WHERE categoria_objeto LIKE 'A%';

-- ------------------------------------------------------------------------------------- --
-- SELECCIONA UNA TABLA Y MUESTRA UNA COLUMNA EN LA QUE LA INFORMACION CON LA LETRA EN CIERTA UBICACION  
-- (EN ESTE CASO LA DOS) USE POSTERIORMENTE UN COMODIN ('%') PARA EL RESTO DE LA FRASE  
SELECT * FROM Organizaciones WHERE nombre_organizaciones LIKE '_a%';
SELECT * FROM Usuarios WHERE nombre1_usuario LIKE '_a%';
SELECT * FROM Donaciones WHERE categoria_donaciones LIKE '_d%';
SELECT * FROM Seguimiento_Eventos WHERE id_Eventos LIKE '_1%';
SELECT * FROM Eventos WHERE categoria_eventos LIKE '_e%';
SELECT * FROM Monetarios WHERE tipo_metodo LIKE '_a%';
SELECT * FROM Objetos WHERE categoria_objeto LIKE '_l%';

-- ------------------------------------------------------------------------------------- --
-- 2.6.2. Entre [BETWEEN] . ------------------------------------------------------------ --
--        SELECT __ , __ FROM __ WHERE __ BETWEEN __ AND __ : -------------------------- --
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA LA TABLA Y COLUMNA EN LA QUE SEA UN RANGO DE FECHA DETERMINADA POR (AND)
SELECT * FROM Eventos 
WHERE fecha_evento BETWEEN '2025-01-01' AND '2025-12-31';

SELECT * FROM Eventos 
WHERE fecha_evento >= '2025-01-01' AND fecha_evento <= '2025-12-31';

SELECT * FROM Monetarios WHERE valor_total BETWEEN 50000 AND 200000;

-- ------------------------------------------------------------------------------------- --
-- 2.6.3. Lista [IN ( __ )] . ---------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ IN( __ , __ ) : ------------------------------ --
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA LA TABLA Y COLUMNA EN LA QUE CONTENGA LA INFORMACION BUSCADA
SELECT * FROM Monetarios WHERE valor_total IN (50000, 75000, 100000);
SELECT * FROM Usuarios WHERE roles IN ('Voluntario', 'Beneficiario');
SELECT * FROM Eventos WHERE estado_evento IN (1);

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
SELECT * FROM Organizaciones 
WHERE id_Organizaciones = 1 
ORDER BY id_Organizaciones ASC;

SELECT * FROM Usuarios 
WHERE id_Usuarios = 1 
ORDER BY id_Usuarios ASC;

SELECT * FROM Donaciones 
WHERE id_Donaciones = 1 
ORDER BY id_Donaciones ASC;

SELECT * FROM Seguimiento_Eventos 
WHERE id_Eventos = 1
ORDER BY id_Eventos ASC;

SELECT * FROM Eventos 
WHERE estado_evento = 1
ORDER BY id_Eventos ASC;

SELECT * FROM Monetarios 
WHERE id_Donaciones = 1
ORDER BY id_Monetarios ASC;

SELECT * FROM Objetos 
WHERE id_Donaciones = 1 
ORDER BY id_Objetos ASC;

-- ------------------------------------------------------------------------------------- --
-- SELECCIONA UNA TABLA EN LA QUE SE MUESTRE UNICAMENTE LA INFORMACION DE 
-- LAS OPCIONES DE FORMA ASCENDENTE
SELECT * FROM Organizaciones
WHERE id_Organizaciones = 1 OR id_Organizaciones = 2 
ORDER BY nombre_organizaciones ASC;

SELECT * FROM Usuarios
WHERE id_Usuarios = 1 OR id_Usuarios = 2 
ORDER BY nombre1_usuario ASC;

SELECT * FROM Donaciones
WHERE id_Donaciones = 1 OR id_Donaciones = 2 
ORDER BY categoria_donaciones ASC;

SELECT * FROM Seguimiento_Eventos
WHERE id_Eventos = 1 OR id_Eventos = 2 
ORDER BY id_Usuarios ASC;

SELECT * FROM Eventos
WHERE id_Eventos = 1 OR id_Eventos = 2 
ORDER BY nombre_eventos ASC;

SELECT * FROM Monetarios
WHERE id_Monetarios = 1 OR id_Monetarios = 2 
ORDER BY valor_total ASC;

SELECT * FROM Objetos
WHERE id_Objetos = 1 OR id_Objetos = 2 
ORDER BY categoria_objeto ASC;

-- ------------------------------------------------------------------------------------- --
-- 2.7.2. Descendente [DESC] . --------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ = __ ORDER BY __ DESC; : ---------------------- --
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA LA TABLA Y COLUMNA ESPECIFICA EN LA QUE SE MUESTRE 
-- UNICAMENTE SU INFORMACION DE FORMA DESCENDENTE TENIENDO EN CUENTA EL ID
SELECT * FROM Organizaciones 
WHERE id_Organizaciones = 1 
ORDER BY id_Organizaciones DESC;

SELECT * FROM Usuarios 
WHERE id_Usuarios = 1 
ORDER BY id_Usuarios DESC;

SELECT * FROM Donaciones 
WHERE id_Donaciones = 1 
ORDER BY id_Donaciones DESC;

SELECT * FROM Seguimiento_Eventos 
WHERE id_Eventos = 1
ORDER BY id_Eventos DESC;

SELECT * FROM Eventos 
WHERE estado_evento = 1
ORDER BY id_Eventos DESC;

SELECT * FROM Monetarios 
WHERE valor_total > 0
ORDER BY valor_total DESC;

SELECT * FROM Objetos 
WHERE id_Donaciones = 1 
ORDER BY id_Objetos DESC;

-- ------------------------------------------------------------------------------------- --
-- SELECCIONA UNA TABLA EN LA QUE SE MUESTRE UNICAMENTE LA INFORMACION DE 
-- LAS OPCIONES DE FORMA DESCENDENTE
SELECT * FROM Organizaciones
WHERE id_Organizaciones = 1 OR id_Organizaciones = 2 
ORDER BY nombre_organizaciones DESC;

SELECT * FROM Usuarios
WHERE id_Usuarios = 1 OR id_Usuarios = 2 
ORDER BY nombre1_usuario DESC;

SELECT * FROM Donaciones
WHERE id_Donaciones = 1 OR id_Donaciones = 2 
ORDER BY categoria_donaciones DESC;

SELECT * FROM Seguimiento_Eventos
WHERE id_Eventos = 1 OR id_Eventos = 2 
ORDER BY id_Usuarios DESC;

SELECT * FROM Eventos
WHERE id_Eventos = 1 OR id_Eventos = 2 
ORDER BY nombre_eventos DESC;

SELECT * FROM Monetarios
WHERE id_Monetarios = 1 OR id_Monetarios = 2 
ORDER BY valor_total DESC;

SELECT * FROM Objetos
WHERE id_Objetos = 1 OR id_Objetos = 2 
ORDER BY categoria_objeto DESC;

-- ------------------------------------------------------------------------------------- --
-- SELECCIONA UNA TABLA EN LA QUE SE MUESTRE UNICAMENTE LA INFORMACION DE 
-- LAS OPCIONES ID DE FORMA DESCENDENTE
SELECT * FROM Organizaciones
WHERE id_Organizaciones = 1 OR id_Organizaciones = 2 
ORDER BY nombre_organizaciones DESC;

SELECT * FROM Usuarios
WHERE id_Usuarios = 1 OR id_Usuarios = 2 
ORDER BY apellido1_usuario DESC;

SELECT * FROM Donaciones
WHERE id_Donaciones = 1 OR id_Donaciones = 2 
ORDER BY fecha_donacion DESC;

SELECT * FROM Seguimiento_Eventos
WHERE id_Eventos = 1 OR id_Eventos = 2 
ORDER BY id_Usuarios DESC;

SELECT * FROM Eventos
WHERE id_Eventos = 1 OR id_Eventos = 2 
ORDER BY fecha_evento DESC;

SELECT * FROM Monetarios
WHERE id_Monetarios = 1 OR id_Monetarios = 2 
ORDER BY valor_total DESC;

SELECT * FROM Objetos
WHERE id_Objetos = 1 OR id_Objetos = 2 
ORDER BY cantidad_total DESC;

-- ------------------------------------------------------------------------------------- --
-- 2.7.3. Combinadas . ----------------------------------------------------------------- --
--        SELECT __ , __ FROM __ WHERE __ = __ ORDER BY __ ASC, __ DESC; : ------------- --
-- ------------------------------------------------------------------------------------- --
-- SELECCIONA UNA TABLA EN LA QUE SE MUESTRE UNICAMENTE LA INFORMACION DE 
-- LAS OPCIONES ID DE FORMA DESCENDENTE Y OTRA INFORMACION SOLICITADA DE FORMA DESCENDENTE 
SELECT * FROM Organizaciones
WHERE id_Organizaciones = 1 OR id_Organizaciones = 2 
ORDER BY id_Organizaciones ASC, nombre_organizaciones DESC;

SELECT * FROM Usuarios
WHERE id_Usuarios = 1 OR id_Usuarios = 2 
ORDER BY id_Usuarios ASC, apellido1_usuario DESC;

SELECT * FROM Donaciones
WHERE id_Donaciones = 1 OR id_Donaciones = 2 
ORDER BY id_Donaciones ASC, fecha_donacion DESC;

SELECT * FROM Seguimiento_Eventos
WHERE id_Eventos = 1 OR id_Eventos = 2 
ORDER BY id_Eventos ASC, id_Usuarios DESC;

SELECT * FROM Eventos
WHERE id_Eventos = 1 OR id_Eventos = 2 
ORDER BY id_Eventos ASC, fecha_evento DESC;

SELECT * FROM Monetarios
WHERE id_Monetarios = 1 OR id_Monetarios = 2 
ORDER BY id_Monetarios ASC, valor_total DESC;

SELECT * FROM Objetos
WHERE id_Objetos = 1 OR id_Objetos = 2 
ORDER BY id_Objetos ASC, cantidad_total DESC;

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
SELECT SUM(valor_total) FROM Monetarios;

SELECT id_Donaciones, SUM(valor_total) FROM Monetarios 
WHERE id_Donaciones = '1';

SELECT id_Donaciones, SUM(valor_total) FROM Monetarios 
GROUP BY id_Donaciones;

-- ------------------------------------------------------------------------------------- --
-- 2.8.2. Promedio [AVG()] . ----------------------------------------------------------- --
--        SELECT __ , AVG( __ ) FROM __ GROUP BY __ : ---------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- REALICE UNA CONSULTA EN LA QUE SE SAQUE EL PROMEDIO DE LOS VALORES, PROMEDIO DE DONACIONES, 
-- Y EL PROMEDIO DONADO DE CADA USUARIO
SELECT id_Donaciones, AVG(valor_total) FROM Monetarios 
WHERE id_Donaciones = '1';

SELECT id_Donaciones, AVG(valor_total) FROM Monetarios 
GROUP BY id_Donaciones;

-- ------------------------------------------------------------------------------------- --
-- 2.8.3. Máximo [MAX()] . ------------------------------------------------------------- --
--         SELECT __ , MAX( __ ) FROM __ GROUP BY __ : --------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- REALICE UNA CONSULTA EN LA QUE SE SAQUE EL VALOR MAS ALTO DE DONACIONES EN UN USUARIO
-- Y EL VALOR MAS ALTO DE DONACIONES EN CADA USUARIO
SELECT id_Donaciones, MAX(valor_total) FROM Monetarios 
WHERE id_Donaciones = '1';

SELECT id_Donaciones, MAX(valor_total) FROM Monetarios 
GROUP BY id_Donaciones;

-- ------------------------------------------------------------------------------------- --
-- 2.8.4. Mínimo [MIN()] . ------------------------------------------------------------- --
--          SELECT __ , MIN( __ ) FROM __ GROUP BY __ : -------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- REALICE UNA CONSULTA EN LA QUE SE SAQUE EL VALOR MAS BAJO DE DONACIONES EN UN USUARIO
-- Y EL VALOR MAS BAJO DE DONACIONES EN CADA USUARIO
SELECT id_Donaciones, MIN(valor_total) FROM Monetarios 
WHERE id_Donaciones = '1';

SELECT id_Donaciones, MIN(valor_total) FROM Monetarios 
GROUP BY id_Donaciones;

-- ------------------------------------------------------------------------------------- --
-- 2.8.5. Conteo [COUNT()] . ----------------------------------------------------------- --
--        SELECT __ , COUNT( __ ) FROM __ GROUP BY __ : -------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- REALICE UNA CONSULTA EN LA QUE SE SAQUE LA CANTIDAD DE DONACIONES QUE REALIZO UN USUARIO
-- Y LA CANTIDAD DE DONACIONES QUE REALIZO CADA USUARIO
SELECT tipo_metodo, COUNT(id_Donaciones) FROM Monetarios 
WHERE id_Donaciones = '1'
GROUP BY tipo_metodo;

SELECT tipo_metodo, COUNT(id_Donaciones) FROM Monetarios 
WHERE id_Donaciones IS NOT NULL
GROUP BY tipo_metodo;

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
SELECT SUM(valor_total) AS suma_donaciones FROM Monetarios;

SELECT id_Donaciones, SUM(valor_total) AS suma_donaciones
FROM Monetarios 
GROUP BY id_Donaciones
ORDER BY suma_donaciones ASC;

SELECT id_Donaciones, AVG(valor_total) AS promedio_donaciones
FROM Monetarios 
GROUP BY id_Donaciones
ORDER BY promedio_donaciones DESC;

SELECT id_Donaciones, MAX(valor_total) AS maximo_donaciones
FROM Monetarios 
GROUP BY id_Donaciones
ORDER BY maximo_donaciones DESC;

SELECT id_Donaciones, MIN(valor_total) AS minimo_donaciones
FROM Monetarios 
GROUP BY id_Donaciones
ORDER BY minimo_donaciones ASC;

SELECT id_Donaciones, COUNT(valor_total) AS cantidad_donaciones
FROM Monetarios 
GROUP BY id_Donaciones
ORDER BY cantidad_donaciones DESC;

-- ------------------------------------------------------------------------------------- --
-- 2.10. Calculadas Condicionantes. ---------------------------------------------------- --
--      SELECT __ , FUN( __ ) AS __ FROM __ GROUP BY __ HAVING __ = __ OR __ = __ : ---- --
-- ------------------------------------------------------------------------------------- --
-- CALCULA LA SUMA DE LAS DONACIONES HECHAS EN TARJETA PARA LA DONACION 1
SELECT id_Donaciones, tipo_metodo, SUM(valor_total) AS suma_donaciones
FROM Monetarios 
GROUP BY id_Monetarios HAVING id_Donaciones = 1 AND tipo_metodo = 'Tarjeta' 
ORDER BY suma_donaciones ASC;

-- CALCULA EL PROMEDIO DE LAS DONACIONES HECHAS EN TARJETA PARA LA DONACION 1
SELECT id_Donaciones, tipo_metodo, AVG(valor_total) AS promedio_donaciones
FROM Monetarios 
GROUP BY id_Monetarios HAVING id_Donaciones = 1 AND tipo_metodo = 'Tarjeta' 
ORDER BY promedio_donaciones ASC;

-- CALCULA LA DONACION MAS ALTA HECHA EN TARJETA PARA LA DONACION 1
SELECT id_Donaciones, tipo_metodo, MAX(valor_total) AS maximo_donaciones
FROM Monetarios 
GROUP BY id_Monetarios HAVING id_Donaciones = 1 AND tipo_metodo = 'Tarjeta' 
ORDER BY maximo_donaciones ASC;

-- CALCULA LA DONACION MAS BAJA HECHA EN TARJETA PARA LA DONACION 1
SELECT id_Donaciones, tipo_metodo, MIN(valor_total) AS minimo_donaciones
FROM Monetarios 
GROUP BY id_Monetarios HAVING id_Donaciones = 1 AND tipo_metodo = 'Tarjeta' 
ORDER BY minimo_donaciones ASC;

-- CALCULA LA CANTIDAD DE DONACIONES HECHAS EN TARJETA PARA LA DONACION 1
SELECT id_Donaciones, tipo_metodo, COUNT(valor_total) AS cantidad_donaciones
FROM Monetarios 
GROUP BY id_Monetarios HAVING id_Donaciones = 1 AND tipo_metodo = 'Tarjeta' 
ORDER BY cantidad_donaciones ASC;

-- ------------------------------------------------------------------------------------- --
-- 2.11. Calculadas con Operadores. ---------------------------------------------------- --
--        SELECT __ , __ , ROUND(__*0.19,2) AS __ FROM __ : ---------------------------- --
-- ------------------------------------------------------------------------------------- --
-- SACAR EL IVA DE LA DONACION
SELECT valor_total, valor_total * 0.19 FROM Monetarios;

-- SACAR EL IVA DE LA DONACION Y AGREGALE UN ALIAS
SELECT valor_total, valor_total * 0.19 AS iva_donacion FROM Monetarios;

-- QUITAR LOS DECIMALES AL PORCENTAJE DEL IVA
SELECT valor_total, ROUND(valor_total * 0.19, 2) AS iva_donacion FROM Monetarios;

-- ------------------------------------------------------------------------------------- --
-- 2.12. Calculadas con Fechas. -------------------------------------------------------- --
--       NOW(), DATE_FORMAT(), TIMESTAMPDIFF() : --------------------------------------- --
-- ------------------------------------------------------------------------------------- --

-- ------------------------------------------------------------------------------------- --
-- 2.12.1. Fecha Actual. --------------------------------------------------------------- --
--         SELECT __ , __ , NOW() AS __ FROM __ : -------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LAS COLUMNAS __ CON LA FECHA Y HORA ACTUAL DEL SISTEMA
SELECT categoria_donaciones, fecha_donacion, NOW() FROM Donaciones;

-- MUESTRA LAS COLUMNAS __ CON LA FECHA Y HORA ACTUAL DEL SISTEMA AGREGANDOLE UN ALIAS 
SELECT categoria_donaciones, fecha_donacion, NOW() AS fecha_actual FROM Donaciones;

-- ------------------------------------------------------------------------------------- --
-- 2.12.2. Formato de Fecha. ----------------------------------------------------------- --
--         SELECT __ , __ , DATE_FORMAT(NOW(), '%Y-%m-%d') AS __ FROM __ : ------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LAS COLUMNAS __ CON LA FECHA ACTUAL DEL SISTEMA Y LE AGREGA UN ALIAS
SELECT id_Usuarios, nombre1_usuario, 
DATE_FORMAT(NOW(), '%Y-%m-%d') AS fecha_actual 
FROM Usuarios;

-- ------------------------------------------------------------------------------------- --
-- 2.12.3. Diferencia Fechas. ---------------------------------------------------------- --
--         SELECT __ , fecha , --------------------------------------------------------- --
--         DATE_FORMAT(NOW(), '%Y-%m-%d') AS __ , -------------------------------------- --
--         TIMESTAMPDIFF(DAY, __ , NOW()) AS __ , -------------------------------------- --
--         FROM __ : ------------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- MUESTRA LOS EVENTOS Y CALCULA CUÁNTO TIEMPO HA PASADO DESDE CADA EVENTO HASTA LA 
-- FECHA ACTUAL EN AÑOS, MESES Y DÍAS.
SELECT id_Eventos, nombre_eventos, fecha_evento,
DATE_FORMAT(NOW(), '%Y-%m-%d') AS fecha_actual,
TIMESTAMPDIFF(YEAR, fecha_evento, NOW()) AS años_transcurridos,
TIMESTAMPDIFF(MONTH, fecha_evento, NOW()) AS meses_transcurridos, 
TIMESTAMPDIFF(DAY, fecha_evento, NOW()) AS dias_transcurridos
FROM Eventos;


/* ************************************************************************************* */
/* -------------------------- 3. CONSULTAS DE ACCIÓN [Final] --------------------------- */
/* ---------------------------- INSERT INTO, UPDATE, DELETE ---------------------------- */
/* ************************************************************************************* */

INSERT INTO Usuarios VALUES
(NULL, 'Voluntario', 'Edier', NULL, 'Toro', NULL, '3001234567', 'edier@email.com', SHA2('edya123', 256));

-- INSERTAR NUEVOS DATOS PERO CON LA FECHA ACTUAL
INSERT INTO Donaciones (categoria_donaciones, tipo_donaciones, fecha_donacion, id_Organizaciones, id_Usuarios) 
VALUES ('Comunitaria', 'Monetaria', NOW(), 1, 1);

INSERT INTO Eventos (nombre_eventos, categoria_eventos, descripcion_eventos, fecha_evento, estado_evento, id_Organizaciones) 
VALUES ('Titerestelares', 'Infantil', 'Obra de teatro para niños con cancer', NOW(), 1, 1);

-- INSERTAR NUEVOS DATOS INCLUYENDO EL IVA
INSERT INTO Monetarios (tipo_metodo, num_cuenta, valor_total, id_Donaciones) 
VALUES ('Tarjeta', '****5678', ROUND(500000 * 1.19, 2), 1);


/* ************************************************************************************* */
/* ------------------------------- FIN DEL ARCHIVO ------------------------------------- */
/* ************************************************************************************* */