package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = GiveRedLight,
    onPrimary = Color.White,
    primaryContainer = GiveRedDark,
    onPrimaryContainer = Color.White,
    secondary = Slate400,
    onSecondary = Color.Black,
    tertiary = GiveAccentEmerald,
    background = Slate900,
    surface = Slate800,
    onBackground = Color.White,
    onSurface = Color.White,
    outline = Slate700,
    surfaceVariant = Slate800
)

private val LightColorScheme = lightColorScheme(
    primary = GiveRedPrimary,
    onPrimary = Color.White,
    primaryContainer = GiveRedSurface,
    onPrimaryContainer = GiveRedDark,
    secondary = Slate700,
    onSecondary = Color.White,
    tertiary = GiveAccentEmerald,
    onTertiary = Color.White,
    background = Color(0xFFFFFFFF),
    onBackground = Slate900,
    surface = Color(0xFFFFFFFF),
    onSurface = Slate900,
    surfaceVariant = Slate50,
    onSurfaceVariant = Slate600,
    outline = Slate200,
    outlineVariant = Slate100
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false, // Keep consistent Give&Go branding
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}

@Composable
fun GiveAndGoTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MyApplicationTheme(darkTheme = darkTheme, content = content)
}


