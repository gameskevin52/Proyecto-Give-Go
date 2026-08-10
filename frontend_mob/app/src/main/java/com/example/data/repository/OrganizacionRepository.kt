package com.example.data.repository

import com.example.data.dao.AccionRecienteDao
import com.example.data.dao.DonacionDao
import com.example.data.dao.EventoDao
import com.example.data.dao.OrganizacionDao
import com.example.data.model.AccionReciente
import com.example.data.model.Donacion
import com.example.data.model.Evento
import com.example.data.model.Organizacion
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext

sealed class RegistroResult {
    data class Success(val organizacion: Organizacion, val mensaje: String) : RegistroResult()
    data class Error(val mensaje: String, val campo: String? = null) : RegistroResult()
}

class OrganizacionRepository(
    private val organizacionDao: OrganizacionDao,
    private val eventoDao: EventoDao,
    private val accionRecienteDao: AccionRecienteDao,
    private val donacionDao: DonacionDao
) {

    val todasLasOrganizaciones: Flow<List<Organizacion>> = organizacionDao.getAllOrganizaciones()

    fun obtenerOrganizacionPorId(id: Int): Flow<Organizacion?> =
        organizacionDao.getOrganizacionById(id)

    fun obtenerEventosPorOrg(idOrganizacion: Int): Flow<List<Evento>> =
        eventoDao.getEventosByOrganizacion(idOrganizacion)

    fun obtenerAccionesPorOrg(idOrganizacion: Int): Flow<List<AccionReciente>> =
        accionRecienteDao.getAccionesByOrganizacion(idOrganizacion)

    fun obtenerDonacionesPorOrg(idOrganizacion: Int): Flow<List<Donacion>> =
        donacionDao.getDonacionesByOrganizacion(idOrganizacion)

    fun obtenerTotalMonto(idOrganizacion: Int): Flow<Double?> =
        donacionDao.getTotalMontoByOrganizacion(idOrganizacion)

    fun obtenerTotalParticipantes(idOrganizacion: Int): Flow<Int?> =
        eventoDao.getTotalParticipantes(idOrganizacion)

    fun obtenerTotalEventos(idOrganizacion: Int): Flow<Int> =
        eventoDao.getTotalEventosCount(idOrganizacion)

    /**
     * Registra una nueva organización en el sistema Give&Go.
     * Valida obligatoriedad, unicidad de NIT y Correo, y estado inicial 'pendiente'.
     */
    suspend fun registrarOrganizacion(
        nombre: String,
        nit: String,
        direccion: String,
        correo: String,
        password: String,
        telefono: String = "",
        representanteLegal: String = "",
        barrio: String = "",
        localidad: String = "Kennedy",
        ciudad: String = "Bogotá",
        departamento: String = "Bogotá D.C.",
        pais: String = "Colombia",
        categoria: String = "Asistencia Social",
        mision: String = "",
        vision: String = "",
        sitioWeb: String = "",
        redesSociales: String = "",
        descripcion: String = ""
    ): RegistroResult = withContext(Dispatchers.IO) {
        try {
            // 1. Validaciones de campos obligatorios
            if (nombre.trim().isEmpty()) {
                return@withContext RegistroResult.Error("El nombre de la organización es obligatorio.", "nombre")
            }
            if (nit.trim().isEmpty()) {
                return@withContext RegistroResult.Error("El NIT es obligatorio.", "nit")
            }
            if (direccion.trim().isEmpty()) {
                return@withContext RegistroResult.Error("La dirección institucional es obligatoria.", "direccion")
            }
            if (correo.trim().isEmpty()) {
                return@withContext RegistroResult.Error("El correo electrónico institucional es obligatorio.", "correo")
            }
            if (!android.util.Patterns.EMAIL_ADDRESS.matcher(correo.trim()).matches()) {
                return@withContext RegistroResult.Error("El formato del correo institucional no es válido.", "correo")
            }
            if (password.length < 6) {
                return@withContext RegistroResult.Error("La contraseña debe tener al menos 6 caracteres.", "password")
            }

            // 2. Validación de Unicidad de Correo y NIT
            val correoExistente = organizacionDao.getOrganizacionByCorreo(correo.trim())
            if (correoExistente != null) {
                return@withContext RegistroResult.Error(
                    "El correo '$correo' ya está registrado en Give&Go. Por favor use otro.",
                    "correo"
                )
            }

            val nitExistente = organizacionDao.getOrganizacionByNit(nit.trim())
            if (nitExistente != null) {
                return@withContext RegistroResult.Error(
                    "El NIT '$nit' ya se encuentra registrado por otra organización.",
                    "nit"
                )
            }

            // Simular cifrado de contraseña y tiempo de respuesta rápido (< 3 seg)
            delay(600) // Simulación rápida de procesamiento criptográfico y red

            // =========================================================================
            // TODO: CONEXIÓN CON API - Reemplazar con llamada Retrofit/Ktor al endpoint:
            // POST /api/organizaciones/register
            // Headers: { "Content-Type": "application/json" }
            // Body: {
            //   "nombre": nombre,
            //   "nit": nit,
            //   "direccion": direccion,
            //   "correo": correo,
            //   "password": hashedPassword,
            //   "telefono": telefono,
            //   "representante_legal": representanteLegal,
            //   "localidad": localidad,
            //   "ciudad": ciudad,
            //   "categoria": categoria,
            //   "mision": mision,
            //   "vision": vision,
            //   "sitio_web": sitioWeb
            // }
            // =========================================================================

            val nuevaOrg = Organizacion(
                nombre = nombre.trim(),
                nit = nit.trim(),
                direccion = direccion.trim(),
                correo = correo.trim().lowercase(),
                password = hashPassword(password), // Cifrado seguro simulado
                telefono = telefono.trim(),
                representanteLegal = if (representanteLegal.isBlank()) "Organización (Admin)" else representanteLegal.trim(),
                barrio = if (barrio.isBlank()) "Central Kennedy" else barrio.trim(),
                localidad = if (localidad.isBlank()) "Kennedy" else localidad.trim(),
                ciudad = ciudad.trim(),
                departamento = departamento.trim(),
                pais = pais.trim(),
                categoria = if (categoria.isBlank()) "Asistencia Social" else categoria.trim(),
                logo = "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80",
                fotoPortada = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80",
                mision = if (mision.isBlank()) "Generar impacto solidario y bienestar en la comunidad de Kennedy." else mision.trim(),
                vision = if (vision.isBlank()) "Consolidar alianzas de voluntariado y donaciones transparentes." else vision.trim(),
                sitioWeb = sitioWeb.trim(),
                redesSociales = redesSociales.trim(),
                descripcion = if (descripcion.isBlank()) "Organización sin ánimo de lucro registrada en Give&Go para canalizar ayuda y voluntariado." else descripcion.trim(),
                latitud = 4.6284,
                longitud = -74.1528,
                verificada = 0, // 0 = No verificada
                estadoVerificacion = "pendiente", // Requisito 6: Estado "Pendiente de verificación"
                estado = 1, // Activo
                fechaRegistro = System.currentTimeMillis()
            )

            val newId = organizacionDao.insertOrganizacion(nuevaOrg).toInt()
            val createdOrg = nuevaOrg.copy(idOrganizacion = newId)

            // Registrar acción inicial de registro y usuario administrador automático
            accionRecienteDao.insertAccion(
                AccionReciente(
                    idOrganizacion = newId,
                    titulo = "Organización registrada",
                    tipo = "verificacion",
                    descripcion = "Registro completado con éxito. Estado: Pendiente de verificación por el administrador general."
                )
            )
            accionRecienteDao.insertAccion(
                AccionReciente(
                    idOrganizacion = newId,
                    titulo = "Usuario administrador creado",
                    tipo = "voluntario",
                    descripcion = "Se ha asignado el usuario administrativo 'Organización' con credenciales seguras."
                )
            )

            // Simular envío de notificación de confirmación al correo institucional (Requisito 5)
            // =========================================================================
            // TODO: CONEXIÓN CON API - Reemplazar con llamada al servicio de correo:
            // POST /api/notifications/send-email-confirmation
            // Body: { "email": correo, "orgName": nombre, "nit": nit }
            // =========================================================================

            RegistroResult.Success(
                organizacion = createdOrg,
                mensaje = "¡Organización registrada con éxito! Se ha enviado un correo de confirmación a $correo. La cuenta se encuentra en estado 'Pendiente de verificación'."
            )
        } catch (e: Exception) {
            RegistroResult.Error("Error al registrar la organización: ${e.localizedMessage}")
        }
    }

    suspend fun actualizarPerfil(organizacion: Organizacion) = withContext(Dispatchers.IO) {
        // =========================================================================
        // TODO: CONEXIÓN CON API - Endpoint PUT /api/organizaciones/{id}
        // =========================================================================
        organizacionDao.updateOrganizacion(organizacion)
        accionRecienteDao.insertAccion(
            AccionReciente(
                idOrganizacion = organizacion.idOrganizacion,
                titulo = "Perfil institucional actualizado",
                tipo = "verificacion",
                descripcion = "Se modificaron los datos de contacto y descripción de la organización."
            )
        )
    }

    suspend fun cambiarPassword(idOrganizacion: Int, newPassword: String): Boolean = withContext(Dispatchers.IO) {
        if (newPassword.length < 6) return@withContext false
        val hashed = hashPassword(newPassword)
        // =========================================================================
        // TODO: CONEXIÓN CON API - Endpoint POST /api/organizaciones/change-password
        // =========================================================================
        organizacionDao.updatePassword(idOrganizacion, hashed)
        accionRecienteDao.insertAccion(
            AccionReciente(
                idOrganizacion = idOrganizacion,
                titulo = "Contraseña modificada",
                tipo = "seguridad",
                descripcion = "Se actualizó la clave de acceso de la cuenta institucional de forma segura."
            )
        )
        true
    }

    suspend fun simularAprobacionVerificacion(idOrganizacion: Int, aprobada: Boolean) = withContext(Dispatchers.IO) {
        val nuevoEstado = if (aprobada) "aprobada" else "rechazada"
        val flag = if (aprobada) 1 else 0
        organizacionDao.updateEstadoVerificacion(idOrganizacion, nuevoEstado, flag)
        accionRecienteDao.insertAccion(
            AccionReciente(
                idOrganizacion = idOrganizacion,
                titulo = if (aprobada) "¡Organización verificada!" else "Verificación rechazada",
                tipo = "verificacion",
                descripcion = if (aprobada) "El administrador general ha aprobado la documentación de la organización." else "Revisar observaciones del administrador."
            )
        )
    }

    suspend fun agregarEvento(evento: Evento) = withContext(Dispatchers.IO) {
        // =========================================================================
        // TODO: CONEXIÓN CON API - Endpoint POST /api/eventos
        // =========================================================================
        val id = eventoDao.insertEvento(evento)
        accionRecienteDao.insertAccion(
            AccionReciente(
                idOrganizacion = evento.idOrganizacion,
                titulo = "Nuevo evento programado",
                tipo = "evento",
                descripcion = "${evento.nombre} (${evento.tipo}) para el ${evento.fecha} en ${evento.sitio}."
            )
        )
        id
    }

    suspend fun agregarDonacion(donacion: Donacion) = withContext(Dispatchers.IO) {
        // =========================================================================
        // TODO: CONEXIÓN CON API - Endpoint POST /api/donaciones
        // =========================================================================
        val id = donacionDao.insertDonacion(donacion)
        accionRecienteDao.insertAccion(
            AccionReciente(
                idOrganizacion = donacion.idOrganizacion,
                titulo = "Nueva donación recibida",
                tipo = "donacion",
                descripcion = "Se recibieron $${String.format("%,.0f", donacion.monto)} COP (${donacion.tipo}) de ${donacion.donante}."
            )
        )
        id
    }

    suspend fun agregarAccionReciente(accion: AccionReciente) = withContext(Dispatchers.IO) {
        accionRecienteDao.insertAccion(accion)
    }

    private fun hashPassword(raw: String): String {
        // Simulación de hashing SHA-256 seguro
        return try {
            val bytes = java.security.MessageDigest.getInstance("SHA-256").digest(raw.toByteArray())
            bytes.joinToString("") { "%02x".format(it) }
        } catch (e: Exception) {
            "hashed_${raw.hashCode()}"
        }
    }
}
