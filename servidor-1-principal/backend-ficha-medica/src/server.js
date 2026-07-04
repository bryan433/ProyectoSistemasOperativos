const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const fichaRoutes = require('./routes/ficha.routes');
const fichaService = require('./services/ficha.Service');

const app = express();
const server = http.createServer(app);

// Configuración de Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/fichas', fichaRoutes);

// Healthcheck
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API Ficha Médica funcionando' });
});

// WebSockets (Eventos en tiempo real)
io.on('connection', (socket) => {
    console.log(`[Socket] Nuevo cliente conectado: ${socket.id}`);

    // Escuchar evento de "pagoRealizado" desde el Módulo de Pagos
    socket.on('pagoRealizado', async (data) => {
        console.log('[Socket] Evento pagoRealizado recibido:', data);

        try {
            const { pacienteId } = data;
            // Al recibir el pago, creamos la ficha médica automáticamente
            const ficha = await fichaService.crearFichaMedica(pacienteId, 'Ficha creada automáticamente post-pago', '');

            console.log(`[Socket] Ficha médica creada para paciente ${pacienteId}`);

            // Emitir evento de confirmación de vuelta o hacia el Frontend
            io.emit('fichaCreada', { pacienteId, fichaId: ficha.id, status: 'success' });

        } catch (error) {
            console.error('[Socket] Error al crear ficha post-pago:', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] Cliente desconectado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
    console.log(`Servidor API Ficha Médica (HTTP & WebSockets) corriendo en el puerto ${PORT}`);
});
