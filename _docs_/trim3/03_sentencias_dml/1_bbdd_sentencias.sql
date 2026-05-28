/* ************************************************************************************* */
/* ---------------------------------------- DDL ---------------------------------------- */
/* ----------------------------- DATA DEFINITION LANGUAGE ------------------------------ */
/* -------------------------- LENGUAJE DE DEFINICIÓN DE DATOS -------------------------- */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
/* ------------------------------------------------------------------------------------- */
/* 01. Mostrar BBDDs : .................... SHOW DATABASES                               */
/* 02. Usar BBDD : ........................ USE __                                       */
/* 03. Eliminar BBDD : .................... DROP DATABASE __                             */
/* 04. Mostrar Tablas : ................... SHOW TABLES __.                              */
/* 05. Mostar Columnas : .................. SHOW COLUMNS FROM __ . DESCRIBE __           */
/* 06. Agregar Columna : .................. ALTER TABLE __ ADD __ __                     */
/* 07. Renombrar Columna : ................ ALTER TABLE __ CHANGE __ __                  */
/* 08. Eliminar Columna : ................. ALTER TABLE __ DROP __                       */
/* 09. Agregar Valor x Defecto Columna : .. ALTER TABLE __ ALTER __ SET DEFAULT __       */
/* 10. Eliminar Valor x Defecto Columna : . ALTER TABLE __ ALTER __ DROP DEFAULT         */
/* 11. Mostrar Creación Tabla : ........... SHOW CREATE TABLE __                         */
/* 12. Eliminar Restricción : ............. ALTER TABLE __ DROP CONSTRAINT __            */
/* 13. Eliminar Índice : .................. ALTER TABLE __ DROP INDEX __                 */
/* 14. Eliminar Llave Primaria : .......... ALTER TABLE __ DROP PRIMARY KEY              */
/* 15. Limpiar Registros : ................ TRUNCATE __                                  */
/* 16. Eliminar Tabla : ................... DROP TABLE __                                */
/* 17. Crear Tabla : ...................... CREATE TABLE __ ( __ , __ )                  */
/* 18. Renombrar Tabla : .................. RENAME TABLE __ TO __                        */
/* 19. Crear Llave Primaria : ............. ALTER TABLE __ ADD PRIMARY KEY ( __ )        */
/* 20. Crear Índice Campo : ............... CREATE INDEX __ ON __ ( __ )                 */
/* 21. Crear Índice Multicampo : .......... CREATE INDEX _ ON _ ( __ , __ )              */
/* 22. Crear Índice Único : ............... CREATE UNIQUE INDEX __ ON __ ( __ )          */
/* 23. Crear Restricción : ................ ALTER TABLE __ ADD CONSTRAINT __             */
/*     FOREIGN KEY ( __ ) REFERENCES __ ( __ ) ON DELETE CASCADE ON UPDATE CASCADE       */
/* ------------------------------------------------------------------------------------- */
/* BIBLIOGRAFÍA                                                                          */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
/* EN CONSOLA: XAMPP / SHELL / cd mysql/bin / mysql -h localhost -u root -p / ENTER      */
/* ************************************************************************************* */

/* ************************************************************************************* */
/* ---------------------------------------- DDL ---------------------------------------- */
/* ----------------------------- DATA DEFINITION LANGUAGE ------------------------------ */
/* -------------------------- LENGUAJE DE DEFINICIÓN DE DATOS -------------------------- */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */

-- ------------------------------------------------------------------------------------- --
-- 01. Mostrar BBDDs. ------------------------------------------------------------------ --
--     SHOW DATABASES : ---------------------------------------------------------------- -- 
-- ------------------------------------------------------------------------------------- --
SHOW DATABASES;

-- ------------------------------------------------------------------------------------- --
-- 02. Usar BBDD. ---------------------------------------------------------------------- --
--     USE __ : ------------------------------------------------------------------------ --
-- ------------------------------------------------------------------------------------- --
USE give;

-- ------------------------------------------------------------------------------------- --
-- 03. Eliminar BBDD. ------------------------------------------------------------------ --
--     DROP DATABASE __ : -------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- DROP DATABASE give;

-- ------------------------------------------------------------------------------------- --
-- 04. Mostrar Tablas. ----------------------------------------------------------------- --
--     SHOW TABLES __ : ---------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
SHOW TABLES;

-- ------------------------------------------------------------------------------------- --
-- 05. Mostar Columnas. ---------------------------------------------------------------- --
--     SHOW COLUMNS FROM __ . DESCRIBE __ : -------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
SHOW COLUMNS FROM Usuarios;
DESCRIBE Usuarios;

-- ------------------------------------------------------------------------------------- --
-- 06. Agregar Columna. ---------------------------------------------------------------- --
--     ALTER TABLE __ ADD __ __ : ------------------------------------------------------ --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE Usuarios ADD usuario_genero VARCHAR(20);

-- ------------------------------------------------------------------------------------- --
-- 07. Renombrar Columna. -------------------------------------------------------------- --
--     ALTER TABLE __ CHANGE __ __ : --------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE Usuarios CHANGE usuario_genero usuario_genero2 VARCHAR(20);

-- ------------------------------------------------------------------------------------- --
-- 08. Eliminar Columna. --------------------------------------------------------------- --
--     ALTER TABLE __ DROP __ : -------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE Usuarios DROP usuario_genero2;

-- ------------------------------------------------------------------------------------- --
-- 09. Agregar Valor x Defecto Columna. ------------------------------------------------ --
--     ALTER TABLE __ ALTER __ SET DEFAULT __ : ---------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE Usuarios ALTER COLUMN nombre1_usuario SET DEFAULT 'Sin nombre';

-- ------------------------------------------------------------------------------------- --
-- 10. Eliminar Valor x Defecto Columna. ----------------------------------------------- --
--     ALTER TABLE __ ALTER __ DROP DEFAULT : ------------------------------------------ --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE Usuarios ALTER COLUMN nombre1_usuario DROP DEFAULT;

-- ------------------------------------------------------------------------------------- --
-- 11. Mostrar Creación Tabla. --------------------------------------------------------- --
--     SHOW CREATE TABLE __ : ---------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
SHOW CREATE TABLE Usuarios;
SHOW CREATE TABLE Organizaciones;
SHOW CREATE TABLE Donaciones;

-- ------------------------------------------------------------------------------------- --
-- 12. Eliminar Restricción. ----------------------------------------------------------- --
--     ALTER TABLE __ DROP CONSTRAINT __ : --------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE Donaciones DROP FOREIGN KEY fk_Donaciones_Organizaciones;
ALTER TABLE Donaciones DROP FOREIGN KEY fk_Donaciones_Usuarios;
ALTER TABLE Eventos DROP FOREIGN KEY fk_Eventos_Organizaciones;
ALTER TABLE Monetarios DROP FOREIGN KEY fk_Monetarios_Donaciones;
ALTER TABLE Objetos DROP FOREIGN KEY fk_Objetos_Donaciones;
ALTER TABLE Seguimiento_Eventos DROP FOREIGN KEY fk_Seguimiento_Eventos_Eventos;
ALTER TABLE Seguimiento_Eventos DROP FOREIGN KEY fk_Seguimiento_Eventos_Usuarios;

-- ------------------------------------------------------------------------------------- --
-- 13. Eliminar Índice. ---------------------------------------------------------------- --
--     ALTER TABLE __ DROP INDEX __ : -------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE Donaciones DROP INDEX ind_fk_Donaciones_Organizaciones;
ALTER TABLE Donaciones DROP INDEX ind_fk_Donaciones_usuarios;
ALTER TABLE Eventos DROP INDEX ind_fk_Eventos_Organizaciones;
ALTER TABLE Monetarios DROP INDEX ind_fk_Monetarios_Donaciones;
ALTER TABLE Objetos DROP INDEX ind_fk_Objetos_Donaciones;
ALTER TABLE Seguimiento_Eventos DROP INDEX ind_fk_Seguimiento_Eventos_Eventos;
ALTER TABLE Seguimiento_Eventos DROP INDEX ind_fk_Seguimiento_Eventos_Usuarios;

-- ------------------------------------------------------------------------------------- --
-- 14. Eliminar Llave Primaria. -------------------------------------------------------- --
--     ALTER TABLE __ DROP PRIMARY KEY : ----------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE Usuarios DROP PRIMARY KEY;
ALTER TABLE Organizaciones DROP PRIMARY KEY;
ALTER TABLE Donaciones DROP PRIMARY KEY;
ALTER TABLE Monetarios DROP PRIMARY KEY;
ALTER TABLE Objetos DROP PRIMARY KEY;
ALTER TABLE Eventos DROP PRIMARY KEY;

-- ------------------------------------------------------------------------------------- --
-- 15. Limpiar Registros. -------------------------------------------------------------- --
--     TRUNCATE __ : ------------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
TRUNCATE Usuarios;
TRUNCATE Organizaciones;
TRUNCATE Donaciones;
TRUNCATE Monetarios;
TRUNCATE Objetos;
TRUNCATE Eventos;
TRUNCATE Seguimiento_Eventos;

-- ------------------------------------------------------------------------------------- --
-- 16. Eliminar Tabla. ----------------------------------------------------------------- --
--     DROP TABLE __ : ----------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
-- DROP TABLE Usuarios;
-- DROP TABLE Organizaciones;
-- DROP TABLE Donaciones;
-- DROP TABLE Monetarios;
-- DROP TABLE Objetos;
-- DROP TABLE Eventos;
-- DROP TABLE Seguimiento_Eventos;

-- ------------------------------------------------------------------------------------- --
-- 17. Crear Tabla. -------------------------------------------------------------------- --
--     CREATE TABLE __ ( __ , __ ) : --------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
CREATE TABLE Organizaciones_Ejemplo (
  id_Organizaciones INT NOT NULL AUTO_INCREMENT,
  nombre_organizaciones VARCHAR(100) NOT NULL,
  direccion_organizaciones VARCHAR(90) NOT NULL,
  correo_organizaciones VARCHAR(45) NOT NULL,
  password_organizaciones VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_Organizaciones))
ENGINE = InnoDB;

DROP TABLE Organizaciones_Ejemplo;

-- ------------------------------------------------------------------------------------- --
-- 18. Renombrar Tabla. ---------------------------------------------------------------- --
--     RENAME TABLE __ TO __ : --------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
RENAME TABLE Usuarios TO Personas;
RENAME TABLE Personas TO Usuarios;

-- ------------------------------------------------------------------------------------- --
-- 19. Crear Llave Primaria. ----------------------------------------------------------- --
--     ALTER TABLE __ ADD PRIMARY KEY ( __ ) : ----------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE Usuarios ADD PRIMARY KEY (id_usuario);
ALTER TABLE Organizaciones ADD PRIMARY KEY (id_Organizaciones);
ALTER TABLE Donaciones ADD PRIMARY KEY (id_Donaciones);
ALTER TABLE Monetarios ADD PRIMARY KEY (id_Monetarios);
ALTER TABLE Objetos ADD PRIMARY KEY (id_Objetos);
ALTER TABLE Eventos ADD PRIMARY KEY (id_eventos);

-- ------------------------------------------------------------------------------------- --
-- 20. Crear Índice Campo. ------------------------------------------------------------- --
--     CREATE INDEX __ ON __ ( __ ) :  ------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
CREATE INDEX ind_usuarios_correo ON Usuarios (correo_usuario);
CREATE INDEX ind_organizaciones_nombre ON Organizaciones (nombre_organizaciones);
CREATE INDEX ind_donaciones_fecha ON Donaciones (fecha_donacion);

-- ------------------------------------------------------------------------------------- --
-- 21. Crear Índice Multicampo. -------------------------------------------------------- --
--     CREATE INDEX _ ON _ ( __ , __ ) : ----------------------------------------------- -- 
-- ------------------------------------------------------------------------------------- --
CREATE INDEX idx_evento_usuario ON Seguimiento_Eventos (id_evento, id_usuario);

-- ------------------------------------------------------------------------------------- --
-- 22. Crear Índice Único. ------------------------------------------------------------- --
--     CREATE UNIQUE INDEX __ ON __ ( __ ) : ------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
CREATE UNIQUE INDEX idx_unique_correo_usuario ON Usuarios (correo_usuario);
CREATE UNIQUE INDEX idx_unique_correo_organizacion ON Organizaciones (correo_organizaciones);

-- ------------------------------------------------------------------------------------- --
-- 23. Crear Restricción. -------------------------------------------------------------- --
--     ALTER TABLE __ ADD CONSTRAINT __ FOREIGN KEY ( __ ) REFERENCES __ ( __ ) -------- --
--     ON DELETE CASCADE ON UPDATE CASCADE : ------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE Donaciones ADD 
CONSTRAINT fk_Donaciones_Organizaciones
    FOREIGN KEY (id_Organizaciones)
    REFERENCES Organizaciones (id_Organizaciones)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE Donaciones ADD 
CONSTRAINT fk_Donaciones_Usuarios
    FOREIGN KEY (id_Usuarios)
    REFERENCES Usuarios (id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE Eventos ADD 
CONSTRAINT fk_Eventos_Organizaciones
    FOREIGN KEY (id_Organizaciones)
    REFERENCES Organizaciones (id_Organizaciones)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE Monetarios ADD 
CONSTRAINT fk_Monetarios_Donaciones
    FOREIGN KEY (id_Donaciones)
    REFERENCES Donaciones (id_Donaciones)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE Objetos ADD 
CONSTRAINT fk_Objetos_Donaciones
    FOREIGN KEY (id_Donaciones)
    REFERENCES Donaciones (id_Donaciones)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE Seguimiento_Eventos ADD 
CONSTRAINT fk_Seguimiento_Eventos_Eventos
    FOREIGN KEY (id_evento)
    REFERENCES Eventos (id_eventos)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE Seguimiento_Eventos ADD 
CONSTRAINT fk_Seguimiento_Eventos_Usuarios
    FOREIGN KEY (id_usuario)
    REFERENCES Usuarios (id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

    	
/* ************************************************************************************* */
/* ------------------------------------------------------------------------------------- */
/* ----------------------------------- BIBLIOGRAFÍA ------------------------------------ */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
