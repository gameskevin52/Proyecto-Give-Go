package com.example.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.VolunteerActivism
import androidx.compose.material.icons.outlined.Event
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.VolunteerActivism
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.ui.components.GiveAndGoTopAppBar
import com.example.ui.theme.GiveBackground
import com.example.ui.theme.GiveRedPrimary
import com.example.ui.theme.GiveTextMuted
import com.example.ui.theme.GiveTextPrimary
import com.example.ui.viewmodel.GlobalNavigation
import com.example.ui.viewmodel.OrganizacionViewModel
import kotlinx.coroutines.flow.collectLatest

@Composable
fun MainAppScreen(
    viewModel: OrganizacionViewModel,
    modifier: Modifier = Modifier
) {
    val currentDestination by viewModel.currentDestination.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(Unit) {
        viewModel.toastEvent.collectLatest { message ->
            snackbarHostState.showSnackbar(message)
        }
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            GiveAndGoTopAppBar(
                currentDestination = currentDestination,
                onNavigate = { destination ->
                    viewModel.setGlobalDestination(destination)
                }
            )
        },
        bottomBar = {
            // Sleek Interface Bottom Navigation Bar
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("bottom_nav_bar"),
                color = Color.White,
                shadowElevation = 8.dp
            ) {
                Column(modifier = Modifier.fillMaxWidth()) {
                    androidx.compose.material3.HorizontalDivider(
                        color = com.example.ui.theme.Slate100,
                        thickness = 1.dp
                    )
                    NavigationBar(
                        modifier = Modifier.fillMaxWidth(),
                        containerColor = Color.White,
                        tonalElevation = 0.dp
                    ) {
                        // Tab 1: Inicio / Dashboard - No redirige a ningún lado
                        NavigationBarItem(
                            selected = currentDestination == GlobalNavigation.INICIO,
                            onClick = { /* No-op: no redirige */ },
                            icon = {
                                Icon(
                                    imageVector = if (currentDestination == GlobalNavigation.INICIO) Icons.Filled.Home else Icons.Outlined.Home,
                                    contentDescription = if (currentDestination == GlobalNavigation.INICIO) "Dashboard" else "Inicio"
                                )
                            },
                            label = {
                                Text(
                                    text = if (currentDestination == GlobalNavigation.INICIO) "DASHBOARD" else "INICIO",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.5.sp
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = GiveRedPrimary,
                                selectedTextColor = GiveRedPrimary,
                                indicatorColor = com.example.ui.theme.GiveRedSurface,
                                unselectedIconColor = com.example.ui.theme.Slate400,
                                unselectedTextColor = com.example.ui.theme.Slate400
                            ),
                            modifier = Modifier.testTag("bottom_tab_inicio")
                        )

                        // Tab 2: Eventos - No redirige a ningún lado
                        NavigationBarItem(
                            selected = currentDestination == GlobalNavigation.EVENTOS,
                            onClick = { /* No-op: no redirige */ },
                            icon = {
                                Icon(
                                    imageVector = if (currentDestination == GlobalNavigation.EVENTOS) Icons.Filled.Event else Icons.Outlined.Event,
                                    contentDescription = "Eventos"
                                )
                            },
                            label = {
                                Text(
                                    text = "EVENTOS",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.5.sp
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = GiveRedPrimary,
                                selectedTextColor = GiveRedPrimary,
                                indicatorColor = com.example.ui.theme.GiveRedSurface,
                                unselectedIconColor = com.example.ui.theme.Slate400,
                                unselectedTextColor = com.example.ui.theme.Slate400
                            ),
                            modifier = Modifier.testTag("bottom_tab_eventos")
                        )

                        // Tab 3: Mapa - No redirige a ningún lado
                        NavigationBarItem(
                            selected = currentDestination == GlobalNavigation.MAPA,
                            onClick = { /* No-op: no redirige */ },
                            icon = {
                                Icon(
                                    imageVector = if (currentDestination == GlobalNavigation.MAPA) Icons.Filled.LocationOn else Icons.Outlined.LocationOn,
                                    contentDescription = "Mapa"
                                )
                            },
                            label = {
                                Text(
                                    text = "MAPA",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.5.sp
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = GiveRedPrimary,
                                selectedTextColor = GiveRedPrimary,
                                indicatorColor = com.example.ui.theme.GiveRedSurface,
                                unselectedIconColor = com.example.ui.theme.Slate400,
                                unselectedTextColor = com.example.ui.theme.Slate400
                            ),
                            modifier = Modifier.testTag("bottom_tab_mapa")
                        )

                        // Tab 4: Donaciones - No redirige a ningún lado
                        NavigationBarItem(
                            selected = currentDestination == GlobalNavigation.DONACIONES,
                            onClick = { /* No-op: no redirige */ },
                            icon = {
                                Icon(
                                    imageVector = if (currentDestination == GlobalNavigation.DONACIONES) Icons.Filled.VolunteerActivism else Icons.Outlined.VolunteerActivism,
                                    contentDescription = "Donaciones"
                                )
                            },
                            label = {
                                Text(
                                    text = "DONAR",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.5.sp
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = GiveRedPrimary,
                                selectedTextColor = GiveRedPrimary,
                                indicatorColor = com.example.ui.theme.GiveRedSurface,
                                unselectedIconColor = com.example.ui.theme.Slate400,
                                unselectedTextColor = com.example.ui.theme.Slate400
                            ),
                            modifier = Modifier.testTag("bottom_tab_donaciones")
                        )
                    }
                }
            }
        },
        containerColor = GiveBackground
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            AnimatedContent(
                targetState = currentDestination,
                transitionSpec = { fadeIn() togetherWith fadeOut() },
                label = "GlobalNavigationContent"
            ) { destination ->
                when (destination) {
                    GlobalNavigation.INICIO -> {
                        DashboardOrganizacionScreen(viewModel = viewModel)
                    }
                    GlobalNavigation.EVENTOS -> {
                        EventosScreen(viewModel = viewModel)
                    }
                    GlobalNavigation.MAPA -> {
                        MapaScreen(viewModel = viewModel)
                    }
                    GlobalNavigation.DONACIONES -> {
                        DonacionesScreen(viewModel = viewModel)
                    }
                    GlobalNavigation.REGISTRO -> {
                        RegistroOrganizacionScreen(
                            viewModel = viewModel,
                            onRegistroExitoso = {
                                viewModel.setGlobalDestination(GlobalNavigation.INICIO)
                            }
                        )
                    }
                }
            }
        }
    }
}
