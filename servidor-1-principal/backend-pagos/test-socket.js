const { io } = require('socket.io-client');

const socket = io('http://localhost:3001', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Conectado al WebSocket:', socket.id);
});

socket.on('ticket_generado', (ticket) => {
  console.log('Ticket recibido por WebSocket:');
  console.log(ticket);
});