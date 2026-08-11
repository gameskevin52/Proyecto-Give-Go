import 'dotenv/config';
import path from 'path';
import express from 'express';
import app from './app';
import { initDB } from './config/db';
import { createServer as createViteServer } from 'vite';

const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {

    // 1. Inicializar Base de Datos
    await initDB();

    // 2. Configurar Vite para servir el Frontend en desarrollo
    if (process.env.NODE_ENV !== 'production') {

        console.log('🚀 Iniciando servidor de desarrollo de Vite...');

        const vite = await createViteServer({
            server: {
                middlewareMode: true
            },
            appType: 'spa',
        });

        app.use(vite.middlewares);

    } else {

        // 3. Servir archivos estáticos en producción
        const distPath = path.join(process.cwd(), 'dist');

        app.use(express.static(distPath));

        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    // 4. Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {

        console.log('🚀 Servidor Give&Go iniciado correctamente.');
        console.log(`👉 Backend API: http://localhost:${PORT}/api`);
        console.log(`👉 Frontend App: http://localhost:${PORT}`);

    });
}

startServer().catch(err => {

    console.error('❌ Error fatal al iniciar el servidor:', err);

});