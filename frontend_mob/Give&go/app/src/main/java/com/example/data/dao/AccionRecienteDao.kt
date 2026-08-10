package com.example.data.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.model.AccionReciente
import kotlinx.coroutines.flow.Flow

@Dao
interface AccionRecienteDao {

    @Query("SELECT * FROM acciones_recientes WHERE id_organizacion = :idOrganizacion ORDER BY fecha DESC LIMIT 15")
    fun getAccionesByOrganizacion(idOrganizacion: Int): Flow<List<AccionReciente>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAccion(accion: AccionReciente): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(acciones: List<AccionReciente>)
}
