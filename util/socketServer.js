const firebaseRepo = require('./firebaseRepo.js');

let io = null;

function initiateSocketServer(server) {
    io = require('socket.io')(server);

    io.on('connection', (socket) => {
        socket.on('request spots', ({ data }) => {
            socket.emit('server update spots', { data: firebaseRepo.spots });
        });
    });

    firebaseRepo.listenForUpdates((spots) => {
        io.emit('server update spots', { data: spots });
    });
}

module.exports = {
    initiateSocketServer
};