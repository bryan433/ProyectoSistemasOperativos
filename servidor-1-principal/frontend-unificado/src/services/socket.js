import { io } from 'socket.io-client';

export const socket = io('http://localhost:3001', {
  transports: ['websocket'],
});

export const subscribeToTickets = (callback) => {
  socket.on('ticket_generado', callback);

  return () => {
    socket.off('ticket_generado', callback);
  };
};