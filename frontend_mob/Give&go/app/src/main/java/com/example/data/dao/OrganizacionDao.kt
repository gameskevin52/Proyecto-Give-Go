package com.example.data.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.Organizacion
import kotlinx.coroutines.flow.Flow

@Dao
interface OrganizacionDao {

    @Query("SELECT * FROM organizaciones ORDER BY fecha_registro DESC")
    fun getAllOrganizaciones(): Flow<List<Organizacion>>

    @Query("SELECT * FROM organizaciones WHERE id_organizacion = :id")
    fun getOrganizacionById(id: Int): Flow<Organizacion?>

    @Query("SELECT * FROM organizaciones WHERE id_organizacion = :id")
    suspend fun getOrganizacionByIdSync(id: Int): Organizacion?

    @Query("SELECT * FROM organizaciones WHERE correo = :correo LIMIT 1")
    suspend fun getOrganizacionByCorreo(correo: String): Organizacion?

    @Query("SELECT * FROM organizaciones WHERE nit = :nit LIMIT 1")
    suspend fun getOrganizacionByNit(nit: String): Organizacion?

    @Query("SELECT COUNT(*) FROM organizaciones")
    fun getCount(): Flow<Int>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrganizacion(organizacion: Organizacion): Long

    @Update
    suspend fun updateOrganizacion(organizacion: Organizacion)

    @Query("UPDATE organizaciones SET password = :newPassword WHERE id_organizacion = :id")
    suspend fun updatePassword(id: Int, newPassword: String)

    @Query("UPDATE organizaciones SET estado_verificacion = :estado, verificada = :verificada WHERE id_organizacion = :id")
    suspend fun updateEstadoVerificacion(id: Int, estado: String, verificada: Int)

    @Query("DELETE FROM organizaciones WHERE id_organizacion = :id")
    suspend fun deleteOrganizacion(id: Int)
}
