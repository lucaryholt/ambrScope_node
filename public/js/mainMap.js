function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: { lat: 56.2, lng: 10.5 },
    mapId: '8a7896a740fb9f7b',
  });

  map.addListener('click', (e) => {
    if (tempMarker !== undefined) {
      tempMarker.setMap(null);
      tempMarker = undefined;
    } else {
      const infoWindow = new google.maps.InfoWindow({
        content: `<div class="marker"><span><a onclick="addSpot(${e.latLng.lat()},${e.latLng.lng()})">Add spot here.</a></span></div>`,
      });

      tempMarker = new google.maps.Marker({
        position: e.latLng,
        map,
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
  markers.map((marker) => {
    marker.setMap(null);
  });
  markers.length = 0;
}

function addMarker(spot) {
  const infoWindow = new google.maps.InfoWindow({
    content:
            '<div class="marker">'
            + `<h3>${spot.description}</h3><br>`
            + `<span>Chance: ${spot.chance}</span><br>`
            + `<span>Finder method: ${spot.finderMethod}</span><br>`
            + `<span>Time: ${spot.time}</span><br>`
            + `<span>Precise: ${spot.precise}</span><br>`
            + `<span>Amount: ${spot.amount}</span><br>`
            + `<span>Additional info: ${spot.additionalInfo}</span>`
            + '</div>',
  });

  const marker = new google.maps.Marker({
    position: { lat: Number(spot.latitude), lng: Number(spot.longitude) },
    title: spot.description,
    map,
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

function addSpot(lat, lng) {
  showPage(`addspot?lat=${lat}&lng=${lng}`);
}
