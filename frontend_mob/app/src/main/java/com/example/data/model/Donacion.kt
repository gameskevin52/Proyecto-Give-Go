package com.example.data.model

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "donaciones")
data class Donacion(
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "id_donacion")
    val idDonacion: Int = 0,

    @ColumnInfo(name = "id_organizacion")
    val idOrganizacion: Int,

    @ColumnInfo(name = "donante")
    val donante: String,

    @ColumnInfo(name = "monto")
    val monto: Double,

    @ColumnInfo(name = "tipo")
    val tipo: String = "Económica", // Económica, Alimentos, Ropa, Medicamentos, Equipos

    @ColumnInfo(name = "fecha")
    val fecha: Long = System.currentTimeMillis(),

    @ColumnInfo(name = "mensaje")
    val mensaje: String = ""
)
