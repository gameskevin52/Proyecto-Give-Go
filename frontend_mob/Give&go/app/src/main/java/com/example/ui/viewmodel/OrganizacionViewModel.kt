package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.database.AppDatabase
import com.example.data.model.AccionReciente
import com.example.data.model.Donacion
import com.example.data.model.Evento
import com.example.data.model.Organizacion
import com.example.data.repository.OrganizacionRepository
import com.example.data.repository.RegistroResult
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class DashboardTab {
    INFORMACION_GENERAL,
    MI_PERFIL,
    CONFIGURACION,
    SEGUIMIENTO_EVENTOS
}

enum class GlobalNavigation {
    INICIO,
    EVENTOS,
    MAPA,
    DONACIONES,
    REGISTRO
}

data class RegistroFormState(
    val nombre: String = "",
    val nit: String = "",
    val direccion: String = "",
    val correo: String = "",
    val password: String = "",
    val confirmPassword: String = "",
    val telefono: String = "",
    val representanteLegal: String = "",
    val barrio: String = "Central",
    val localidad: String = "Kennedy",
    val ciudad: String = "Bogotá",
    val departamento: String = "Bogotá D.C.",
    val pais: String = "Colombia",
    val categoria: String = "Alimentos y Nutrición",
    val mision: String = "",
    val vision: String = "",
    val sitioWeb: String = "",
    val redesSociales: String = "",
    val descripcion: String = "",
    val isSubmitting: Boolean = false,
    val errors: Map<String, String> = emptyMap(),
    val successMessage: String? = null
)

class OrganizacionViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: OrganizacionRepository

    init {
        val db = AppDatabase.getDatabase(application, viewModelScope)
        repository = OrganizacionRepository(
            organizacionDao = db.organizacionDao(),
            eventoDao = db.eventoDao(),
            accionRecienteDao = db.accionRecienteDao(),
            donacionDao = db.donacionDao()
        )
    }

    val todasLasOrganizaciones: StateFlow<List<Organizacion>> = repository.todasLasOrganizaciones
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Estado del Formulario de Registro
    private val _formState = MutableStateFlow(RegistroFormState())
    val formState: StateFlow<RegistroFormState> = _formState.asStateFlow()

    // ID de la organización actualmente seleccionada en el Dashboard
    private val _selectedOrgId = MutableStateFlow(1)
    val selectedOrgId: StateFlow<Int> = _selectedOrgId.asStateFlow()

    // Navegación Global (Inicio, Eventos, Mapa, Donaciones, Registro)
    // Requisito: El registro de organización es lo primero que se ve en pantalla
    private val _currentDestination = MutableStateFlow(GlobalNavigation.REGISTRO)
    val currentDestination: StateFlow<GlobalNavigation> = _currentDestination.asStateFlow()

    // Sub-pestaña del Dashboard (Información General, Mi Perfil, Configuración, Seguimiento de Eventos)
    private val _activeDashboardTab = MutableStateFlow(DashboardTab.INFORMACION_GENERAL)
    val activeDashboardTab: StateFlow<DashboardTab> = _activeDashboardTab.asStateFlow()

    // Notificaciones y eventos de un solo uso
    private val _toastEvent = MutableSharedFlow<String>()
    val toastEvent: SharedFlow<String> = _toastEvent.asSharedFlow()

    // Configuración de la Organización
    private val _pushNotificaciones = MutableStateFlow(true)
    val pushNotificaciones: StateFlow<Boolean> = _pushNotificaciones.asStateFlow()

    private val _emailAlertas = MutableStateFlow(true)
    val emailAlertas: StateFlow<Boolean> = _emailAlertas.asStateFlow()

    private val _perfilPublico = MutableStateFlow(true)
    val perfilPublico: StateFlow<Boolean> = _perfilPublico.asStateFlow()

    @OptIn(ExperimentalCoroutinesApi::class)
    val currentOrganizacion: StateFlow<Organizacion?> = _selectedOrgId
        .flatMapLatest { id -> repository.obtenerOrganizacionPorId(id) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    @OptIn(ExperimentalCoroutinesApi::class)
    val eventosDeOrganizacion: StateFlow<List<Evento>> = _selectedOrgId
        .flatMapLatest { id -> repository.obtenerEventosPorOrg(id) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    @OptIn(ExperimentalCoroutinesApi::class)
    val accionesDeOrganizacion: StateFlow<List<AccionReciente>> = _selectedOrgId
        .flatMapLatest { id -> repository.obtenerAccionesPorOrg(id) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    @OptIn(ExperimentalCoroutinesApi::class)
    val donacionesDeOrganizacion: StateFlow<List<Donacion>> = _selectedOrgId
        .flatMapLatest { id -> repository.obtenerDonacionesPorOrg(id) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    @OptIn(ExperimentalCoroutinesApi::class)
    val totalMontoDonaciones: StateFlow<Double?> = _selectedOrgId
        .flatMapLatest { id -> repository.obtenerTotalMonto(id) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    @OptIn(ExperimentalCoroutinesApi::class)
    val totalParticipantesEventos: StateFlow<Int?> = _selectedOrgId
        .flatMapLatest { id -> repository.obtenerTotalParticipantes(id) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    @OptIn(ExperimentalCoroutinesApi::class)
    val totalEventosConteo: StateFlow<Int> = _selectedOrgId
        .flatMapLatest { id -> repository.obtenerTotalEventos(id) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    // Actualizadores del formulario
    fun onFormNombreChange(value: String) {
        _formState.value = _formState.value.copy(nombre = value, errors = _formState.value.errors - "nombre")
    }

    fun onFormNitChange(value: String) {
        _formState.value = _formState.value.copy(nit = value, errors = _formState.value.errors - "nit")
    }

    fun onFormDireccionChange(value: String) {
        _formState.value = _formState.value.copy(direccion = value, errors = _formState.value.errors - "direccion")
    }

    fun onFormCorreoChange(value: String) {
        _formState.value = _formState.value.copy(correo = value, errors = _formState.value.errors - "correo")
    }

    fun onFormPasswordChange(value: String) {
        _formState.value = _formState.value.copy(password = value, errors = _formState.value.errors - "password")
    }

    fun onFormConfirmPasswordChange(value: String) {
        _formState.value = _formState.value.copy(confirmPassword = value, errors = _formState.value.errors - "confirmPassword")
    }

    fun onFormTelefonoChange(value: String) {
        _formState.value = _formState.value.copy(telefono = value)
    }

    fun onFormRepresentanteChange(value: String) {
        _formState.value = _formState.value.copy(representanteLegal = value)
    }

    fun onFormBarrioChange(value: String) {
        _formState.value = _formState.value.copy(barrio = value)
    }

    fun onFormLocalidadChange(value: String) {
        _formState.value = _formState.value.copy(localidad = value)
    }

    fun onFormCategoriaChange(value: String) {
        _formState.value = _formState.value.copy(categoria = value)
    }

    fun onFormMisionChange(value: String) {
        _formState.value = _formState.value.copy(mision = value)
    }

    fun onFormVisionChange(value: String) {
        _formState.value = _formState.value.copy(vision = value)
    }

    fun onFormSitioWebChange(value: String) {
        _formState.value = _formState.value.copy(sitioWeb = value)
    }

    fun onFormRedesSocialesChange(value: String) {
        _formState.value = _formState.value.copy(redesSociales = value)
    }

    fun onFormDescripcionChange(value: String) {
        _formState.value = _formState.value.copy(descripcion = value)
    }

    fun limpiarFormulario() {
        _formState.value = RegistroFormState()
    }

    fun fillSampleDataForTesting() {
        _formState.value = _formState.value.copy(
            nombre = "Fundación Semillas de Paz Kennedy",
            nit = "901.${(100..999).random()}.${(100..999).random()}-1",
            direccion = "Carrera 78K # 42A-18 Sur",
            correo = "contacto@semillaspazkennedy${(10..99).random()}.org",
            password = "Password123*",
            confirmPassword = "Password123*",
            telefono = "+57 320 789 1234",
            representanteLegal = "Andrés Felipe Castro",
            barrio = "Timiza",
            localidad = "Kennedy",
            ciudad = "Bogotá",
            departamento = "Bogotá D.C.",
            pais = "Colombia",
            categoria = "Educación y Juventud",
            mision = "Promover el arte, la cultura y la educación popular en los barrios vulnerables de Kennedy.",
            vision = "Ser un referente de transformación comunitaria y liderazgo juvenil en Bogotá.",
            sitioWeb = "https://semillaspazkennedy.org",
            redesSociales = "@semillasdepaz_kennedy",
            descripcion = "Organización comunitaria de jóvenes y madres cabeza de familia fomentando proyectos solidarios.",
            errors = emptyMap()
        )
    }

    /**
     * Valida y procesa el registro de una organización en menos de 3 segundos
     */
    fun registrarOrganizacion(onSuccess: (Organizacion) -> Unit) {
        val current = _formState.value
        val newErrors = mutableMapOf<String, String>()

        if (current.nombre.trim().isEmpty()) {
            newErrors["nombre"] = "El nombre de la organización es obligatorio."
        }
        if (current.nit.trim().isEmpty()) {
            newErrors["nit"] = "El NIT es obligatorio."
        }
        if (current.direccion.trim().isEmpty()) {
            newErrors["direccion"] = "La dirección institucional es obligatoria."
        }
        if (current.correo.trim().isEmpty()) {
            newErrors["correo"] = "El correo electrónico institucional es obligatorio."
        } else if (!android.util.Patterns.EMAIL_ADDRESS.matcher(current.correo.trim()).matches()) {
            newErrors["correo"] = "Ingrese un correo electrónico válido."
        }
        if (current.password.length < 6) {
            newErrors["password"] = "La contraseña debe contener al menos 6 caracteres."
        }
        if (current.confirmPassword.isNotEmpty() && current.password != current.confirmPassword) {
            newErrors["confirmPassword"] = "Las contraseñas no coinciden."
        }

        if (newErrors.isNotEmpty()) {
            _formState.value = current.copy(errors = newErrors)
            return
        }

        _formState.value = current.copy(isSubmitting = true, errors = emptyMap())

        viewModelScope.launch {
            val result = repository.registrarOrganizacion(
                nombre = current.nombre,
                nit = current.nit,
                direccion = current.direccion,
                correo = current.correo,
                password = current.password,
                telefono = current.telefono,
                representanteLegal = current.representanteLegal,
                barrio = current.barrio,
                localidad = current.localidad,
                ciudad = current.ciudad,
                departamento = current.departamento,
                pais = current.pais,
                categoria = current.categoria,
                mision = current.mision,
                vision = current.vision,
                sitioWeb = current.sitioWeb,
                redesSociales = current.redesSociales,
                descripcion = current.descripcion
            )

            when (result) {
                is RegistroResult.Success -> {
                    _formState.value = RegistroFormState(
                        successMessage = result.mensaje
                    )
                    _selectedOrgId.value = result.organizacion.idOrganizacion
                    _currentDestination.value = GlobalNavigation.INICIO
                    _activeDashboardTab.value = DashboardTab.INFORMACION_GENERAL
                    _toastEvent.emit("¡Organización registrada! Notificación enviada al correo.")
                    onSuccess(result.organizacion)
                }
                is RegistroResult.Error -> {
                    _formState.value = current.copy(
                        isSubmitting = false,
                        errors = if (result.campo != null) mapOf(result.campo to result.mensaje) else mapOf("general" to result.mensaje)
                    )
                    _toastEvent.emit(result.mensaje)
                }
            }
        }
    }

    fun selectOrganizacion(id: Int) {
        _selectedOrgId.value = id
    }

    fun setDashboardTab(tab: DashboardTab) {
        _activeDashboardTab.value = tab
    }

    fun setGlobalDestination(destination: GlobalNavigation) {
        _currentDestination.value = destination
    }

    fun togglePushNotificaciones() {
        _pushNotificaciones.value = !_pushNotificaciones.value
    }

    fun toggleEmailAlertas() {
        _emailAlertas.value = !_emailAlertas.value
    }

    fun togglePerfilPublico() {
        _perfilPublico.value = !_perfilPublico.value
    }

    fun actualizarPerfil(
        nombre: String,
        nit: String,
        direccion: String,
        telefono: String,
        representanteLegal: String,
        barrio: String,
        localidad: String,
        categoria: String,
        mision: String,
        vision: String,
        sitioWeb: String,
        redesSociales: String,
        descripcion: String,
        onComplete: () -> Unit
    ) {
        val currentOrg = currentOrganizacion.value ?: return
        val updated = currentOrg.copy(
            nombre = nombre.ifBlank { currentOrg.nombre },
            nit = nit.ifBlank { currentOrg.nit },
            direccion = direccion.ifBlank { currentOrg.direccion },
            telefono = telefono.ifBlank { currentOrg.telefono },
            representanteLegal = representanteLegal.ifBlank { currentOrg.representanteLegal },
            barrio = barrio.ifBlank { currentOrg.barrio },
            localidad = localidad.ifBlank { currentOrg.localidad },
            categoria = categoria.ifBlank { currentOrg.categoria },
            mision = mision.ifBlank { currentOrg.mision },
            vision = vision.ifBlank { currentOrg.vision },
            sitioWeb = sitioWeb.ifBlank { currentOrg.sitioWeb },
            redesSociales = redesSociales.ifBlank { currentOrg.redesSociales },
            descripcion = descripcion.ifBlank { currentOrg.descripcion }
        )
        viewModelScope.launch {
            repository.actualizarPerfil(updated)
            _toastEvent.emit("Perfil de la organización actualizado con éxito.")
            onComplete()
        }
    }

    fun cambiarPassword(
        currentPass: String,
        newPass: String,
        confirmPass: String,
        onResult: (Boolean, String) -> Unit
    ) {
        val currentOrg = currentOrganizacion.value ?: return
        if (newPass.length < 6) {
            onResult(false, "La nueva contraseña debe tener al menos 6 caracteres.")
            return
        }
        if (newPass != confirmPass) {
            onResult(false, "La confirmación de la contraseña no coincide.")
            return
        }
        viewModelScope.launch {
            val ok = repository.cambiarPassword(currentOrg.idOrganizacion, newPass)
            if (ok) {
                _toastEvent.emit("Contraseña actualizada exitosamente.")
                onResult(true, "Contraseña cambiada con éxito.")
            } else {
                onResult(false, "No fue posible actualizar la contraseña.")
            }
        }
    }

    fun simularVerificacionAdmin(aprobada: Boolean) {
        val currentOrg = currentOrganizacion.value ?: return
        viewModelScope.launch {
            repository.simularAprobacionVerificacion(currentOrg.idOrganizacion, aprobada)
            val msg = if (aprobada) "Organización aprobada y verificada." else "Verificación marcada como rechazada."
            _toastEvent.emit(msg)
        }
    }

    fun crearEvento(
        nombre: String,
        tipo: String,
        fecha: String,
        hora: String,
        sitio: String,
        participantes: Int,
        cupoMaximo: Int,
        estado: String,
        descripcion: String,
        onComplete: () -> Unit
    ) {
        val currentOrg = currentOrganizacion.value ?: return
        if (nombre.isBlank() || sitio.isBlank()) return

        val nuevoEvento = Evento(
            idOrganizacion = currentOrg.idOrganizacion,
            nombre = nombre.trim(),
            tipo = tipo,
            fecha = fecha.ifBlank { "Próxima semana" },
            hora = hora.ifBlank { "09:00 AM" },
            sitio = sitio.trim(),
            participantes = participantes,
            cupoMaximo = cupoMaximo,
            estado = estado,
            descripcion = descripcion.trim()
        )

        viewModelScope.launch {
            repository.agregarEvento(nuevoEvento)
            _toastEvent.emit("Evento '${nuevoEvento.nombre}' agregado.")
            onComplete()
        }
    }

    fun registrarNuevaDonacion(
        donante: String,
        monto: Double,
        tipo: String,
        mensaje: String,
        onComplete: () -> Unit
    ) {
        val currentOrg = currentOrganizacion.value ?: return
        val donacion = Donacion(
            idOrganizacion = currentOrg.idOrganizacion,
            donante = donante.ifBlank { "Donante Anónimo" },
            monto = monto,
            tipo = tipo,
            mensaje = mensaje
        )
        viewModelScope.launch {
            repository.agregarDonacion(donacion)
            _toastEvent.emit("Donación de $${String.format("%,.0f", monto)} COP registrada.")
            onComplete()
        }
    }

    fun agregarAccionRapida(titulo: String, tipo: String, descripcion: String) {
        val currentOrg = currentOrganizacion.value ?: return
        viewModelScope.launch {
            repository.agregarAccionReciente(
                AccionReciente(
                    idOrganizacion = currentOrg.idOrganizacion,
                    titulo = titulo,
                    tipo = tipo,
                    descripcion = descripcion
                )
            )
            _toastEvent.emit("Acción registrada en el historial.")
        }
    }
}
