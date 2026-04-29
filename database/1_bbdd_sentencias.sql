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
DROP DATABASE give;

-- ------------------------------------------------------------------------------------- --
-- 04. Mostrar Tablas. ----------------------------------------------------------------- --
--     SHOW TABLES __ : ---------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
SHOW TABLES;

-- ------------------------------------------------------------------------------------- --
-- 05. Mostar Columnas. ---------------------------------------------------------------- --
--     SHOW COLUMNS FROM __ . DESCRIBE __ : -------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
SHOW COLUMNS FROM USUARIOS;
DESCRIBE USUARIOS;

-- ------------------------------------------------------------------------------------- --
-- 06. Agregar Columna. ---------------------------------------------------------------- --
--     ALTER TABLE __ ADD __ __ : ------------------------------------------------------ --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE USUARIOS ADD usuario_genero VARCHAR(20);

-- ------------------------------------------------------------------------------------- --
-- 07. Renombrar Columna. -------------------------------------------------------------- --
--     ALTER TABLE __ CHANGE __ __ : --------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE EVENTOS CHANGE eventos_id evento_id INT NOT NULL AUTO_INCREMENT;

-- ------------------------------------------------------------------------------------- --
-- 08. Eliminar Columna. --------------------------------------------------------------- --
--     ALTER TABLE __ DROP __ : -------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE USUARIOS DROP usuario_nombre;

-- ------------------------------------------------------------------------------------- --
-- 09. Agregar Valor x Defecto Columna. ------------------------------------------------ --
--     ALTER TABLE __ ALTER __ SET DEFAULT __ :	---------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE USUARIOS ALTER usuario_estrato SET DEFAULT 2;

-- ------------------------------------------------------------------------------------- --
-- 10. Eliminar Valor x Defecto Columna. ----------------------------------------------- --
--     ALTER TABLE __ ALTER __ DROP DEFAULT : ------------------------------------------ --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE USUARIOS ALTER usuario_estrato DROP DEFAULT;

-- ------------------------------------------------------------------------------------- --
-- 11. Mostrar Creación Tabla. --------------------------------------------------------- --
--     SHOW CREATE TABLE __ : ---------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
SHOW CREATE TABLE USUARIOS;
SHOW CREATE TABLE ORGANIZACIONES;
SHOW CREATE TABLE MENSAJES;

-- ------------------------------------------------------------------------------------- --
-- 12. Eliminar Restricción. ----------------------------------------------------------- --
--     ALTER TABLE __ DROP CONSTRAINT __ : --------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE USUARIOS DROP CONSTRAINT fk_usuario_organizacion;
ALTER TABLE MENSAJES DROP CONSTRAINT fk_mensaje_usuario;
ALTER TABLE MENSAJES DROP CONSTRAINT fk_mensaje_organizacion;
ALTER TABLE DONACIONES DROP CONSTRAINT fk_donacion_usuario;
ALTER TABLE DONACIONES DROP CONSTRAINT fk_donacion_organzacion;
ALTER TABLE EVENTOS DROP CONSTRAINT fk_evento_organizacion;
ALTER TABLE EVENTOS DROP CONSTRAINT fk_Eventos_Seguimiento_Eventos;
ALTER TABLE USUARIO_EVENTOS DROP CONSTRAINT fk_usuario_evento_usuario;
ALTER TABLE USUARIO_EVENTOS DROP CONSTRAINT fk_usuario_evento_evento;

-- ------------------------------------------------------------------------------------- --
-- 13. Eliminar Índice. ---------------------------------------------------------------- --
--     ALTER TABLE __ DROP INDEX __ : -------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE USUARIOS DROP INDEX ind_fk_usuario_organizacion;
ALTER TABLE MENSAJES DROP INDEX ind_fk_mensaje_usuario;
ALTER TABLE MENSAJES DROP INDEX ind_fk_mensaje_organizacion;
ALTER TABLE DONACIONES DROP INDEX ind_fk_donacion_usuario;
ALTER TABLE DONACIONES DROP INDEX ind_fk_donacion_organzacion;
ALTER TABLE EVENTOS DROP INDEX ind_fk_evento_organizacion;
ALTER TABLE EVENTOS DROP INDEX ind_fk_Eventos_Seguimiento_Eventos;
ALTER TABLE USUARIO_EVENTOS DROP INDEX ind_fk_usuario_evento_usuario;
ALTER TABLE USUARIO_EVENTOS DROP INDEX ind_fk_usuario_evento_evento;

-- ------------------------------------------------------------------------------------- --
-- 14. Eliminar Llave Primaria. -------------------------------------------------------- --
--     ALTER TABLE __ DROP PRIMARY KEY : ----------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE USUARIOS DROP PRIMARY KEY;
ALTER TABLE ORGANIZACIONES DROP PRIMARY KEY;
ALTER TABLE MENSAJES DROP PRIMARY KEY;
ALTER TABLE DONACIONES DROP PRIMARY KEY;
ALTER TABLE SEGUIMIENTO_EVENTOS DROP PRIMARY KEY;
ALTER TABLE EVENTOS DROP PRIMARY KEY;

-- ------------------------------------------------------------------------------------- --
-- 15. Limpiar Registros. -------------------------------------------------------------- --
--     TRUNCATE __ : ------------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
TRUNCATE USUARIOS;
TRUNCATE ORGANIZACIONES;
TRUNCATE DONACIONES;
TRUNCATE MENSAJES;
TRUNCATE SEGUIMIENTO_EVENTOS;
TRUNCATE EVENTOS;
TRUNCATE USUARIO_EVENTOS;

-- ------------------------------------------------------------------------------------- --
-- 16. Eliminar Tabla. ----------------------------------------------------------------- --
--     DROP TABLE __ : ----------------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
DROP TABLE USUARIOS;
DROP TABLE ORGANIZACIONES;
DROP TABLE DONACIONES;
DROP TABLE MENSAJES;
DROP TABLE SEGUIMIENTO_EVENTOS;
DROP TABLE EVENTOS;
DROP TABLE USUARIO_EVENTOS;

-- ------------------------------------------------------------------------------------- --
-- 17. Crear Tabla. -------------------------------------------------------------------- --
--     CREATE TABLE __ ( __ , __ ) : --------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
CREATE TABLE Organizaciones (
  organizcion_id INT NOT NULL AUTO_INCREMENT,
  organizacion_nombre VARCHAR(45) NOT NULL,
  organizacion_categoria VARCHAR(45) NOT NULL,
  organiacion_direccion VARCHAR(45) NOT NULL,
  organizacin_contraseña VARCHAR(45) NOT NULL,
  PRIMARY KEY (organizcion_id))
ENGINE = InnoDB;

-- ------------------------------------------------------------------------------------- --
-- 18. Renombrar Tabla. ---------------------------------------------------------------- --
--     RENAME TABLE __ TO __ : --------------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
RENAME TABLE USUARIOS TO PERSONAS;
RENAME TABLE PERSONAS TO USUARIOS;

-- ------------------------------------------------------------------------------------- --
-- 19. Crear Llave Primaria. ----------------------------------------------------------- --
--     ALTER TABLE __ ADD PRIMARY KEY ( __ ) : ----------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE USUARIOS ADD PRIMARY KEY (usuario_id);
ALTER TABLE ORGANIZACIONES ADD PRIMARY KEY (organizacion_id);
ALTER TABLE DONACIONES ADD PRIMARY KEY (donacion_id);
ALTER TABLE MENSAJES ADD PRIMARY KEY (mensaje_id);
-- ALTER TABLE USUARIO_EVENTOS ADD PRIMARY KEY (usuario_eventos_id);
-- ALTER TABLE SEGUIMIENTO_EVENTOS ADD PRIMARY KEY (seguimieno_id);
ALTER TABLE EVENTOS ADD PRIMARY KEY (evento_id);

-- ------------------------------------------------------------------------------------- --
-- 20. Crear Índice Campo. ------------------------------------------------------------- --
--     CREATE INDEX __ ON __ ( __ ) :  ------------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
CREATE INDEX ind_fk_usuario_organizacion ON USUARIOS (usuario_id);
CREATE INDEX ind_fk_mensaje_usuario ON MENSAJES (mensaje_id);
CREATE INDEX ind_fk_mensaje_organizacion ON MENSAJES (mensaje_id);
CREATE INDEX ind_fk_donacion_usuario ON DONACIONES (donacion_id);
CREATE INDEX ind_fk_donacion_organzacion ON DONACIONES (donacion_id);
CREATE INDEX ind_fk_evento_organizacion ON EVENTOS (evento_id);

-- ------------------------------------------------------------------------------------- --
-- 21. Crear Índice Multicampo. -------------------------------------------------------- --
--     CREATE INDEX _ ON _ ( __ , __ ) : ----------------------------------------------- -- 
-- ------------------------------------------------------------------------------------- --
CREATE INDEX ind_fk_usuario_id_evento_id
ON USUARIO_EVENTOS (usuario_id, evento_id);

-- ------------------------------------------------------------------------------------- --
-- 22. Crear Índice Único. ------------------------------------------------------------- --
--     CREATE UNIQUE INDEX __ ON __ ( __ ) : ------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
CREATE UNIQUE INDEX ind_fk_usuario_evento_usuario ON USUARIO_EVENTOS (usuario_id);
CREATE UNIQUE INDEX ind_fk_usuario_evento_evento ON USUARIO_EVENTOS (evento_id);
-- ------------------------------------------------------------------------------------- --
-- 23. Crear Restricción. -------------------------------------------------------------- --
--     ALTER TABLE __ ADD CONSTRAINT __ FOREIGN KEY ( __ ) REFERENCES __ ( __ ) -------- --
--     ON DELETE CASCADE ON UPDATE CASCADE : ------------------------------------------- --
-- ------------------------------------------------------------------------------------- --
ALTER TABLE USUARIOS ADD 
CONSTRAINT fk_usuario_organizacion
    FOREIGN KEY (organizacion_id)
    REFERENCES Organizaciones (organizcion_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE;

ALTER TABLE MENSAJES ADD 
CONSTRAINT fk_mensaje_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES Usuarios (Id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

	ALTER TABLE MENSAJES ADD 
CONSTRAINT fk_mensaje_organizacion
    FOREIGN KEY (organiacion_id)
    REFERENCES Organizaciones (organizcion_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE DONACIONES ADD 
CONSTRAINT fk_donacion_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES Usuarios (Id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

	ALTER TABLE DONACIONES ADD 
CONSTRAINT fk_donacion_organzacion
    FOREIGN KEY (organizacion_id)
    REFERENCES Organizaciones (organizcion_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

	ALTER TABLE EVENTOS ADD 
CONSTRAINT fk_evento_organizacion
    FOREIGN KEY (organizacion_id)
    REFERENCES Organizaciones (organizcion_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

	ALTER TABLE EVENTOS ADD 
CONSTRAINT fk_Eventos_Seguimiento_Eventos
    FOREIGN KEY (Seguimiento_Eventos_Seguimiento)
    REFERENCES Seguimiento_Eventos (seguimiento_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

	ALTER TABLE USUARIO_EVENTOS ADD 
CONSTRAINT fk_usuario_evento_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES Usuarios (Id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

	ALTER TABLE USUARIO_EVENTOS ADD 
CONSTRAINT fk_usuario_evento_evento
    FOREIGN KEY (evento_id)
    REFERENCES Eventos (eventos_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
	
/* ************************************************************************************* */
/* ------------------------------------------------------------------------------------- */
/* ----------------------------------- BIBLIOGRAFÍA ------------------------------------ */
/* ------------------------------------------------------------------------------------- */
/* ************************************************************************************* */
