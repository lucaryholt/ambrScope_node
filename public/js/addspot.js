const coordinates = window.location.search.split('?')[1].split('&');
lat = Number(coordinates[0].split('=')[1]);
lng = Number(coordinates[1].split('=')[1]);

function initMap() {
  if (lat === undefined && lng === undefined) {
    popUpAlert('Coordinates were not read.', 'warning');
    showPage('');
  } else {
    const spotCoordinates = { lat, lng };

    map = new google.maps.Map(document.getElementById('add-spot-map'), {
      zoom: 14,
      center: spotCoordinates,
      disableDefaultUI: true,
      gestureHandling: 'none',
      mapId: '8a7896a740fb9f7b',
    });

    const spotMarker = new google.maps.Marker({
      position: spotCoordinates,
      map,
    });
  }
}

function saveSpot() {
  const description = $('#description-input').val();
  const time = $('#time-input').val();
  const chance = $('#chance-input').val();
  const finderMethod = $('#finder-method-input').val();
  const precise = $('#precise-radio-precise')[0].checked;
  const amount = $('#amount-input').val();
  const additionalInfo = $('#additional-info-input').val();

  fetch('/spots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description,
      time,
      chance,
      finderMethod,
      precise: `${precise}`,
      latitude: `${lat}`,
      longitude: `${lng}`,
      amount,
      additionalInfo,
    }),
  })
    .then((response) => {
      handleResponse(response, (response) => {
        response.json()
          .then((result) => {
            popUpAlert(result.message, 'success');
            showPage('');
          });
      }, (error) => {
        popUpAlert(error, 'warning');
      });
    });
}
