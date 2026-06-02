let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;
};

const getSocket = () => {
  if (!ioInstance) {
    throw new Error('Socket.IO no ha sido inicializado');
  }

  return ioInstance;
};

module.exports = {
  initSocket,
  getSocket,
};