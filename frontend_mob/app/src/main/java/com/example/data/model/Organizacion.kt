package com.example.data.model

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Entidad Organizacion basada en la estructura de base de datos SQL:
 * CREATE TABLE IF NOT EXISTS organizaciones (
 *   id_organizacion INT AUTO_INCREMENT PRIMARY KEY,
 *   nombre VARCHAR(150) NOT NULL,
 *   direccion VARCHAR(255) DEFAULT NULL,
 *   telefono VARCHAR(20) DEFAULT NULL,
 *   correo VARCHAR(100) NOT NULL UNIQUE,
 *   password VARCHAR(255) NOT NULL,
 *   descripcion TEXT DEFAULT NULL,
 *   nit VARCHAR(50) DEFAULT NULL,
 *   representante_legal VARCHAR(150) DEFAULT NULL,
 *   barrio VARCHAR(100) DEFAULT NULL,
 *   localidad VARCHAR(100) DEFAULT NULL,
 *   ciudad VARCHAR(100) DEFAULT 'Bogotá',
 *   departamento VARCHAR(100) DEFAULT 'Bogotá D.C.',
 *   pais VARCHAR(100) DEFAULT 'Colombia',
 *   categoria VARCHAR(100) DEFAULT NULL,
 *   logo TEXT DEFAULT NULL,
 *   foto_portada TEXT DEFAULT NULL,
 *   mision TEXT DEFAULT NULL,
 *   vision TEXT DEFAULT NULL,
 *   sitio_web VARCHAR(255) DEFAULT NULL,
 *   redes_sociales TEXT DEFAULT NULL,
 *   latitud DECIMAL(10,8) DEFAULT NULL,
 *   longitud DECIMAL(11,8) DEFAULT NULL,
 *   verificada TINYINT DEFAULT 0,
 *   estado_verificacion VARCHAR(50) DEFAULT 'pendiente',
 *   estado TINYINT DEFAULT 1,
 *   fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 */
@Entity(tableName = "organizaciones")
data class Organizacion(
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "id_organizacion")
    val idOrganizacion: Int = 0,

    @ColumnInfo(name = "nombre")
    val nombre: String,

    @ColumnInfo(name = "direccion")
    val direccion: String? = null,

    @ColumnInfo(name = "telefono")
    val telefono: String? = null,

    @ColumnInfo(name = "correo")
    val correo: String,

    @ColumnInfo(name = "password")
    val password: String,

    @ColumnInfo(name = "descripcion")
    val descripcion: String? = null,

    @ColumnInfo(name = "nit")
    val nit: String? = null,

    @ColumnInfo(name = "representante_legal")
    val representanteLegal: String? = null,

    @ColumnInfo(name = "barrio")
    val barrio: String? = null,

    @ColumnInfo(name = "localidad")
    val localidad: String? = "Kennedy",

    @ColumnInfo(name = "ciudad")
    val ciudad: String? = "Bogotá",

    @ColumnInfo(name = "departamento")
    val departamento: String? = "Bogotá D.C.",

    @ColumnInfo(name = "pais")
    val pais: String? = "Colombia",

    @ColumnInfo(name = "categoria")
    val categoria: String? = "Asistencia Social",

    @ColumnInfo(name = "logo")
    val logo: String? = null,

    @ColumnInfo(name = "foto_portada")
    val fotoPortada: String? = null,

    @ColumnInfo(name = "mision")
    val mision: String? = null,

    @ColumnInfo(name = "vision")
    val vision: String? = null,

    @ColumnInfo(name = "sitio_web")
    val sitioWeb: String? = null,

    @ColumnInfo(name = "redes_sociales")
    val redesSociales: String? = null,

    @ColumnInfo(name = "latitud")
    val latitud: Double? = 4.6284,

    @ColumnInfo(name = "longitud")
    val longitud: Double? = -74.1528,

    @ColumnInfo(name = "verificada")
    val verificada: Int = 0, // 0 = No verificada, 1 = Verificada

    @ColumnInfo(name = "estado_verificacion")
    val estadoVerificacion: String = "pendiente", // 'no_solicitado', 'pendiente', 'aprobada', 'rechazada'

    @ColumnInfo(name = "estado")
    val estado: Int = 1, // 1 = activo, 0 = inactivo

    @ColumnInfo(name = "fecha_registro")
    val fechaRegistro: Long = System.currentTimeMillis()
)
