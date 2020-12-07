const socket = io();

function requestSpots() {
    socket.emit('request spots', {});
}

socket.on('server update spots', ({ data }) => {
    clearMarkers();
    data.map(spot => {
        addMarker(spot);
    });
});