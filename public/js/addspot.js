window.location.search.split('?')[1].split('&').map(query => {
    if (query.split('=')[0] === 'lat') {
        lat = Number(query.split('=')[1]);
    } else if (query.split('=')[0] === 'lng') {
        lng = Number(query.split('=')[1]);
    }
});

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
            gestureHandling: 'none'
        });

        const spotMarker = new google.maps.Marker({
            position: spotCoordinates,
            map: map
        });
    }
}

function saveSpot() {
    const description = document.getElementById('description-input').value;
    const time = document.getElementById('time-input').value;
    const chance = document.getElementById('chance-input').value;
    const finderMethod = document.getElementById('finder-method-input').value;
    const precise = document.getElementById('precise-radio-precise').checked;

    fetch('/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description,
            time,
            chance,
            finderMethod,
            precise: precise + "",
            latitude: lat + "",
            longitude: lng + ""
        })
    })
        .then(response => {
            handleResponse(response, (response) => {
                response.json()
                    .then(result => {
                        popUpAlert(result.message, 'success');
                        showPage('');
                    });
            }, (error) => {
                popUpAlert(error, 'warning');
            });
        })
}