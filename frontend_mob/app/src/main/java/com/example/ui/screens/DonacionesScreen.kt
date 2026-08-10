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
import androidx.compose.material.icons.filled.CardGiftcard
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.MonetizationOn
import androidx.compose.material.icons.filled.VolunteerActivism
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
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun DonacionesScreen(
    viewModel: OrganizacionViewModel,
    modifier: Modifier = Modifier
) {
    val donaciones by viewModel.donacionesDeOrganizacion.collectAsStateWithLifecycle()
    val totalMonto by viewModel.totalMontoDonaciones.collectAsStateWithLifecycle()
    val currentOrg by viewModel.currentOrganizacion.collectAsStateWithLifecycle()

    var showAddDonationModal by remember { mutableStateOf(false) }

    if (showAddDonationModal) {
        QuickActionModal(
            onDismiss = { showAddDonationModal = false },
            onRegistrarDonacion = { donante, monto, tipo, msg ->
                viewModel.registrarNuevaDonacion(donante, monto, tipo, msg) {
                    showAddDonationModal = false
                }
            },
            onRegistrarVoluntario = { _, _ -> showAddDonationModal = false },
            onRegistrarDistribucion = { showAddDonationModal = false }
        )
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(GiveBackground)
            .padding(16.dp)
    ) {
        // Cabecera Resumen de Donaciones
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
                                imageVector = Icons.Default.VolunteerActivism,
                                contentDescription = null,
                                tint = GiveRedPrimary,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "Módulo de Donaciones",
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
                        onClick = { showAddDonationModal = true },
                        colors = ButtonDefaults.buttonColors(containerColor = GiveRedPrimary),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp),
                        modifier = Modifier.testTag("btn_nueva_donacion")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Registrar", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Métricas
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Surface(
                        color = Color(0xFFF1F5F9),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Total Recaudado", fontSize = 11.sp, color = GiveTextSecondary)
                            Text(
                                text = "$${String.format(Locale.getDefault(), "%,.0f", totalMonto ?: 0.0)}",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black,
                                color = GiveRedPrimary
                            )
                        }
                    }

                    Surface(
                        color = Color(0xFFF1F5F9),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Donaciones", fontSize = 11.sp, color = GiveTextSecondary)
                            Text(
                                text = "${donaciones.size} aportes",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black,
                                color = GiveTextPrimary
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "HISTORIAL DE APORTES RECIBIDOS (${donaciones.size})",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = GiveTextMuted,
            letterSpacing = 0.5.sp
        )

        Spacer(modifier = Modifier.height(8.dp))

        if (donaciones.isEmpty()) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .background(Color(0xFFF1F5F9), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.MonetizationOn,
                            contentDescription = null,
                            tint = GiveTextMuted,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "Sin donaciones registradas",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = GiveTextPrimary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Aún no hay aportes registrados en el historial. Puedes ingresar un nuevo aporte con el botón 'Registrar'.",
                        fontSize = 12.sp,
                        color = GiveTextSecondary,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                        lineHeight = 16.sp
                    )
                }
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(donaciones) { donacion ->
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
                                    text = donacion.donante,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = GiveTextPrimary
                                )
                                Text(
                                    text = "$${String.format(Locale.getDefault(), "%,.0f", donacion.monto)} COP",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Black,
                                    color = GiveAccentGreen
                                )
                            }

                            Spacer(modifier = Modifier.height(4.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = "Tipo: ${donacion.tipo}",
                                    fontSize = 12.sp,
                                    color = GiveTextSecondary
                                )
                                Text(
                                    text = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).format(Date(donacion.fecha)),
                                    fontSize = 11.sp,
                                    color = GiveTextMuted
                                )
                            }

                            if (donacion.mensaje.isNotBlank()) {
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = "“${donacion.mensaje}”",
                                    fontSize = 12.sp,
                                    color = GiveTextPrimary,
                                    lineHeight = 16.sp
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
