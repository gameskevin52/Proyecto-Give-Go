package com.example.data.model

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "eventos")
data class Evento(
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "id_evento")
    val idEvento: Int = 0,

    @ColumnInfo(name = "id_organizacion")
    val idOrganizacion: Int,

    @ColumnInfo(name = "nombre")
    val nombre: String,

    @ColumnInfo(name = "tipo")
    val tipo: String, // Salud, Educación, Medio Ambiente, Alimentos

    @ColumnInfo(name = "fecha")
    val fecha: String,

    @ColumnInfo(name = "hora")
    val hora: String,

    @ColumnInfo(name = "sitio")
    val sitio: String,

    @ColumnInfo(name = "participantes")
    val participantes: Int = 0,

    @ColumnInfo(name = "cupo_maximo")
    val cupoMaximo: Int = 50,

    @ColumnInfo(name = "estado")
    val estado: String = "Programado", // Programado, En curso, Completado

    @ColumnInfo(name = "descripcion")
    val descripcion: String = ""
)
