CREATE SCHEMA give DEFAULT CHARACTER SET utf8 ;
USE give ;

-- -----------------------------------------------------
-- Table Organizaciones
-- -----------------------------------------------------
CREATE TABLE Organizaciones (
  organizacion_id INT NOT NULL AUTO_INCREMENT,
  organizacion_nombre VARCHAR(45) NOT NULL,
    VARCHAR(45) NOT NULL,
  organizacion_direccion VARCHAR(45) NOT NULL,
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



INSERT INTO ORGANIZACIONES VALUES (

null,
'Fundacion Esperanza',
'Social',
'Bogotá',
'clave123'

);
