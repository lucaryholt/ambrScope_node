const socket = io();

socket.emit('request spots', {});

socket.on('server update spots', ({ data }) => {
    console.log(data);
});