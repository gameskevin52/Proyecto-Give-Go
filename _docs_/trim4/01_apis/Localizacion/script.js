
        // Variable global para el mapa
        let mapa;

        // Inicializar el mapa con OpenStreetMap
        function iniciarMapa() {
            // Coordenadas por defecto (Madrid, España)
            const ubicacionDefault = [40.416775, -3.703790];
            
            // Crear el mapa y establecer la vista
            mapa = L.map('map').setView(ubicacionDefault, 13);
            
            // Añadir las capas de OpenStreetMap (sin API key)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(mapa);
        }

        // Función para geocodificar dirección usando Nominatim (gratis)
        async function geocodificarDireccion(direccion) {
            // Nominatim requiere User-Agent (pon tu web o email por cortesía)
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`;
            
            const respuesta = await fetch(url, {
                headers: {
                    'User-Agent': 'MiAppWeb/1.0' // Reemplaza con tu información
                }
            });
            
            const datos = await respuesta.json();
            
            if (datos && datos.length > 0) {
                return {
                    lat: parseFloat(datos[0].lat),
                    lon: parseFloat(datos[0].lon),
                    nombre: datos[0].display_name
                };
            }
            return null;
        }

        // Función principal: buscar dirección y mostrarla
        async function mostrarMapa() {
            const direccion = document.getElementById("direccion").value;
            
            if (!direccion) {
                alert("Por favor, escribe una dirección");
                return;
            }

            // Mostrar mensaje de carga
            const boton = event.target;
            const textoOriginal = boton.textContent;
            boton.textContent = "Buscando...";
            boton.disabled = true;

            try {
                // Geocodificar la dirección
                const ubicacion = await geocodificarDireccion(direccion);
                
                if (ubicacion) {
                    // Centrar el mapa en la ubicación encontrada
                    mapa.setView([ubicacion.lat, ubicacion.lon], 16);
                    
                    // Eliminar marcadores anteriores si los hay
                    if (window.marcadorActual) {
                        mapa.removeLayer(window.marcadorActual);
                    }
                    
                    // Agregar nuevo marcador
                    window.marcadorActual = L.marker([ubicacion.lat, ubicacion.lon])
                        .addTo(mapa)
                        .bindPopup(ubicacion.nombre)
                        .openPopup();
                } else {
                    alert("No se encontró la dirección. Intenta con términos más específicos.");
                }
            } catch (error) {
                alert("Error al buscar la dirección: " + error.message);
            } finally {
                boton.textContent = textoOriginal;
                boton.disabled = false;
            }
        }

        // Inicializar el mapa cuando la página cargue
        window.addEventListener('load', iniciarMapa);
    