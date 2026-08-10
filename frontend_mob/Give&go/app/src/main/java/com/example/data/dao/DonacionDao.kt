package com.example.data.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.model.Donacion
import kotlinx.coroutines.flow.Flow

@Dao
interface DonacionDao {

    @Query("SELECT * FROM donaciones WHERE id_organizacion = :idOrganizacion ORDER BY fecha DESC")
    fun getDonacionesByOrganizacion(idOrganizacion: Int): Flow<List<Donacion>>

    @Query("SELECT SUM(monto) FROM donaciones WHERE id_organizacion = :idOrganizacion")
    fun getTotalMontoByOrganizacion(idOrganizacion: Int): Flow<Double?>

    @Query("SELECT COUNT(*) FROM donaciones WHERE id_organizacion = :idOrganizacion")
    fun getDonacionesCount(idOrganizacion: Int): Flow<Int>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDonacion(donacion: Donacion): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(donaciones: List<Donacion>)
}
