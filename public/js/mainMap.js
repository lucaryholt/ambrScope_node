let map;
let markers = [];
let tempMarker;

function initMap() {
    const uluru = { lat: -25.344, lng: 131.036 }

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: { lat: 56.085556, lng: 10.8746833 }
    });

    map.addListener('click', (e) => {
        if (tempMarker !== undefined) {
            tempMarker.setMap(null);
            tempMarker = undefined;
        }
        else {
            const infoWindow = new google.maps.InfoWindow({
                content: '<div class="marker"><span><a href="/addspot?lat=' + e.latLng.lat() + '&lng=' + e.latLng.lng() + '">Add spot here.</a></span></div>'
            });

            tempMarker = new google.maps.Marker({
                position: e.latLng,
                map: map
            });

            tempMarker.addListener('click', () => {
                infoWindow.open(map, tempMarker);
            });

            infoWindow.open(map, tempMarker);
        }
    });

    requestSpots();
}

function clearMarkers() {
    markers.map(marker => {
         marker.setMap(null);
    });
    markers.length = 0;
}

function addSpot(spot) {
    const infoWindow = new google.maps.InfoWindow({
        content:
            '<div class="marker">' +
            '<h3>' + spot.description + '</h3><br>' +
            '<span>Chance: ' + spot.chance + '</span><br>' +
            '<span>Finder method: ' + spot.finderMethod + '</span><br>' +
            '<span>Time: ' + spot.time + '</span><br>' +
            '<span>Precise: ' + spot.precise + '</span>' +
            '</div>'
    });

    const marker = new google.maps.Marker({
        position: { lat: Number(spot.latitude), lng: Number(spot.longitude) },
        title: spot.description,
        map: map
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}