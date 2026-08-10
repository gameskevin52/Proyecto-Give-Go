package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddBusiness
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.Business
import androidx.compose.material.icons.filled.Category
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.LocationCity
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.MarkEmailRead
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.MenuDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.model.Organizacion
import com.example.ui.theme.GiveBackground
import com.example.ui.theme.GiveRedPrimary
import com.example.ui.theme.GiveTextMuted
import com.example.ui.theme.GiveTextPrimary
import com.example.ui.theme.GiveTextSecondary
import com.example.ui.viewmodel.GlobalNavigation
import com.example.ui.viewmodel.OrganizacionViewModel

/**
 * Vista de Registro de Organización (CreateOrganitation.js)
 * Permite a una nueva organización registrarse en la plataforma Give&Go.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegistroOrganizacionScreen(
    viewModel: OrganizacionViewModel,
    onRegistroExitoso: (Organizacion) -> Unit,
    modifier: Modifier = Modifier
) {
    val formState by viewModel.formState.collectAsStateWithLifecycle()
    var passwordVisible by remember { mutableStateOf(false) }
    var confirmPasswordVisible by remember { mutableStateOf(false) }
    var showSuccessModal by remember { mutableStateOf(false) }
    var lastCreatedOrg by remember { mutableStateOf<Organizacion?>(null) }

    // Opciones de localidad en Bogotá
    val localidades = listOf(
        "Kennedy", "Bosa", "Suba", "Engativá", "Ciudad Bolívar",
        "Chapinero", "Usaquén", "Fontibón", "Teusaquillo", "San Cristóbal"
    )
    var localidadExpanded by remember { mutableStateOf(false) }

    // Opciones de categorías
    val categorias = listOf(
        "Alimentos y Nutrición", "Educación y Juventud", "Salud y Bienestar",
        "Medio Ambiente y Reciclaje", "Asistencia Social y Vivienda", "Adulto Mayor"
    )
    var categoriaExpanded by remember { mutableStateOf(false) }

    val scrollState = rememberScrollState()

    val textFieldColors = OutlinedTextFieldDefaults.colors(
        focusedTextColor = Color.Black,
        unfocusedTextColor = Color.Black,
        focusedBorderColor = GiveRedPrimary,
        focusedLabelColor = GiveRedPrimary,
        cursorColor = Color.Black,
        focusedPlaceholderColor = Color.Gray,
        unfocusedPlaceholderColor = Color.Gray
    )

    // Modal de confirmación de envío de correo y estado pendiente
    if (showSuccessModal && lastCreatedOrg != null) {
        AlertDialog(
            onDismissRequest = {
                showSuccessModal = false
                onRegistroExitoso(lastCreatedOrg!!)
            },
            icon = {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .background(Color(0xFFE8F5E9), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.MarkEmailRead,
                        contentDescription = null,
                        tint = Color(0xFF2E7D32),
                        modifier = Modifier.size(32.dp)
                    )
                }
            },
            title = {
                Text(
                    text = "¡Registro Completado con Éxito!",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    textAlign = TextAlign.Center
                )
            },
            text = {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "Se ha enviado una notificación de confirmación al correo institucional:",
                        fontSize = 14.sp,
                        color = GiveTextSecondary,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = lastCreatedOrg?.correo ?: "",
                        fontWeight = FontWeight.Bold,
                        color = GiveRedPrimary,
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(14.dp))

                    Surface(
                        color = Color(0xFFFFF8E1),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Info,
                                contentDescription = null,
                                tint = Color(0xFFF57F17),
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Estado: Pendiente de verificación por el administrador general. Ya puedes acceder al Dashboard para gestionar tu perfil.",
                                fontSize = 12.sp,
                                color = Color(0xFF5D4037),
                                lineHeight = 16.sp
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showSuccessModal = false
                        onRegistroExitoso(lastCreatedOrg!!)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = GiveRedPrimary),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Ir al Dashboard de la Organización", fontWeight = FontWeight.Bold)
                }
            },
            shape = RoundedCornerShape(20.dp),
            containerColor = Color.White
        )
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(GiveBackground)
            .imePadding()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = 16.dp, vertical = 20.dp)
        ) {
            // Cabecera de la pantalla
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier
                            .size(60.dp)
                            .background(GiveRedPrimary.copy(alpha = 0.1f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.AddBusiness,
                            contentDescription = "Registro",
                            tint = GiveRedPrimary,
                            modifier = Modifier.size(32.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Registro de Organización",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = GiveTextPrimary,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Únete a Give&Go para gestionar donaciones, proyectos comunitarios y voluntarios en Bogotá.",
                        fontSize = 13.sp,
                        color = GiveTextSecondary,
                        textAlign = TextAlign.Center,
                        lineHeight = 18.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Botón para auto-completar datos de prueba rápidamente
                    OutlinedButton(
                        onClick = { viewModel.fillSampleDataForTesting() },
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = GiveRedPrimary),
                        modifier = Modifier.testTag("fill_sample_data_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Llenar con datos de prueba (Kennedy)",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Error general si existe
            AnimatedVisibility(visible = formState.errors.containsKey("general")) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFFEBEE)),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Error,
                            contentDescription = null,
                            tint = GiveRedPrimary
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = formState.errors["general"] ?: "",
                            color = GiveRedPrimary,
                            fontSize = 13.sp
                        )
                    }
                }
            }

            // Sección 1: Datos Obligatorios de la Organización
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = "1. Información Principal (* Obligatorios)",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = GiveTextPrimary
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Nombre de la Organización
                    OutlinedTextField(
                        value = formState.nombre,
                        onValueChange = { viewModel.onFormNombreChange(it) },
                        label = { Text("Nombre de la Organización *") },
                        placeholder = { Text("Ej. Fundación Manos Unidas Kennedy") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        leadingIcon = {
                            Icon(Icons.Default.Business, contentDescription = null, tint = GiveRedPrimary)
                        },
                        isError = formState.errors.containsKey("nombre"),
                        supportingText = {
                            formState.errors["nombre"]?.let {
                                Text(text = it, color = GiveRedPrimary)
                            }
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_org_nombre"),
                        colors = textFieldColors
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // NIT
                    OutlinedTextField(
                        value = formState.nit,
                        onValueChange = { viewModel.onFormNitChange(it) },
                        label = { Text("NIT / Identificación Tributaria *") },
                        placeholder = { Text("Ej. 901.458.789-2") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        leadingIcon = {
                            Icon(Icons.Default.Badge, contentDescription = null, tint = GiveRedPrimary)
                        },
                        isError = formState.errors.containsKey("nit"),
                        supportingText = {
                            formState.errors["nit"]?.let {
                                Text(text = it, color = GiveRedPrimary)
                            } ?: Text(text = "Debe ser único en el sistema Give&Go", fontSize = 11.sp, color = GiveTextMuted)
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_org_nit"),
                        colors = textFieldColors
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Dirección
                    OutlinedTextField(
                        value = formState.direccion,
                        onValueChange = { viewModel.onFormDireccionChange(it) },
                        label = { Text("Dirección Institucional *") },
                        placeholder = { Text("Ej. Calle 38C Sur # 78-45") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        leadingIcon = {
                            Icon(Icons.Default.LocationOn, contentDescription = null, tint = GiveRedPrimary)
                        },
                        isError = formState.errors.containsKey("direccion"),
                        supportingText = {
                            formState.errors["direccion"]?.let {
                                Text(text = it, color = GiveRedPrimary)
                            }
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_org_direccion"),
                        colors = textFieldColors
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Correo Electrónico Institucional
                    OutlinedTextField(
                        value = formState.correo,
                        onValueChange = { viewModel.onFormCorreoChange(it) },
                        label = { Text("Correo Electrónico Institucional *") },
                        placeholder = { Text("contacto@organizacion.org") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        leadingIcon = {
                            Icon(Icons.Default.Email, contentDescription = null, tint = GiveRedPrimary)
                        },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                        isError = formState.errors.containsKey("correo"),
                        supportingText = {
                            formState.errors["correo"]?.let {
                                Text(text = it, color = GiveRedPrimary)
                            } ?: Text(text = "Se enviará un correo de confirmación a esta dirección", fontSize = 11.sp, color = GiveTextMuted)
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_org_correo"),
                        colors = textFieldColors
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Contraseña
                    OutlinedTextField(
                        value = formState.password,
                        onValueChange = { viewModel.onFormPasswordChange(it) },
                        label = { Text("Contraseña de Acceso *") },
                        placeholder = { Text("Mínimo 6 caracteres") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        leadingIcon = {
                            Icon(Icons.Default.Lock, contentDescription = null, tint = GiveRedPrimary)
                        },
                        trailingIcon = {
                            IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                Icon(
                                    imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                                    contentDescription = if (passwordVisible) "Ocultar" else "Mostrar"
                                )
                            }
                        },
                        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        isError = formState.errors.containsKey("password"),
                        supportingText = {
                            formState.errors["password"]?.let {
                                Text(text = it, color = GiveRedPrimary)
                            } ?: Text(text = "Cifrado seguro garantizado", fontSize = 11.sp, color = GiveTextMuted)
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_org_password"),
                        colors = textFieldColors
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Confirmar Contraseña
                    OutlinedTextField(
                        value = formState.confirmPassword,
                        onValueChange = { viewModel.onFormConfirmPasswordChange(it) },
                        label = { Text("Confirmar Contraseña *") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        leadingIcon = {
                            Icon(Icons.Default.Lock, contentDescription = null, tint = GiveRedPrimary)
                        },
                        trailingIcon = {
                            IconButton(onClick = { confirmPasswordVisible = !confirmPasswordVisible }) {
                                Icon(
                                    imageVector = if (confirmPasswordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                                    contentDescription = if (confirmPasswordVisible) "Ocultar" else "Mostrar"
                                )
                            }
                        },
                        visualTransformation = if (confirmPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        isError = formState.errors.containsKey("confirmPassword"),
                        supportingText = {
                            formState.errors["confirmPassword"]?.let {
                                Text(text = it, color = GiveRedPrimary)
                            }
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_org_confirm_password"),
                        colors = textFieldColors
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Sección 2: Ubicación y Contacto
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = "2. Ubicación y Contacto (Bogotá)",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = GiveTextPrimary
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Selector de Localidad
                    ExposedDropdownMenuBox(
                        expanded = localidadExpanded,
                        onExpandedChange = { localidadExpanded = !localidadExpanded }
                    ) {
                        OutlinedTextField(
                            value = formState.localidad,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Localidad en Bogotá") },
                            textStyle = LocalTextStyle.current.copy(color = Color.Black),
                            leadingIcon = {
                                Icon(Icons.Default.LocationCity, contentDescription = null, tint = GiveRedPrimary)
                            },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = localidadExpanded) },
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor(),
                            colors = textFieldColors
                        )

                        ExposedDropdownMenu(
                            expanded = localidadExpanded,
                            onDismissRequest = { localidadExpanded = false },
                            modifier = Modifier.background(Color.White)
                        ) {
                            localidades.forEach { item ->
                                DropdownMenuItem(
                                    text = {
                                        Text(
                                            text = item,
                                            color = Color.Black,
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.Medium
                                        )
                                    },
                                    onClick = {
                                        viewModel.onFormLocalidadChange(item)
                                        localidadExpanded = false
                                    },
                                    colors = MenuDefaults.itemColors(
                                        textColor = Color.Black
                                    ),
                                    modifier = Modifier.background(Color.White)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Barrio
                    OutlinedTextField(
                        value = formState.barrio,
                        onValueChange = { viewModel.onFormBarrioChange(it) },
                        label = { Text("Barrio") },
                        placeholder = { Text("Ej. Castilla, Timiza, Patio Bonito") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        leadingIcon = {
                            Icon(Icons.Default.LocationOn, contentDescription = null, tint = Color(0xFF64748B))
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth(),
                        colors = textFieldColors
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Teléfono
                    OutlinedTextField(
                        value = formState.telefono,
                        onValueChange = { viewModel.onFormTelefonoChange(it) },
                        label = { Text("Teléfono de Contacto") },
                        placeholder = { Text("+57 312 456 7890") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        leadingIcon = {
                            Icon(Icons.Default.Phone, contentDescription = null, tint = Color(0xFF64748B))
                        },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth(),
                        colors = textFieldColors
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Representante Legal
                    OutlinedTextField(
                        value = formState.representanteLegal,
                        onValueChange = { viewModel.onFormRepresentanteChange(it) },
                        label = { Text("Representante Legal / Contacto") },
                        placeholder = { Text("Nombre del representante") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        leadingIcon = {
                            Icon(Icons.Default.Person, contentDescription = null, tint = Color(0xFF64748B))
                        },
                        supportingText = {
                            Text(
                                text = "Al registrar, se creará automáticamente el usuario administrador para la organización.",
                                fontSize = 11.sp,
                                color = GiveTextMuted
                            )
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth(),
                        colors = textFieldColors
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Sección 3: Categoría y Misión Institucional
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = "3. Categoría y Propósito Institucional",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = GiveTextPrimary
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Selector de Categoría
                    ExposedDropdownMenuBox(
                        expanded = categoriaExpanded,
                        onExpandedChange = { categoriaExpanded = !categoriaExpanded }
                    ) {
                        OutlinedTextField(
                            value = formState.categoria,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Categoría de Acción") },
                            textStyle = LocalTextStyle.current.copy(color = Color.Black),
                            leadingIcon = {
                                Icon(Icons.Default.Category, contentDescription = null, tint = GiveRedPrimary)
                            },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = categoriaExpanded) },
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor(),
                            colors = textFieldColors
                        )

                        ExposedDropdownMenu(
                            expanded = categoriaExpanded,
                            onDismissRequest = { categoriaExpanded = false },
                            modifier = Modifier.background(Color.White)
                        ) {
                            categorias.forEach { item ->
                                DropdownMenuItem(
                                    text = {
                                        Text(
                                            text = item,
                                            color = Color.Black,
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.Medium
                                        )
                                    },
                                    onClick = {
                                        viewModel.onFormCategoriaChange(item)
                                        categoriaExpanded = false
                                    },
                                    colors = MenuDefaults.itemColors(
                                        textColor = Color.Black
                                    ),
                                    modifier = Modifier.background(Color.White)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Misión
                    OutlinedTextField(
                        value = formState.mision,
                        onValueChange = { viewModel.onFormMisionChange(it) },
                        label = { Text("Misión de la Organización") },
                        placeholder = { Text("¿Cuál es el objetivo principal de ayuda?") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        minLines = 2,
                        maxLines = 4,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth(),
                        colors = textFieldColors
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Visión
                    OutlinedTextField(
                        value = formState.vision,
                        onValueChange = { viewModel.onFormVisionChange(it) },
                        label = { Text("Visión Institucional") },
                        placeholder = { Text("¿Cómo proyectan su impacto en la comunidad?") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        minLines = 2,
                        maxLines = 4,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth(),
                        colors = textFieldColors
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Sitio Web & Redes Sociales
                    OutlinedTextField(
                        value = formState.sitioWeb,
                        onValueChange = { viewModel.onFormSitioWebChange(it) },
                        label = { Text("Sitio Web (Opcional)") },
                        placeholder = { Text("https://miorganizacion.org") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        leadingIcon = {
                            Icon(Icons.Default.Language, contentDescription = null, tint = Color(0xFF64748B))
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth(),
                        colors = textFieldColors
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = formState.redesSociales,
                        onValueChange = { viewModel.onFormRedesSocialesChange(it) },
                        label = { Text("Redes Sociales") },
                        placeholder = { Text("@organizacion en Instagram / Facebook") },
                        textStyle = LocalTextStyle.current.copy(color = Color.Black),
                        leadingIcon = {
                            Icon(Icons.Default.Share, contentDescription = null, tint = Color(0xFF64748B))
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth(),
                        colors = textFieldColors
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Botón Principal de Confirmar Registro (< 3 seg, con indicador de carga)
            Button(
                onClick = {
                    viewModel.registrarOrganizacion { org ->
                        onRegistroExitoso(org)
                    }
                },
                enabled = !formState.isSubmitting,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
                    .testTag("submit_registro_button"),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = GiveRedPrimary,
                    disabledContainerColor = GiveRedPrimary.copy(alpha = 0.5f)
                ),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp)
            ) {
                if (formState.isSubmitting) {
                    CircularProgressIndicator(
                        color = Color.White,
                        modifier = Modifier.size(24.dp),
                        strokeWidth = 2.5.dp
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "Confirmando registro...",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                } else {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = Color.White
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Confirmar Registro",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Nota informativa sobre el proceso de verificación
            Surface(
                color = Color(0xFFF1F5F9),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Icon(
                        imageVector = Icons.Default.Info,
                        contentDescription = null,
                        tint = Color(0xFF475569),
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "La organización quedará en estado 'Pendiente de verificación' hasta que el administrador general valide la documentación. Se enviará una confirmación al correo institucional registrado.",
                        fontSize = 12.sp,
                        color = Color(0xFF475569),
                        lineHeight = 16.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(48.dp))
        }
    }
}
