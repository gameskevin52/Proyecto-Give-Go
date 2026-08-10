package com.example.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.TrendingUp
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Analytics
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Park
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material.icons.filled.VolunteerActivism
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MenuDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.model.AccionReciente
import com.example.data.model.Evento
import com.example.data.model.Organizacion
import com.example.ui.components.OrgRedHeroCard
import com.example.ui.theme.GiveAccentGreen
import com.example.ui.theme.GiveBackground
import com.example.ui.theme.GiveCardBorder
import com.example.ui.theme.GiveRedDark
import com.example.ui.theme.GiveRedPrimary
import com.example.ui.theme.GiveRedSurface
import com.example.ui.theme.GiveTextMuted
import com.example.ui.theme.GiveTextPrimary
import com.example.ui.theme.GiveTextSecondary
import com.example.ui.viewmodel.DashboardTab
import com.example.ui.viewmodel.OrganizacionViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun DashboardOrganizacionScreen(
    viewModel: OrganizacionViewModel,
    modifier: Modifier = Modifier
) {
    val currentOrg by viewModel.currentOrganizacion.collectAsStateWithLifecycle()
    val todasOrgs by viewModel.todasLasOrganizaciones.collectAsStateWithLifecycle()
    val activeTab by viewModel.activeDashboardTab.collectAsStateWithLifecycle()

    val eventos by viewModel.eventosDeOrganizacion.collectAsStateWithLifecycle()
    val acciones by viewModel.accionesDeOrganizacion.collectAsStateWithLifecycle()
    val totalMonto by viewModel.totalMontoDonaciones.collectAsStateWithLifecycle()
    val totalParticipantes by viewModel.totalParticipantesEventos.collectAsStateWithLifecycle()
    val totalEventos by viewModel.totalEventosConteo.collectAsStateWithLifecycle()

    var showEditProfileDialog by remember { mutableStateOf(false) }
    var showChangePasswordDialog by remember { mutableStateOf(false) }
    var showCreateEventDialog by remember { mutableStateOf(false) }
    var showQuickActionDialog by remember { mutableStateOf(false) }

    val scrollState = rememberScrollState()

    // Dialogo de Edición de Perfil
    if (showEditProfileDialog && currentOrg != null) {
        EditProfileModal(
            organizacion = currentOrg!!,
            onDismiss = { showEditProfileDialog = false },
            onSave = { updatedOrg ->
                viewModel.actualizarPerfil(
                    nombre = updatedOrg.nombre,
                    nit = updatedOrg.nit ?: "",
                    direccion = updatedOrg.direccion ?: "",
                    telefono = updatedOrg.telefono ?: "",
                    representanteLegal = updatedOrg.representanteLegal ?: "",
                    barrio = updatedOrg.barrio ?: "",
                    localidad = updatedOrg.localidad ?: "Kennedy",
                    categoria = updatedOrg.categoria ?: "Asistencia Social",
                    mision = updatedOrg.mision ?: "",
                    vision = updatedOrg.vision ?: "",
                    sitioWeb = updatedOrg.sitioWeb ?: "",
                    redesSociales = updatedOrg.redesSociales ?: "",
                    descripcion = updatedOrg.descripcion ?: ""
                ) {
                    showEditProfileDialog = false
                }
            }
        )
    }

    // Dialogo de Cambio de Contraseña
    if (showChangePasswordDialog && currentOrg != null) {
        ChangePasswordModal(
            onDismiss = { showChangePasswordDialog = false },
            onSubmit = { currentPass, newPass, confirmPass, callback ->
                viewModel.cambiarPassword(currentPass, newPass, confirmPass, callback)
            }
        )
    }

    // Dialogo de Crear Nuevo Evento
    if (showCreateEventDialog && currentOrg != null) {
        CreateEventModal(
            onDismiss = { showCreateEventDialog = false },
            onSubmit = { nombre, tipo, fecha, hora, sitio, cupo, descripcion ->
                viewModel.crearEvento(
                    nombre = nombre,
                    tipo = tipo,
                    fecha = fecha,
                    hora = hora,
                    sitio = sitio,
                    participantes = 0,
                    cupoMaximo = cupo,
                    estado = "Programado",
                    descripcion = descripcion
                ) {
                    showCreateEventDialog = false
                }
            }
        )
    }

    // Dialogo de Simular Acción Rápida (Donación / Voluntario)
    if (showQuickActionDialog) {
        QuickActionModal(
            onDismiss = { showQuickActionDialog = false },
            onRegistrarDonacion = { donante, monto, tipo, msg ->
                viewModel.registrarNuevaDonacion(donante, monto, tipo, msg) {
                    showQuickActionDialog = false
                }
            },
            onRegistrarVoluntario = { nombreVoluntario, rol ->
                viewModel.agregarAccionRapida(
                    titulo = "Nuevo voluntario registrado",
                    tipo = "voluntario",
                    descripcion = "$nombreVoluntario se unió como $rol."
                )
                showQuickActionDialog = false
            },
            onRegistrarDistribucion = { desc ->
                viewModel.agregarAccionRapida(
                    titulo = "Distribución completada",
                    tipo = "distribucion",
                    descripcion = desc
                )
                showQuickActionDialog = false
            }
        )
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(GiveBackground)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = 16.dp, vertical = 16.dp)
        ) {
            // 1. Panel / Caja Roja destacada con datos de la organización recién creada o seleccionada
            OrgRedHeroCard(
                organizacion = currentOrg,
                todasLasOrganizaciones = todasOrgs,
                onSelectOrg = { id -> viewModel.selectOrganizacion(id) },
                onSimularVerificacion = { aprobada -> viewModel.simularVerificacionAdmin(aprobada) }
            )

            Spacer(modifier = Modifier.height(14.dp))

            // 2. Quick Action 2x2 Grid Buttons (Design Spec: Sleek Interface)
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    SleekQuickActionButton(
                        title = "Info General",
                        icon = Icons.Default.Add,
                        isSelected = activeTab == DashboardTab.INFORMACION_GENERAL,
                        onClick = { viewModel.setDashboardTab(DashboardTab.INFORMACION_GENERAL) },
                        tag = "tab_btn_info_general",
                        modifier = Modifier.weight(1f)
                    )

                    SleekQuickActionButton(
                        title = "Mi Perfil",
                        icon = Icons.Default.Person,
                        isSelected = activeTab == DashboardTab.MI_PERFIL,
                        showEditBadge = true,
                        onEditBadgeClick = { showEditProfileDialog = true },
                        onClick = { viewModel.setDashboardTab(DashboardTab.MI_PERFIL) },
                        tag = "tab_btn_mi_perfil",
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    SleekQuickActionButton(
                        title = "Configuración",
                        icon = Icons.Default.Settings,
                        isSelected = activeTab == DashboardTab.CONFIGURACION,
                        onClick = { viewModel.setDashboardTab(DashboardTab.CONFIGURACION) },
                        tag = "tab_btn_configuracion",
                        modifier = Modifier.weight(1f)
                    )

                    SleekQuickActionButton(
                        title = "Eventos",
                        icon = Icons.Default.Event,
                        isSelected = activeTab == DashboardTab.SEGUIMIENTO_EVENTOS,
                        onClick = { viewModel.setDashboardTab(DashboardTab.SEGUIMIENTO_EVENTOS) },
                        tag = "tab_btn_eventos",
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 3. Contenido Dinámico de la Sección Seleccionada
            AnimatedContent(
                targetState = activeTab,
                transitionSpec = { fadeIn() togetherWith fadeOut() },
                label = "DashboardTabContent"
            ) { target ->
                when (target) {
                    DashboardTab.INFORMACION_GENERAL -> {
                        val vCount = acciones.count { it.tipo == "voluntario" }
                        SeccionInformacionGeneral(
                            totalMonto = totalMonto ?: 0.0,
                            totalParticipantes = totalParticipantes ?: 0,
                            voluntariosCount = vCount,
                            impactoMensual = if ((totalMonto ?: 0.0) > 0.0) "Activo" else "0%",
                            acciones = acciones,
                            onOpenQuickAction = { showQuickActionDialog = true }
                        )
                    }

                    DashboardTab.MI_PERFIL -> {
                        SeccionMiPerfil(
                            organizacion = currentOrg,
                            onEditarPerfilClick = { showEditProfileDialog = true }
                        )
                    }

                    DashboardTab.CONFIGURACION -> {
                        val pushNotif by viewModel.pushNotificaciones.collectAsStateWithLifecycle()
                        val emailAlerts by viewModel.emailAlertas.collectAsStateWithLifecycle()
                        val perfilPublico by viewModel.perfilPublico.collectAsStateWithLifecycle()

                        SeccionConfiguracion(
                            pushNotificaciones = pushNotif,
                            onTogglePush = { viewModel.togglePushNotificaciones() },
                            emailAlertas = emailAlerts,
                            onToggleEmail = { viewModel.toggleEmailAlertas() },
                            perfilPublico = perfilPublico,
                            onTogglePerfilPublico = { viewModel.togglePerfilPublico() },
                            onChangePasswordClick = { showChangePasswordDialog = true }
                        )
                    }

                    DashboardTab.SEGUIMIENTO_EVENTOS -> {
                        SeccionSeguimientoEventos(
                            totalEventos = eventos.size,
                            totalParticipantes = totalParticipantes ?: 0,
                            eventosEsteMes = eventos.count { it.estado != "Completado" },
                            tasaExito = if (eventos.isNotEmpty()) "100%" else "0%",
                            eventos = eventos,
                            onCrearEventoClick = { showCreateEventDialog = true }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

/**
 * Sleek 2x2 Quick Action Button Component
 * Matches the design HTML spec:
 * - Rounded-2xl (16dp)
 * - Slate-50 background with Slate-100 border
 * - Red-50 icon container with Red-600 icon
 * - Uppercase bold tracking-wider text
 * - Edit badge pill on top right for Mi Perfil
 */
@Composable
fun SleekQuickActionButton(
    title: String,
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit,
    tag: String,
    modifier: Modifier = Modifier,
    showEditBadge: Boolean = false,
    onEditBadgeClick: (() -> Unit)? = null
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(
                if (isSelected) com.example.ui.theme.GiveRedSurface else com.example.ui.theme.Slate50,
                RoundedCornerShape(16.dp)
            )
            .border(
                width = if (isSelected) 1.5.dp else 1.dp,
                color = if (isSelected) GiveRedPrimary else com.example.ui.theme.Slate200,
                shape = RoundedCornerShape(16.dp)
            )
            .clickable { onClick() }
            .padding(vertical = 12.dp, horizontal = 8.dp)
            .testTag(tag),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Icon container: w-8 h-8 rounded-lg bg-red-50 text-red-600
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .background(com.example.ui.theme.GiveRedSurface, RoundedCornerShape(8.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = GiveRedPrimary,
                    modifier = Modifier.size(18.dp)
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = title.uppercase(),
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.8.sp,
                color = if (isSelected) GiveRedPrimary else com.example.ui.theme.Slate700,
                textAlign = TextAlign.Center
            )
        }

        // Edit Badge Pill for Mi Perfil
        if (showEditBadge) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(end = 2.dp, top = 2.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(GiveRedPrimary, RoundedCornerShape(8.dp))
                    .border(1.5.dp, Color.White, RoundedCornerShape(8.dp))
                    .clickable {
                        onEditBadgeClick?.invoke() ?: onClick()
                    }
                    .padding(horizontal = 6.dp, vertical = 2.dp)
                    .testTag("btn_editar_perfil_badge")
            ) {
                Text(
                    text = "Edit",
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }
    }
}

// =========================================================================
// SECCIÓN 1: INFORMACIÓN GENERAL
// =========================================================================
@Composable
fun SeccionInformacionGeneral(
    totalMonto: Double,
    totalParticipantes: Int,
    voluntariosCount: Int,
    impactoMensual: String,
    acciones: List<AccionReciente>,
    onOpenQuickAction: () -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // 2x2 Sleek Stat Cards
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Card 1: Donaciones
            SleekStatCard(
                title = "Donaciones",
                value = "$${String.format("%,.0f", totalMonto)}",
                trend = "12% hoy",
                trendPositive = true,
                modifier = Modifier.weight(1f)
            )

            // Card 2: Beneficiarios
            SleekStatCard(
                title = "Beneficiarios",
                value = "$totalParticipantes",
                subtitle = "En Kennedy",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Card 3: Voluntarios
            SleekStatCard(
                title = "Voluntarios",
                value = "$voluntariosCount",
                hasAvatarStack = true,
                modifier = Modifier.weight(1f)
            )

            // Card 4: Impacto
            SleekStatCard(
                title = "Impacto",
                value = "Alto",
                subtitle = "Mensual",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Botón Registrar Nueva Acción / Donación
        Button(
            onClick = onOpenQuickAction,
            colors = ButtonDefaults.buttonColors(containerColor = Color.White),
            border = androidx.compose.foundation.BorderStroke(1.dp, com.example.ui.theme.Slate200),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(46.dp)
                .testTag("btn_simular_accion")
        ) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = null,
                tint = GiveRedPrimary,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "Registrar Nueva Donación o Acción",
                color = com.example.ui.theme.Slate800,
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp
            )
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Acciones Recientes
        Text(
            text = "ACCIONES RECIENTES",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp,
            color = com.example.ui.theme.Slate800,
            modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
        )

        Spacer(modifier = Modifier.height(6.dp))

        if (acciones.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(com.example.ui.theme.Slate50)
                    .border(1.dp, com.example.ui.theme.Slate100, RoundedCornerShape(14.dp))
                    .padding(vertical = 20.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Aún no hay acciones registradas.",
                    color = com.example.ui.theme.Slate400,
                    fontSize = 12.sp
                )
            }
        } else {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                acciones.take(6).forEach { accion ->
                    SleekAccionItem(accion = accion)
                }
            }
        }
    }
}

/**
 * Sleek Stat Card
 * - White surface with Slate-100 border and subtle shadow
 * - Bold uppercase tracking-wider text-slate-400 header
 * - Large text-xl bold text-slate-800 value
 * - Emerald trend badge or stacked avatar badges
 */
@Composable
fun SleekStatCard(
    title: String,
    value: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    trend: String? = null,
    trendPositive: Boolean = true,
    hasAvatarStack: Boolean = false
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        border = androidx.compose.foundation.BorderStroke(1.dp, com.example.ui.theme.Slate200),
        shadowElevation = 1.dp
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(
                text = title.uppercase(),
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.8.sp,
                color = com.example.ui.theme.Slate400
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = value,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = com.example.ui.theme.Slate800,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(4.dp))

            if (trend != null) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.TrendingUp,
                        contentDescription = null,
                        tint = com.example.ui.theme.GiveAccentEmerald,
                        modifier = Modifier.size(12.dp)
                    )
                    Spacer(modifier = Modifier.width(3.dp))
                    Text(
                        text = trend,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = com.example.ui.theme.GiveAccentEmerald
                    )
                }
            } else if (hasAvatarStack) {
                Row(
                    modifier = Modifier.padding(top = 2.dp),
                    horizontalArrangement = Arrangement.spacedBy((-4).dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(16.dp)
                            .clip(CircleShape)
                            .background(com.example.ui.theme.GiveRedContainer)
                            .border(1.5.dp, Color.White, CircleShape)
                    )
                    Box(
                        modifier = Modifier
                            .size(16.dp)
                            .clip(CircleShape)
                            .background(com.example.ui.theme.Slate200)
                            .border(1.5.dp, Color.White, CircleShape)
                    )
                    Box(
                        modifier = Modifier
                            .size(16.dp)
                            .clip(CircleShape)
                            .background(com.example.ui.theme.Slate300)
                            .border(1.5.dp, Color.White, CircleShape)
                    )
                }
            } else if (subtitle != null) {
                Text(
                    text = subtitle,
                    fontSize = 10.sp,
                    color = com.example.ui.theme.Slate400
                )
            }
        }
    }
}

/**
 * Sleek Recent Action Item
 * - bg-slate-50 rounded-xl p-2.5 flex items-center gap-3
 * - Soft colored icon box (w-8 h-8 rounded-lg)
 * - text-xs font-bold text-slate-700 title
 * - text-[10px] text-slate-400 subtitle
 */
@Composable
fun SleekAccionItem(accion: AccionReciente) {
    val (iconBg, iconColor, iconVector) = when (accion.tipo) {
        "donacion" -> Triple(
            com.example.ui.theme.GiveAccentEmeraldBg,
            com.example.ui.theme.GiveAccentEmerald,
            Icons.Default.Add
        )
        "voluntario" -> Triple(
            com.example.ui.theme.GiveAccentBlueBg,
            com.example.ui.theme.GiveAccentBlue,
            Icons.Default.People
        )
        "distribucion" -> Triple(
            com.example.ui.theme.GiveAccentAmberBg,
            com.example.ui.theme.GiveAccentAmber,
            Icons.Default.CheckCircle
        )
        else -> Triple(
            com.example.ui.theme.GiveRedSurface,
            GiveRedPrimary,
            Icons.Default.VolunteerActivism
        )
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(com.example.ui.theme.Slate50)
            .border(1.dp, com.example.ui.theme.Slate100, RoundedCornerShape(12.dp))
            .padding(10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Soft icon box
        Box(
            modifier = Modifier
                .size(32.dp)
                .background(iconBg, RoundedCornerShape(8.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = iconVector,
                contentDescription = null,
                tint = iconColor,
                modifier = Modifier.size(16.dp)
            )
        }

        Spacer(modifier = Modifier.width(10.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = accion.titulo,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = com.example.ui.theme.Slate700
            )

            Spacer(modifier = Modifier.height(1.dp))

            Text(
                text = "${formatTimeAgo(accion.fecha)} • ${accion.descripcion}",
                fontSize = 10.sp,
                color = com.example.ui.theme.Slate400,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}


// =========================================================================
// SECCIÓN 2: MI PERFIL
// =========================================================================
@Composable
fun SeccionMiPerfil(
    organizacion: Organizacion?,
    onEditarPerfilClick: () -> Unit
) {
    val org = organizacion ?: return

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            // Cabecera de Mi Perfil con Botón Rojo en la esquina superior "Editar perfil"
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Mi Perfil",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    color = GiveTextPrimary
                )

                // Botón Rojo en la esquina superior "Editar perfil"
                Button(
                    onClick = onEditarPerfilClick,
                    colors = ButtonDefaults.buttonColors(containerColor = GiveRedPrimary),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                    modifier = Modifier.testTag("btn_editar_perfil")
                ) {
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = "Editar",
                        tint = Color.White,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Editar perfil",
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider(color = Color(0xFFF1F5F9))
            Spacer(modifier = Modifier.height(16.dp))

            // Información Registrada en la Base de Datos
            ProfileDataRow(label = "ID Organización", value = "#${org.idOrganizacion}")
            ProfileDataRow(label = "Nombre Oficial", value = org.nombre)
            ProfileDataRow(label = "NIT", value = org.nit ?: "No registrado")
            ProfileDataRow(label = "Correo Institucional", value = org.correo)
            ProfileDataRow(label = "Teléfono de Contacto", value = org.telefono ?: "No especificado")
            ProfileDataRow(label = "Dirección", value = org.direccion ?: "No especificada")
            ProfileDataRow(label = "Representante Legal", value = org.representanteLegal ?: "Organización")
            ProfileDataRow(label = "Barrio", value = org.barrio ?: "Central")
            ProfileDataRow(label = "Localidad", value = "${org.localidad} (Bogotá)")
            ProfileDataRow(label = "Ciudad / Departamento", value = "${org.ciudad} - ${org.departamento}")
            ProfileDataRow(label = "País", value = org.pais ?: "Colombia")
            ProfileDataRow(label = "Categoría", value = org.categoria ?: "Asistencia Social")
            ProfileDataRow(label = "Estado de Verificación", value = if (org.estadoVerificacion == "aprobada") "Verificada" else "Pendiente de verificación")
            ProfileDataRow(label = "Fecha de Registro", value = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault()).format(Date(org.fechaRegistro)))

            if (!org.mision.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = "Misión:",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = GiveTextSecondary
                )
                Text(
                    text = org.mision,
                    fontSize = 13.sp,
                    color = GiveTextPrimary,
                    modifier = Modifier.padding(top = 2.dp)
                )
            }

            if (!org.vision.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = "Visión:",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = GiveTextSecondary
                )
                Text(
                    text = org.vision,
                    fontSize = 13.sp,
                    color = GiveTextPrimary,
                    modifier = Modifier.padding(top = 2.dp)
                )
            }

            if (!org.sitioWeb.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                ProfileDataRow(label = "Sitio Web", value = org.sitioWeb)
            }

            if (!org.redesSociales.isNullOrBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                ProfileDataRow(label = "Redes Sociales", value = org.redesSociales)
            }
        }
    }
}

@Composable
fun ProfileDataRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            fontSize = 12.sp,
            color = GiveTextSecondary,
            modifier = Modifier.weight(0.45f)
        )
        Text(
            text = value,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = GiveTextPrimary,
            textAlign = TextAlign.End,
            modifier = Modifier.weight(0.55f)
        )
    }
}

// =========================================================================
// SECCIÓN 3: CONFIGURACIÓN
// =========================================================================
@Composable
fun SeccionConfiguracion(
    pushNotificaciones: Boolean,
    onTogglePush: () -> Unit,
    emailAlertas: Boolean,
    onToggleEmail: () -> Unit,
    perfilPublico: Boolean,
    onTogglePerfilPublico: () -> Unit,
    onChangePasswordClick: () -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Text(
                    text = "Notificaciones y Alertas",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = GiveTextPrimary
                )

                Spacer(modifier = Modifier.height(14.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Notificaciones Push",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = GiveTextPrimary
                        )
                        Text(
                            text = "Recibir avisos de nuevas donaciones y voluntarios",
                            fontSize = 12.sp,
                            color = GiveTextSecondary
                        )
                    }
                    Switch(
                        checked = pushNotificaciones,
                        onCheckedChange = { onTogglePush() },
                        colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = GiveRedPrimary)
                    )
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp), color = Color(0xFFF1F5F9))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Alertas a Correo Institucional",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = GiveTextPrimary
                        )
                        Text(
                            text = "Resúmenes semanales y reportes de donación",
                            fontSize = 12.sp,
                            color = GiveTextSecondary
                        )
                    }
                    Switch(
                        checked = emailAlertas,
                        onCheckedChange = { onToggleEmail() },
                        colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = GiveRedPrimary)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Card Privacidad y Seguridad
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Text(
                    text = "Privacidad y Seguridad",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = GiveTextPrimary
                )

                Spacer(modifier = Modifier.height(14.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Perfil Público Visible",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = GiveTextPrimary
                        )
                        Text(
                            text = "Permitir que donantes encuentren tu organización en el mapa",
                            fontSize = 12.sp,
                            color = GiveTextSecondary
                        )
                    }
                    Switch(
                        checked = perfilPublico,
                        onCheckedChange = { onTogglePerfilPublico() },
                        colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = GiveRedPrimary)
                    )
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 14.dp), color = Color(0xFFF1F5F9))

                // Botón dentro de Cambiar Contraseña (Requisito: solo un botón dentro de cambiar contraseña)
                Button(
                    onClick = onChangePasswordClick,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF1F5F9)),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("btn_cambiar_password")
                ) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = null,
                        tint = GiveRedPrimary,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Cambiar Contraseña",
                        color = GiveRedPrimary,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

// =========================================================================
// SECCIÓN 4: SEGUIMIENTO DE EVENTOS
// =========================================================================
@Composable
fun SeccionSeguimientoEventos(
    totalEventos: Int,
    totalParticipantes: Int,
    eventosEsteMes: Int,
    tasaExito: String,
    eventos: List<Evento>,
    onCrearEventoClick: () -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // 4 Sleek Stat Cards de Eventos
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            SleekStatCard(
                title = "Total Eventos",
                value = "$totalEventos",
                subtitle = "Histórico organizado",
                modifier = Modifier.weight(1f)
            )

            SleekStatCard(
                title = "Participantes",
                value = "$totalParticipantes",
                subtitle = "Asistentes registrados",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            SleekStatCard(
                title = "Este Mes",
                value = "$eventosEsteMes",
                subtitle = "En agenda activa",
                modifier = Modifier.weight(1f)
            )

            SleekStatCard(
                title = "Tasa Éxito",
                value = tasaExito,
                trend = "Cumplimiento",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Card: Eventos por Tipo (Estadística de Salud, Educación, Medio Ambiente, Alimentos)
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.PieChart,
                            contentDescription = null,
                            tint = GiveRedPrimary,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Eventos por Tipo",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = GiveTextPrimary
                        )
                    }

                    Text(
                        text = "Estadística Global",
                        fontSize = 12.sp,
                        color = GiveTextSecondary
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Salud
                val saludCount = eventos.count { it.tipo.contains("Salud", ignoreCase = true) } + 5
                val educacionCount = eventos.count { it.tipo.contains("Educación", ignoreCase = true) } + 6
                val medioAmbienteCount = eventos.count { it.tipo.contains("Medio", ignoreCase = true) } + 3
                val alimentosCount = eventos.count { it.tipo.contains("Alimento", ignoreCase = true) } + 4
                val totalSuma = (saludCount + educacionCount + medioAmbienteCount + alimentosCount).coerceAtLeast(1)

                EventoTipoProgress(
                    tipo = "Salud y Prevención",
                    conteo = saludCount,
                    total = totalSuma,
                    color = Color(0xFFE53935),
                    icon = Icons.Default.LocalHospital
                )

                Spacer(modifier = Modifier.height(12.dp))

                EventoTipoProgress(
                    tipo = "Educación y Talleres",
                    conteo = educacionCount,
                    total = totalSuma,
                    color = Color(0xFF1E88E5),
                    icon = Icons.Default.School
                )

                Spacer(modifier = Modifier.height(12.dp))

                EventoTipoProgress(
                    tipo = "Medio Ambiente y Siembra",
                    conteo = medioAmbienteCount,
                    total = totalSuma,
                    color = Color(0xFF43A047),
                    icon = Icons.Default.Park
                )

                Spacer(modifier = Modifier.height(12.dp))

                EventoTipoProgress(
                    tipo = "Alimentos y Mercados Solidarios",
                    conteo = alimentosCount,
                    total = totalSuma,
                    color = Color(0xFFFB8C00),
                    icon = Icons.Default.Restaurant
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Card: Historial de Eventos (con fechas, nombre, sitio y participantes)
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Historial de Eventos",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = GiveTextPrimary
                    )

                    Button(
                        onClick = onCrearEventoClick,
                        colors = ButtonDefaults.buttonColors(containerColor = GiveRedPrimary),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp),
                        modifier = Modifier.testTag("btn_crear_evento")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Crear Evento",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                if (eventos.isEmpty()) {
                    Text(
                        text = "No hay eventos en el historial.",
                        color = GiveTextMuted,
                        fontSize = 13.sp,
                        modifier = Modifier.padding(vertical = 12.dp)
                    )
                } else {
                    eventos.forEachIndexed { index, ev ->
                        EventoHistorialItem(evento = ev)
                        if (index < eventos.size - 1) {
                            HorizontalDivider(
                                modifier = Modifier.padding(vertical = 10.dp),
                                color = Color(0xFFF1F5F9)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun EventoTipoProgress(
    tipo: String,
    conteo: Int,
    total: Int,
    color: Color,
    icon: ImageVector
) {
    val progress = (conteo.toFloat() / total).coerceIn(0f, 1f)
    val percentage = (progress * 100).toInt()

    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = color,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = tipo,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = GiveTextPrimary
                )
            }
            Text(
                text = "$conteo eventos ($percentage%)",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = color
            )
        }

        Spacer(modifier = Modifier.height(6.dp))

        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .clip(RoundedCornerShape(4.dp)),
            color = color,
            trackColor = Color(0xFFF1F5F9)
        )
    }
}

@Composable
fun EventoHistorialItem(evento: Evento) {
    val statusBg = when (evento.estado) {
        "Completado" -> Color(0xFFE8F5E9)
        "En curso" -> Color(0xFFE3F2FD)
        else -> Color(0xFFFFF3E0)
    }
    val statusColor = when (evento.estado) {
        "Completado" -> Color(0xFF2E7D32)
        "En curso" -> Color(0xFF1976D2)
        else -> Color(0xFFF57C00)
    }

    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = evento.nombre,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = GiveTextPrimary,
                modifier = Modifier.weight(1f)
            )

            Surface(
                color = statusBg,
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(
                    text = evento.estado,
                    color = statusColor,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(4.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.CalendarMonth,
                contentDescription = null,
                tint = GiveTextMuted,
                modifier = Modifier.size(13.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "${evento.fecha} • ${evento.hora}",
                fontSize = 12.sp,
                color = GiveTextSecondary
            )

            Spacer(modifier = Modifier.width(12.dp))

            Icon(
                imageVector = Icons.Default.People,
                contentDescription = null,
                tint = GiveTextMuted,
                modifier = Modifier.size(13.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "${evento.participantes} participantes",
                fontSize = 12.sp,
                color = GiveTextSecondary
            )
        }

        Spacer(modifier = Modifier.height(2.dp))

        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = Icons.Default.LocationOn,
                contentDescription = null,
                tint = GiveRedPrimary,
                modifier = Modifier.size(13.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = evento.sitio,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = GiveTextPrimary
            )
        }
    }
}

// =========================================================================
// MODALES: EDICIÓN, CAMBIO DE PASSWORD, CREAR EVENTO Y ACCIONES RÁPIDAS
// =========================================================================
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditProfileModal(
    organizacion: Organizacion,
    onDismiss: () -> Unit,
    onSave: (Organizacion) -> Unit
) {
    var nombre by remember { mutableStateOf(organizacion.nombre) }
    var direccion by remember { mutableStateOf(organizacion.direccion ?: "") }
    var telefono by remember { mutableStateOf(organizacion.telefono ?: "") }
    var representante by remember { mutableStateOf(organizacion.representanteLegal ?: "") }
    var barrio by remember { mutableStateOf(organizacion.barrio ?: "") }
    var mision by remember { mutableStateOf(organizacion.mision ?: "") }
    var vision by remember { mutableStateOf(organizacion.vision ?: "") }
    var sitioWeb by remember { mutableStateOf(organizacion.sitioWeb ?: "") }
    var redesSociales by remember { mutableStateOf(organizacion.redesSociales ?: "") }
    var descripcion by remember { mutableStateOf(organizacion.descripcion ?: "") }

    val scroll = rememberScrollState()

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "Editar Perfil de la Organización",
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp
            )
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(scroll)
            ) {
                OutlinedTextField(
                    value = nombre,
                    onValueChange = { nombre = it },
                    label = { Text("Nombre de la Organización") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = direccion,
                    onValueChange = { direccion = it },
                    label = { Text("Dirección Institucional") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = telefono,
                    onValueChange = { telefono = it },
                    label = { Text("Teléfono de Contacto") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = representante,
                    onValueChange = { representante = it },
                    label = { Text("Representante Legal") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = barrio,
                    onValueChange = { barrio = it },
                    label = { Text("Barrio en Kennedy") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = mision,
                    onValueChange = { mision = it },
                    label = { Text("Misión") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = vision,
                    onValueChange = { vision = it },
                    label = { Text("Visión") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = sitioWeb,
                    onValueChange = { sitioWeb = it },
                    label = { Text("Sitio Web") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = redesSociales,
                    onValueChange = { redesSociales = it },
                    label = { Text("Redes Sociales") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    onSave(
                        organizacion.copy(
                            nombre = nombre,
                            direccion = direccion,
                            telefono = telefono,
                            representanteLegal = representante,
                            barrio = barrio,
                            mision = mision,
                            vision = vision,
                            sitioWeb = sitioWeb,
                            redesSociales = redesSociales,
                            descripcion = descripcion
                        )
                    )
                },
                colors = ButtonDefaults.buttonColors(containerColor = GiveRedPrimary)
            ) {
                Text("Guardar Cambios")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar", color = GiveTextSecondary)
            }
        },
        containerColor = Color.White,
        shape = RoundedCornerShape(18.dp)
    )
}

@Composable
fun ChangePasswordModal(
    onDismiss: () -> Unit,
    onSubmit: (String, String, String, (Boolean, String) -> Unit) -> Unit
) {
    var currentPass by remember { mutableStateOf("") }
    var newPass by remember { mutableStateOf("") }
    var confirmPass by remember { mutableStateOf("") }
    var errorMsg by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "Cambiar Contraseña",
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp
            )
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                errorMsg?.let {
                    Text(text = it, color = GiveRedPrimary, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                }

                OutlinedTextField(
                    value = currentPass,
                    onValueChange = { currentPass = it },
                    label = { Text("Contraseña Actual") },
                    visualTransformation = PasswordVisualTransformation(),
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = newPass,
                    onValueChange = { newPass = it },
                    label = { Text("Nueva Contraseña") },
                    visualTransformation = PasswordVisualTransformation(),
                    supportingText = { Text("Mínimo 6 caracteres", fontSize = 11.sp) },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = confirmPass,
                    onValueChange = { confirmPass = it },
                    label = { Text("Confirmar Nueva Contraseña") },
                    visualTransformation = PasswordVisualTransformation(),
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (newPass.length < 6) {
                        errorMsg = "La nueva contraseña debe tener al menos 6 caracteres."
                        return@Button
                    }
                    if (newPass != confirmPass) {
                        errorMsg = "Las contraseñas no coinciden."
                        return@Button
                    }
                    onSubmit(currentPass, newPass, confirmPass) { success, msg ->
                        if (success) {
                            onDismiss()
                        } else {
                            errorMsg = msg
                        }
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = GiveRedPrimary)
            ) {
                Text("Actualizar Contraseña")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar", color = GiveTextSecondary)
            }
        },
        containerColor = Color.White,
        shape = RoundedCornerShape(18.dp)
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateEventModal(
    onDismiss: () -> Unit,
    onSubmit: (String, String, String, String, String, Int, String) -> Unit
) {
    var nombre by remember { mutableStateOf("") }
    var tipo by remember { mutableStateOf("Salud") }
    var fecha by remember { mutableStateOf("20 Ago 2026") }
    var hora by remember { mutableStateOf("09:00 AM") }
    var sitio by remember { mutableStateOf("Salón Comunal Castilla, Kennedy") }
    var cupo by remember { mutableStateOf("100") }
    var descripcion by remember { mutableStateOf("") }

    val tipos = listOf("Salud", "Educación", "Medio Ambiente", "Alimentos")
    var expandedTipo by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "Crear Nuevo Evento Comunitario",
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp
            )
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = nombre,
                    onValueChange = { nombre = it },
                    label = { Text("Nombre del Evento *") },
                    placeholder = { Text("Ej. Jornada de Vacunación") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))

                ExposedDropdownMenuBox(
                    expanded = expandedTipo,
                    onExpandedChange = { expandedTipo = !expandedTipo }
                ) {
                    OutlinedTextField(
                        value = tipo,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Tipo de Evento") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedTipo) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor()
                    )
                    ExposedDropdownMenu(
                        expanded = expandedTipo,
                        onDismissRequest = { expandedTipo = false },
                        modifier = Modifier.background(Color.White)
                    ) {
                        tipos.forEach { item ->
                            DropdownMenuItem(
                                text = { Text(item, color = Color.Black, fontWeight = FontWeight.Medium) },
                                onClick = {
                                    tipo = item
                                    expandedTipo = false
                                },
                                colors = MenuDefaults.itemColors(
                                    textColor = Color.Black
                                ),
                                modifier = Modifier.background(Color.White)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Row(modifier = Modifier.fillMaxWidth()) {
                    OutlinedTextField(
                        value = fecha,
                        onValueChange = { fecha = it },
                        label = { Text("Fecha") },
                        modifier = Modifier.weight(1f)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    OutlinedTextField(
                        value = hora,
                        onValueChange = { hora = it },
                        label = { Text("Hora") },
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = sitio,
                    onValueChange = { sitio = it },
                    label = { Text("Sitio / Dirección en Bogotá") },
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = cupo,
                    onValueChange = { cupo = it },
                    label = { Text("Cupo Máximo Estimado") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (nombre.isNotBlank() && sitio.isNotBlank()) {
                        val cupoInt = cupo.toIntOrNull() ?: 50
                        onSubmit(nombre, tipo, fecha, hora, sitio, cupoInt, descripcion)
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = GiveRedPrimary)
            ) {
                Text("Guardar Evento")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar", color = GiveTextSecondary)
            }
        },
        containerColor = Color.White,
        shape = RoundedCornerShape(18.dp)
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuickActionModal(
    onDismiss: () -> Unit,
    onRegistrarDonacion: (String, Double, String, String) -> Unit,
    onRegistrarVoluntario: (String, String) -> Unit,
    onRegistrarDistribucion: (String) -> Unit
) {
    var actionType by remember { mutableStateOf("donacion") } // donacion, voluntario, distribucion

    var donante by remember { mutableStateOf("Empresa Amiga de Kennedy") }
    var montoStr by remember { mutableStateOf("450000") }
    var tipoDonacion by remember { mutableStateOf("Económica") }

    var voluntarioNombre by remember { mutableStateOf("Laura Torres") }
    var voluntarioRol by remember { mutableStateOf("Coordinadora de Salud") }

    var distribucionDesc by remember { mutableStateOf("Entrega de 40 paquetes alimentarios en Barrio Timiza.") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "Registrar Nueva Acción en Give&Go",
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp
            )
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                // Selector de Tipo de Acción
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    listOf("donacion" to "Donación", "voluntario" to "Voluntario", "distribucion" to "Distribución").forEach { (key, label) ->
                        Surface(
                            color = if (actionType == key) GiveRedPrimary else Color(0xFFF1F5F9),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(10.dp))
                                .clickable { actionType = key }
                        ) {
                            Text(
                                text = label,
                                color = if (actionType == key) Color.White else GiveTextPrimary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(vertical = 8.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                when (actionType) {
                    "donacion" -> {
                        OutlinedTextField(
                            value = donante,
                            onValueChange = { donante = it },
                            label = { Text("Donante") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = montoStr,
                            onValueChange = { montoStr = it },
                            label = { Text("Monto (COP)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = tipoDonacion,
                            onValueChange = { tipoDonacion = it },
                            label = { Text("Tipo (Económica, Alimentos, Ropa)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }

                    "voluntario" -> {
                        OutlinedTextField(
                            value = voluntarioNombre,
                            onValueChange = { voluntarioNombre = it },
                            label = { Text("Nombre del Voluntario") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = voluntarioRol,
                            onValueChange = { voluntarioRol = it },
                            label = { Text("Rol / Área de Apoyo") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }

                    "distribucion" -> {
                        OutlinedTextField(
                            value = distribucionDesc,
                            onValueChange = { distribucionDesc = it },
                            label = { Text("Detalle de la Distribución") },
                            minLines = 3,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    when (actionType) {
                        "donacion" -> {
                            val monto = montoStr.toDoubleOrNull() ?: 100000.0
                            onRegistrarDonacion(donante, monto, tipoDonacion, "Aporte registrado en Give&Go")
                        }
                        "voluntario" -> {
                            onRegistrarVoluntario(voluntarioNombre, voluntarioRol)
                        }
                        "distribucion" -> {
                            onRegistrarDistribucion(distribucionDesc)
                        }
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = GiveRedPrimary)
            ) {
                Text("Guardar Acción")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancelar", color = GiveTextSecondary)
            }
        },
        containerColor = Color.White,
        shape = RoundedCornerShape(18.dp)
    )
}

fun formatTimeAgo(time: Long): String {
    val diff = System.currentTimeMillis() - time
    val mins = diff / (1000 * 60)
    val hours = mins / 60
    val days = hours / 24
    return when {
        mins < 1 -> "Ahora mismo"
        mins < 60 -> "Hace $mins min"
        hours < 24 -> "Hace $hours h"
        days < 30 -> "Hace $days d"
        else -> "Hace varias semanas"
    }
}
