const firebaseRepo = require('./firebaseRepo.js');

function initiateSocketServer(server) {
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    socket.on('request spots', () => {
      socket.emit('server update spots', { data: firebaseRepo.spots });
    });
  });

  firebaseRepo.listenForUpdates((spots) => {
    io.emit('server update spots', { data: spots });
  });
}

module.exports = {
  initiateSocketServer,
};
