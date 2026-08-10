package com.example.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.People
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.ui.theme.GiveAccentGreen
import com.example.ui.theme.GiveBackground
import com.example.ui.theme.GiveRedPrimary
import com.example.ui.theme.GiveTextMuted
import com.example.ui.theme.GiveTextPrimary
import com.example.ui.theme.GiveTextSecondary
import com.example.ui.viewmodel.OrganizacionViewModel

@Composable
fun EventosScreen(
    viewModel: OrganizacionViewModel,
    modifier: Modifier = Modifier
) {
    val eventos by viewModel.eventosDeOrganizacion.collectAsStateWithLifecycle()
    val currentOrg by viewModel.currentOrganizacion.collectAsStateWithLifecycle()
    var showCreateEventModal by remember { mutableStateOf(false) }

    if (showCreateEventModal) {
        CreateEventModal(
            onDismiss = { showCreateEventModal = false },
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
                    showCreateEventModal = false
                }
            }
        )
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(GiveBackground)
            .padding(16.dp)
    ) {
        // Cabecera Seguimiento de Eventos
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(42.dp)
                                .background(GiveRedPrimary.copy(alpha = 0.12f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Event,
                                contentDescription = null,
                                tint = GiveRedPrimary,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "Seguimiento de Eventos",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = GiveTextPrimary
                            )
                            Text(
                                text = currentOrg?.nombre ?: "Give&Go",
                                fontSize = 12.sp,
                                color = GiveTextSecondary
                            )
                        }
                    }

                    Button(
                        onClick = { showCreateEventModal = true },
                        colors = ButtonDefaults.buttonColors(containerColor = GiveRedPrimary),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp),
                        modifier = Modifier.testTag("btn_nuevo_evento")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Nuevo", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "EVENTOS COMUNITARIOS (${eventos.size})",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = GiveTextMuted,
            letterSpacing = 0.5.sp
        )

        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(eventos) { ev ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = ev.nombre,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = GiveTextPrimary,
                                modifier = Modifier.weight(1f)
                            )
                            Surface(
                                color = if (ev.estado == "Completado") Color(0xFFE8F5E9) else Color(0xFFFFF3E0),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = ev.estado,
                                    color = if (ev.estado == "Completado") Color(0xFF2E7D32) else Color(0xFFF57C00),
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.CalendarMonth,
                                contentDescription = null,
                                tint = GiveTextSecondary,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "${ev.fecha} • ${ev.hora} | Tipo: ${ev.tipo}",
                                fontSize = 12.sp,
                                color = GiveTextSecondary
                            )
                        }

                        Spacer(modifier = Modifier.height(4.dp))

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = GiveRedPrimary,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = ev.sitio,
                                fontSize = 12.sp,
                                color = GiveTextPrimary
                            )
                        }

                        if (ev.descripcion.isNotBlank()) {
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = ev.descripcion,
                                fontSize = 12.sp,
                                color = GiveTextSecondary,
                                lineHeight = 16.sp
                            )
                        }
                    }
                }
            }
        }
    }
}
