package com.example.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.data.dao.AccionRecienteDao
import com.example.data.dao.DonacionDao
import com.example.data.dao.EventoDao
import com.example.data.dao.OrganizacionDao
import com.example.data.model.AccionReciente
import com.example.data.model.Donacion
import com.example.data.model.Evento
import com.example.data.model.Organizacion
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        Organizacion::class,
        Evento::class,
        AccionReciente::class,
        Donacion::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun organizacionDao(): OrganizacionDao
    abstract fun eventoDao(): EventoDao
    abstract fun accionRecienteDao(): AccionRecienteDao
    abstract fun donacionDao(): DonacionDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "give_and_go_database"
                )
                    .addCallback(AppDatabaseCallback(scope))
                    .fallbackToDestructiveMigration(dropAllTables = true)
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class AppDatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialData(database)
                    }
                }
            }

            suspend fun populateInitialData(db: AppDatabase) {
                // Al exportar el proyecto, la base de datos inicia limpia sin eventos ni donaciones preexistentes.
                // Los datos se crean cuando el usuario realiza el registro en la aplicación.
            }
        }
    }
}
