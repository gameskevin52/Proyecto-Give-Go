-- DROP DATABASE GIVE;
CREATE SCHEMA give DEFAULT CHARACTER SET utf8 ;
USE give ;

-- -----------------------------------------------------
-- Table Organizaciones
-- -----------------------------------------------------
CREATE TABLE Organizaciones (
  organizacion_id INT NOT NULL AUTO_INCREMENT,
  organizacion_nombre VARCHAR(45) NOT NULL,
  organizacion_categoria VARCHAR(45) NOT NULL,
  organizacion_direccion VARCHAR(45) NOT NULL,
  organizacion_correo VARCHAR(50) NOT NULL,
  organizacion_contraseña VARCHAR(300) NOT NULL,
  PRIMARY KEY (organizacion_id))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table Usuarios
-- -----------------------------------------------------
CREATE TABLE Usuarios (
  usuario_id INT NOT NULL AUTO_INCREMENT,
  usuario_nombre VARCHAR(45) NOT NULL,
  usuario_apellido VARCHAR(45) NOT NULL,
  usuario_direccion VARCHAR(45) NOT NULL,
  usuario_telefono VARCHAR(45) NOT NULL,
  usuario_estrato VARCHAR(45) NOT NULL,
  usuario_correo VARCHAR(50) NOT NULL,
  usuario_contraseña VARCHAR(300) NOT NULL,
  organizacion_id INT NOT NULL,
  PRIMARY KEY (usuario_id),
  INDEX ind_fk_usuario_organizacion (organizacion_id ASC),
  CONSTRAINT fk_usuario_organizacion
    FOREIGN KEY (organizacion_id)
    REFERENCES Organizaciones (organizacion_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Mensajes
-- -----------------------------------------------------
CREATE TABLE Mensajes (
  mensaje_id INT NOT NULL AUTO_INCREMENT,
  mensaje_tipo VARCHAR(45) NOT NULL,
  mensaje_fecha date NOT NULL,
  mesnaje_asunto VARCHAR(45) NOT NULL,
  mensaje_descripcion VARCHAR(45) NOT NULL,
  mensaje_notificacion VARCHAR(45) NOT NULL,
  usuario_id INT NOT NULL,
  organizacion_id INT NOT NULL,
  PRIMARY KEY (mensaje_id),
  INDEX ind_fk_mensaje_usuario (usuario_id ASC),
  INDEX ind_fk_mensaje_organizacion (organizacion_id ASC),
  CONSTRAINT fk_mensaje_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES Usuarios (usuario_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_mensaje_organizacion
    FOREIGN KEY (organizacion_id)
    REFERENCES Organizaciones (organizacion_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Donaciones
-- -----------------------------------------------------
CREATE TABLE Donaciones (
  donacion_id INT NOT NULL AUTO_INCREMENT,
  donacion_nombre VARCHAR(45) NOT NULL,
  donacion_categoria VARCHAR(45) NOT NULL,
  donacion_tipo VARCHAR(45) NOT NULL,
  donacion_metodopago VARCHAR(45) NOT NULL,
  donacion_valor VARCHAR(45) NOT NULL,
  donacion_fecha DATE NOT NULL,
  donacion_estado VARCHAR (45) NOT NULL,
  usuario_id INT NOT NULL,
  organizacion_id INT NOT NULL,
  PRIMARY KEY (donacion_id),
  INDEX ind_fk_donacion_usuario (usuario_id ASC),
  INDEX ind_fk_donacion_organzacion (organizacion_id ASC),
  CONSTRAINT fk_donacion_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES Usuarios (usuario_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_donacion_organzacion
    FOREIGN KEY (organizacion_id)
    REFERENCES Organizaciones (organizacion_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Seguimiento-Eventos
-- -----------------------------------------------------
CREATE TABLE Seguimiento_Eventos (
  seguimiento_id INT NOT NULL AUTO_INCREMENT,
  seguimiento_estado VARCHAR(45) NOT NULL,
  PRIMARY KEY (seguimiento_id))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Eventos
-- -----------------------------------------------------
CREATE TABLE Eventos (
  evento_id INT NOT NULL AUTO_INCREMENT,
  evento_fecha DATE NOT NULL,
  evento_nombre VARCHAR(1000) NOT NULL,
  evento_direccion VARCHAR(1000) NOT NULL,
  evento_categoria VARCHAR(1000) NOT NULL,
  evento_descripcion VARCHAR(1000) NOT NULL,
  organizacion_id INT NOT NULL,
  Seguimiento_Eventos_Seguimiento INT NOT NULL,
  PRIMARY KEY (evento_id),
  INDEX ind_fk_evento_organizacion (organizacion_id ASC),
  INDEX ind_fk_Eventos_Seguimiento_Eventos (Seguimiento_Eventos_Seguimiento ASC),
  CONSTRAINT fk_evento_organizacion
   FOREIGN KEY (organizacion_id)
   REFERENCES Organizaciones (organizacion_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_Eventos_Seguimiento_Eventos
    FOREIGN KEY (Seguimiento_Eventos_Seguimiento)
    REFERENCES Seguimiento_Eventos (seguimiento_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Usuario-Eventos
-- -----------------------------------------------------
CREATE TABLE Usuario_Eventos (
  usuario_id INT NOT NULL,
  evento_id INT NOT NULL,
  INDEX ind_fk_usuario_evento_usuario (usuario_id ASC),
  INDEX ind_fk_usuario_evento_evento (evento_id ASC),
  CONSTRAINT fk_usuario_evento_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES Usuarios (usuario_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_usuario_evento_evento
    FOREIGN KEY (evento_id)
    REFERENCES Eventos (evento_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
