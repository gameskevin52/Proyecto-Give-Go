DROP DATABASE IF EXISTS give;
CREATE SCHEMA give DEFAULT CHARACTER SET utf8 ;
USE give ;

CREATE TABLE Organizaciones (
  organizacion_id INT NOT NULL AUTO_INCREMENT,
  organizacion_nombre VARCHAR(45) NOT NULL,
  organizacion_categoria VARCHAR(45) NOT NULL,
  organizacion_direccion VARCHAR(45) NOT NULL,
  organizacion_contraseña VARCHAR(300) NOT NULL,
  PRIMARY KEY (organizacion_id))
ENGINE = InnoDB;


INSERT INTO ORGANIZACIONES VALUES (

null,
'Fundacion Esperanza',
'Social',
'Bogotá',
'clave123'

);
