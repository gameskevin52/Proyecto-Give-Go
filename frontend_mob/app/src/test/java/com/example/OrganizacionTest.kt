package com.example

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import com.example.data.database.AppDatabase
import com.example.data.model.Evento
import com.example.data.repository.OrganizacionRepository
import com.example.data.repository.RegistroResult
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class OrganizacionTest {

    private lateinit var db: AppDatabase
    private lateinit var repository: OrganizacionRepository

    @Before
    fun createDb() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        db = Room.inMemoryDatabaseBuilder(context, AppDatabase::class.java)
            .allowMainThreadQueries()
            .build()

        repository = OrganizacionRepository(
            organizacionDao = db.organizacionDao(),
            eventoDao = db.eventoDao(),
            accionRecienteDao = db.accionRecienteDao(),
            donacionDao = db.donacionDao()
        )
    }

    @After
    fun closeDb() {
        db.close()
    }

    @Test
    fun testRegistroOrganizacionExitoso() = runBlocking {
        val result = repository.registrarOrganizacion(
            nombre = "Fundación Manos Solidarias Kennedy",
            nit = "901.999.888-1",
            direccion = "Calle 38C Sur # 78-45",
            correo = "contacto@manossolidarias.org",
            password = "SecretPassword123*",
            barrio = "Castilla",
            localidad = "Kennedy"
        )

        assertTrue(result is RegistroResult.Success)
        val success = result as RegistroResult.Success
        assertNotNull(success.organizacion)
        assertEquals("Fundación Manos Solidarias Kennedy", success.organizacion.nombre)
        assertEquals("pendiente", success.organizacion.estadoVerificacion)
        assertEquals("Kennedy", success.organizacion.localidad)

        // Verificar que se guardó en Room y se generó una acción reciente
        val orgs = repository.todasLasOrganizaciones.first()
        assertEquals(1, orgs.size)

        val acciones = repository.obtenerAccionesPorOrg(success.organizacion.idOrganizacion).first()
        assertTrue(acciones.isNotEmpty())
    }

    @Test
    fun testErrorDuplicadoCorreoYNit() = runBlocking {
        // Registro inicial
        repository.registrarOrganizacion(
            nombre = "Org Uno",
            nit = "901.111.222-1",
            direccion = "Calle 1",
            correo = "test@giveandgo.org",
            password = "Password123"
        )

        // Intento con mismo correo
        val errorCorreo = repository.registrarOrganizacion(
            nombre = "Org Dos",
            nit = "901.333.444-2",
            direccion = "Calle 2",
            correo = "test@giveandgo.org",
            password = "Password123"
        )
        assertTrue(errorCorreo is RegistroResult.Error)
        assertEquals("correo", (errorCorreo as RegistroResult.Error).campo)

        // Intento con mismo NIT
        val errorNit = repository.registrarOrganizacion(
            nombre = "Org Tres",
            nit = "901.111.222-1",
            direccion = "Calle 3",
            correo = "otro@giveandgo.org",
            password = "Password123"
        )
        assertTrue(errorNit is RegistroResult.Error)
        assertEquals("nit", (errorNit as RegistroResult.Error).campo)
    }

    @Test
    fun testAgregarEventoYActualizarPerfil() = runBlocking {
        val reg = repository.registrarOrganizacion(
            nombre = "Fundación Esperanza",
            nit = "901.555.666-3",
            direccion = "Av Primero de Mayo # 40-10",
            correo = "esperanza@giveandgo.org",
            password = "Password123"
        ) as RegistroResult.Success

        val orgId = reg.organizacion.idOrganizacion

        // Agregar evento
        repository.agregarEvento(
            Evento(
                idOrganizacion = orgId,
                nombre = "Jornada de Salud Comunitaria",
                tipo = "Salud",
                fecha = "15 Sep 2026",
                hora = "08:00 AM",
                sitio = "Salón Comunal Castilla",
                participantes = 120,
                cupoMaximo = 150,
                estado = "En curso"
            )
        )

        val eventos = repository.obtenerEventosPorOrg(orgId).first()
        assertEquals(1, eventos.size)
        assertEquals("Jornada de Salud Comunitaria", eventos[0].nombre)

        // Cambiar password
        val okPass = repository.cambiarPassword(orgId, "NuevaPass123*")
        assertTrue(okPass)
    }
}
