package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.Directions
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material.icons.filled.NearMe
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.ui.theme.GiveBackground
import com.example.ui.theme.GiveRedPrimary
import com.example.ui.theme.GiveTextMuted
import com.example.ui.theme.GiveTextPrimary
import com.example.ui.theme.GiveTextSecondary
import com.example.ui.viewmodel.OrganizacionViewModel

data class PuntoMapa(
    val id: Int,
    val nombre: String,
    val tipo: String, // Centro de Acopio, Organización, Punto de Distribución
    val direccion: String,
    val barrio: String,
    val localidad: String = "Kennedy",
    val horario: String,
    val telefono: String,
    val distancia: String
)

@Composable
fun MapaScreen(
    viewModel: OrganizacionViewModel,
    modifier: Modifier = Modifier
) {
    val currentOrg by viewModel.currentOrganizacion.collectAsStateWithLifecycle()
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf("Todos") }

    val puntos = listOf(
        PuntoMapa(
            id = 1,
            nombre = currentOrg?.nombre ?: "Fundación Manos Unidas Kennedy",
            tipo = "Sede Principal Organización",
            direccion = currentOrg?.direccion ?: "Calle 38C Sur # 78-45",
            barrio = currentOrg?.barrio ?: "Castilla",
            horario = "Lun - Sáb: 8:00 AM - 5:00 PM",
            telefono = currentOrg?.telefono ?: "+57 312 456 7890",
            distancia = "A 0.4 km"
        ),
        PuntoMapa(
            id = 2,
            nombre = "Centro de Acopio y Donaciones Timiza",
            tipo = "Centro de Acopio",
            direccion = "Carrera 72N # 40-20 Sur",
            barrio = "Timiza",
            horario = "Lun - Dom: 7:00 AM - 6:00 PM",
            telefono = "+57 310 987 6543",
            distancia = "A 1.2 km"
        ),
        PuntoMapa(
            id = 3,
            nombre = "Comedor Comunitario Patio Bonito",
            tipo = "Punto de Distribución",
            direccion = "Calle 38 Sur # 86-12",
            barrio = "Patio Bonito",
            horario = "Lun - Vie: 11:30 AM - 2:30 PM",
            telefono = "+57 315 222 3344",
            distancia = "A 2.5 km"
        ),
        PuntoMapa(
            id = 4,
            nombre = "Punto Solidario Give&Go Tintal",
            tipo = "Centro de Acopio",
            direccion = "Avenida Carrera 86 # 6-37",
            barrio = "El Tintal",
            horario = "Martes y Jueves: 9:00 AM - 4:00 PM",
            telefono = "+57 301 555 7788",
            distancia = "A 3.1 km"
        )
    )

    val puntosFiltrados = puntos.filter {
        (selectedFilter == "Todos" || it.tipo.contains(selectedFilter, ignoreCase = true)) &&
                (it.nombre.contains(searchQuery, ignoreCase = true) || it.barrio.contains(searchQuery, ignoreCase = true))
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(GiveBackground)
            .padding(16.dp)
    ) {
        // Cabecera Mapa
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .background(GiveRedPrimary.copy(alpha = 0.12f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Map,
                            contentDescription = null,
                            tint = GiveRedPrimary,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Mapa de Organizaciones y Acopio",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = GiveTextPrimary
                        )
                        Text(
                            text = "Localidad de Kennedy - Bogotá D.C.",
                            fontSize = 12.sp,
                            color = GiveTextSecondary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Representación Gráfica del Mapa de Bogotá con Puntos de Impacto
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(160.dp)
                        .background(Color(0xFFE2E8F0), RoundedCornerShape(14.dp))
                        .clip(RoundedCornerShape(14.dp))
                        .border(1.dp, Color(0xFFCBD5E1), RoundedCornerShape(14.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.MyLocation,
                            contentDescription = null,
                            tint = GiveRedPrimary,
                            modifier = Modifier.size(36.dp)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Kennedy, Bogotá (4.6284° N, 74.1528° W)",
                            fontWeight = FontWeight.Bold,
                            color = GiveTextPrimary,
                            fontSize = 13.sp
                        )
                        Text(
                            text = "4 Puntos de Asistencia Activos",
                            color = GiveTextSecondary,
                            fontSize = 11.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Barra de búsqueda
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Buscar punto o barrio en Kennedy...") },
                    leadingIcon = {
                        Icon(Icons.Default.Search, contentDescription = null, tint = GiveRedPrimary)
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Lista de Puntos
        Text(
            text = "PUNTOS CERCANOS (${puntosFiltrados.size})",
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
            items(puntosFiltrados) { punto ->
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
                                text = punto.nombre,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = GiveTextPrimary,
                                modifier = Modifier.weight(1f)
                            )
                            Surface(
                                color = GiveRedPrimary.copy(alpha = 0.1f),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = punto.distancia,
                                    color = GiveRedPrimary,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(4.dp))

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = GiveTextSecondary,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "${punto.direccion}, Barrio ${punto.barrio}",
                                fontSize = 12.sp,
                                color = GiveTextSecondary
                            )
                        }

                        Spacer(modifier = Modifier.height(4.dp))

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Phone,
                                contentDescription = null,
                                tint = GiveTextSecondary,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "${punto.telefono} • ${punto.horario}",
                                fontSize = 11.sp,
                                color = GiveTextMuted
                            )
                        }
                    }
                }
            }
        }
    }
}
