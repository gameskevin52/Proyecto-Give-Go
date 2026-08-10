package com.example.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.Slate100
import com.example.ui.theme.Slate800
import com.example.ui.viewmodel.GlobalNavigation

/**
 * Header: Static Sticky Header with ❤️ Give&Go branding.
 * Clean, modern header without dropdown menus as requested.
 */
@Composable
fun GiveAndGoTopAppBar(
    currentDestination: GlobalNavigation,
    modifier: Modifier = Modifier,
    onNavigate: (GlobalNavigation) -> Unit = {}
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        color = Color.White
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(64.dp)
                    .padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Start
            ) {
                // Left Brand: Heart + Give&Go title
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .padding(horizontal = 4.dp, vertical = 6.dp)
                        .testTag("giveandgo_logo_button")
                ) {
                    Text(
                        text = "❤️",
                        fontSize = 24.sp
                    )

                    Spacer(modifier = Modifier.width(8.dp))

                    Text(
                        text = "Give&Go",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = (-0.5).sp,
                        color = Slate800
                    )
                }
            }

            // Bottom subtle border
            HorizontalDivider(color = Slate100, thickness = 1.dp)
        }
    }
}


