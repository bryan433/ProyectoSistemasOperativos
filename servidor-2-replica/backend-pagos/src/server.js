const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const pacientesRoutes = require('./routes/pacientes.routes');
const pagosRoutes = require('./routes/pagos.routes');
const ticketsRoutes = require('./routes/tickets.routes');

const { initSocket } = require('./config/socket');

const app = express();
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

initSocket(io);

io.on('connection', (socket) => {
  console.log(`Cliente conectado por WebSocket: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Backend Pagos funcionando',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'backend-pagos',
  });
});

app.use('/api/pacientes', pacientesRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/tickets', ticketsRoutes);

server.listen(PORT, () => {
  console.log(`Backend Pagos ejecutándose en puerto ${PORT}`);
});
