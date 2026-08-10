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
                    .fallbackToDestructiveMigration()
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
                val orgDao = db.organizacionDao()
                val eventoDao = db.eventoDao()
                val accionDao = db.accionRecienteDao()
                val donacionDao = db.donacionDao()

                // Organización inicial de demostración en Kennedy - Bogotá
                val demoOrg = Organizacion(
                    idOrganizacion = 1,
                    nombre = "Fundación Manos Unidas Kennedy",
                    direccion = "Calle 38C Sur # 78-45",
                    telefono = "+57 312 456 7890",
                    correo = "contacto@manosunidaskennedy.org",
                    password = "Password123*",
                    descripcion = "Organización comunitaria dedicada al apoyo alimentario, bienestar social y desarrollo integral de familias vulnerables en la localidad de Kennedy, Bogotá.",
                    nit = "901.458.789-2",
                    representanteLegal = "Carolina Gómez Morales",
                    barrio = "Castilla",
                    localidad = "Kennedy",
                    ciudad = "Bogotá",
                    departamento = "Bogotá D.C.",
                    pais = "Colombia",
                    categoria = "Alimentos y Bienestar Social",
                    logo = "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80",
                    fotoPortada = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80",
                    mision = "Brindar seguridad alimentaria y programas de acompañamiento social a niños, niñas y adultos mayores en Kennedy mediante alianzas solidarias.",
                    vision = "Ser la red de apoyo comunitario líder en el suroccidente de Bogotá para el año 2028, erradicando el hambre y fortaleciendo el tejido comunitario.",
                    sitioWeb = "https://manosunidaskennedy.org",
                    redesSociales = "@manosunidaskennedy en Instagram y Facebook",
                    latitud = 4.6284,
                    longitud = -74.1528,
                    verificada = 0,
                    estadoVerificacion = "pendiente",
                    estado = 1,
                    fechaRegistro = System.currentTimeMillis() - 86400000L * 3
                )

                orgDao.insertOrganizacion(demoOrg)

                // Eventos de muestra
                val eventos = listOf(
                    Evento(
                        idEvento = 1,
                        idOrganizacion = 1,
                        nombre = "Jornada de Salud Comunitaria",
                        tipo = "Salud",
                        fecha = "15 Ago 2026",
                        hora = "08:00 AM",
                        sitio = "Salón Comunal Castilla, Kennedy",
                        participantes = 120,
                        cupoMaximo = 150,
                        estado = "Programado",
                        descripcion = "Atención médica preventiva, toma de tensión y vacunación básica para la comunidad de Kennedy."
                    ),
                    Evento(
                        idEvento = 2,
                        idOrganizacion = 1,
                        nombre = "Entrega de Mercados Solidarios",
                        tipo = "Alimentos",
                        fecha = "10 Ago 2026",
                        hora = "09:30 AM",
                        sitio = "Parque Timiza, Kennedy",
                        participantes = 250,
                        cupoMaximo = 300,
                        estado = "En curso",
                        descripcion = "Distribución de mercados con víveres no perecederos a 250 familias censadas."
                    ),
                    Evento(
                        idEvento = 3,
                        idOrganizacion = 1,
                        nombre = "Taller de Refuerzo Escolar y Lectura",
                        tipo = "Educación",
                        fecha = "02 Ago 2026",
                        hora = "02:00 PM",
                        sitio = "Colegio Distrital Kennedy",
                        participantes = 85,
                        cupoMaximo = 90,
                        estado = "Completado",
                        descripcion = "Sesión lúdica y donación de kits escolares para niños de primaria."
                    ),
                    Evento(
                        idEvento = 4,
                        idOrganizacion = 1,
                        nombre = "Siembra y Limpieza del Humedal La Vaca",
                        tipo = "Medio Ambiente",
                        fecha = "26 Jul 2026",
                        hora = "07:30 AM",
                        sitio = "Humedal La Vaca, Kennedy",
                        participantes = 64,
                        cupoMaximo = 70,
                        estado = "Completado",
                        descripcion = "Jornada ecológica de siembra de 100 especies nativas y recolección de residuos."
                    )
                )
                eventoDao.insertAll(eventos)

                // Acciones recientes
                val acciones = listOf(
                    AccionReciente(
                        idAccion = 1,
                        idOrganizacion = 1,
                        titulo = "Nueva donación recibida",
                        tipo = "donacion",
                        descripcion = "Se recibieron $350.000 COP de Distribuidora San Carlos.",
                        fecha = System.currentTimeMillis() - 1000 * 60 * 45
                    ),
                    AccionReciente(
                        idAccion = 2,
                        idOrganizacion = 1,
                        titulo = "Distribución completada",
                        tipo = "distribucion",
                        descripcion = "Entrega de 50 kits alimentarios en el barrio Patio Bonito, Kennedy.",
                        fecha = System.currentTimeMillis() - 1000 * 60 * 180
                    ),
                    AccionReciente(
                        idAccion = 3,
                        idOrganizacion = 1,
                        titulo = "Nuevo voluntario registrado",
                        tipo = "voluntario",
                        descripcion = "Carlos Ruiz se unió como coordinador de logística comunitaria.",
                        fecha = System.currentTimeMillis() - 1000 * 60 * 360
                    ),
                    AccionReciente(
                        idAccion = 4,
                        idOrganizacion = 1,
                        titulo = "Registro de organización",
                        tipo = "verificacion",
                        descripcion = "Organización creada con éxito. Notificación enviada al correo institucional.",
                        fecha = System.currentTimeMillis() - 1000 * 60 * 1440
                    )
                )
                accionDao.insertAll(acciones)

                // Donaciones de muestra
                val donaciones = listOf(
                    Donacion(
                        idDonacion = 1,
                        idOrganizacion = 1,
                        donante = "Comercializadora Andina SAS",
                        monto = 1500000.0,
                        tipo = "Económica",
                        fecha = System.currentTimeMillis() - 86400000L * 2,
                        mensaje = "Apoyo para el programa de almuerzos escolares."
                    ),
                    Donacion(
                        idDonacion = 2,
                        idOrganizacion = 1,
                        donante = "Panadería El Manantial Kennedy",
                        monto = 850000.0,
                        tipo = "Alimentos",
                        fecha = System.currentTimeMillis() - 86400000L * 4,
                        mensaje = "Donación de 200 paquetes de pan y harinas."
                    ),
                    Donacion(
                        idDonacion = 3,
                        idOrganizacion = 1,
                        donante = "Dra. Patricia Salamanca",
                        monto = 500000.0,
                        tipo = "Económica",
                        fecha = System.currentTimeMillis() - 86400000L * 7,
                        mensaje = "Aporte mensual de padrino voluntario."
                    ),
                    Donacion(
                        idDonacion = 4,
                        idOrganizacion = 1,
                        donante = "Droguerías Kennedy Centro",
                        monto = 1200000.0,
                        tipo = "Medicamentos",
                        fecha = System.currentTimeMillis() - 86400000L * 10,
                        mensaje = "Insumos para la jornada de salud comunitaria."
                    )
                )
                donacionDao.insertAll(donaciones)
            }
        }
    }
}
