package com.example.data.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.Evento
import kotlinx.coroutines.flow.Flow

@Dao
interface EventoDao {

    @Query("SELECT * FROM eventos WHERE id_organizacion = :idOrganizacion ORDER BY id_evento DESC")
    fun getEventosByOrganizacion(idOrganizacion: Int): Flow<List<Evento>>

    @Query("SELECT * FROM eventos ORDER BY id_evento DESC")
    fun getAllEventos(): Flow<List<Evento>>

    @Query("SELECT COUNT(*) FROM eventos WHERE id_organizacion = :idOrganizacion")
    fun getTotalEventosCount(idOrganizacion: Int): Flow<Int>

    @Query("SELECT SUM(participantes) FROM eventos WHERE id_organizacion = :idOrganizacion")
    fun getTotalParticipantes(idOrganizacion: Int): Flow<Int?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvento(evento: Evento): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(eventos: List<Evento>)

    @Update
    suspend fun updateEvento(evento: Evento)

    @Query("DELETE FROM eventos WHERE id_evento = :id")
    suspend fun deleteEvento(id: Int)
}
