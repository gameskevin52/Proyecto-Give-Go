package com.example.data.model

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "acciones_recientes")
data class AccionReciente(
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "id_accion")
    val idAccion: Int = 0,

    @ColumnInfo(name = "id_organizacion")
    val idOrganizacion: Int,

    @ColumnInfo(name = "titulo")
    val titulo: String,

    @ColumnInfo(name = "tipo")
    val tipo: String, // donacion, voluntario, distribucion, evento, verificacion

    @ColumnInfo(name = "descripcion")
    val descripcion: String,

    @ColumnInfo(name = "fecha")
    val fecha: Long = System.currentTimeMillis()
)
