DROP DATABASE give_and_go ;
CREATE DATABASE give_and_go DEFAULT CHARACTER SET utf8 ;
USE give_and_go ;

CREATE TABLE Usuarios (
  id_Usuarios INT NOT NULL AUTO_INCREMENT,
  roles ENUM('Admin', 'Voluntario', 'Beneficiario') NOT NULL,
  nombre1_usuario VARCHAR(45) NOT NULL,
  nombre2_usuario VARCHAR(45) NULL,
  apellido1_usuario VARCHAR(45) NOT NULL,
  apellido2_usuario VARCHAR(45) NULL,
  telefono_usuario VARCHAR(15) NOT NULL,
  correo_usuario VARCHAR(100) NOT NULL,
  password_usuario VARCHAR(255) NOT NULL,
  UNIQUE INDEX correo_UNIQUE (correo_usuario ASC),
  PRIMARY KEY (id_Usuarios),
  INDEX id_Usuarios (id_Usuarios ASC))
ENGINE = InnoDB;

CREATE TABLE Organizaciones (
  id_Organizaciones INT NOT NULL AUTO_INCREMENT,
  nombre_organizaciones VARCHAR(100) NOT NULL,
  direccion_organizaciones VARCHAR(90) NOT NULL,
  correo_organizaciones VARCHAR(45) NOT NULL,
  password_organizaciones VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_Organizaciones),
  UNIQUE INDEX correo_organizaciones_UNIQUE (correo_organizaciones ASC))
ENGINE = InnoDB;

CREATE TABLE Eventos (
  id_Eventos INT NOT NULL AUTO_INCREMENT,
  nombre_eventos VARCHAR(45) NOT NULL,
  categoria_eventos VARCHAR(45) NOT NULL,
  descripcion_eventos VARCHAR(45) NOT NULL,
  fecha_evento DATETIME NOT NULL,
  estado_evento TINYINT NOT NULL COMMENT 'se añade el tipo de dato como boolean, para que este arroje true(1) si un evento esta activo y false(0) si un evento esta finalizado.',
  id_Organizaciones INT NOT NULL,
  PRIMARY KEY (id_Eventos),
  INDEX fk_Eventos_Organizaciones_idx (id_Organizaciones ASC),
  CONSTRAINT id_Organizaciones
    FOREIGN KEY (id_Organizaciones)
    REFERENCES mydb.Organizaciones (id_Organizaciones)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

CREATE TABLE Donaciones (
  id_Donaciones INT NOT NULL AUTO_INCREMENT,
  categoria_donaciones VARCHAR(45) NOT NULL,
  tipo_donaciones VARCHAR(45) NOT NULL,
  fecha_donacion DATETIME NOT NULL,
  id_Organizaciones INT NOT NULL,
  id_Usuarios INT NOT NULL,
  PRIMARY KEY (id_Donaciones),
  INDEX fk_Donaciones_Organizaciones_idx (id_Organizaciones ASC),
  INDEX fk_Donaciones_usuarios (id_Usuarios ASC),
  CONSTRAINT id_Organizaciones
    FOREIGN KEY (id_Organizaciones)
    REFERENCES mydb.Organizaciones (id_Organizaciones)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT id_Usuarios
    FOREIGN KEY (id_Usuarios)
    REFERENCES mydb.Usuarios (id_Usuarios)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

CREATE TABLE Monetarios (
  id_Monetarios INT NOT NULL AUTO_INCREMENT,
  tipo_metodo VARCHAR(45) NOT NULL,
  num_cuenta VARCHAR(45) NOT NULL,
  valor_total DECIMAL NOT NULL,
  id_Donaciones INT NOT NULL,
  PRIMARY KEY (id_Monetarios),
  INDEX fk_Monetarios_Donaciones1_idx (id_Donaciones ASC),
  CONSTRAINT fk_Monetarios_Donaciones1
    FOREIGN KEY (id_Donaciones)
    REFERENCES mydb.Donaciones (id_Donaciones)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

CREATE TABLE Objetos (
  id_Objetos INT NOT NULL AUTO_INCREMENT,
  categoria_objeto ENUM('Salud', 'Educacion', 'Medio Ambiente', 'Alimentos', 'Vivienda', 'Ropa') NOT NULL,
  descripcion_de_evento VARCHAR(250) NOT NULL,
  cantidad_total VARCHAR(100) NOT NULL,
  id_Donaciones INT NOT NULL,
  PRIMARY KEY (id_Objetos),
  INDEX fk_donaciones_idx (id_Donaciones ASC),
  CONSTRAINT id_donaciones
    FOREIGN KEY (id_Donaciones)
    REFERENCES mydb.Donaciones (id_Donaciones)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

CREATE TABLE Seguimiento_Eventos (
  id_Eventos INT NOT NULL,
  id_Usuarios INT NOT NULL,
  INDEX fk_Seguimiento_Eventos_Eventos1_idx (id_Eventos ASC),
  INDEX fk_Seguimiento_Eventos_Usuarios1_idx (id_Usuarios ASC),
  CONSTRAINT fk_Seguimiento_Eventos_Eventos1
    FOREIGN KEY (id_Eventos)
    REFERENCES mydb.Eventos (id_Eventos)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_Seguimiento_Eventos_Usuarios1
    FOREIGN KEY (id_Usuarios)
    REFERENCES mydb.Usuarios (id_Usuarios)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;