function getSpots() {
    fetch('/spots')
        .then(response => {
            handleResponse(response, (response) => {
                response.json()
                    .then(result => {
                        appendSpots(result.spots);
                    });
            }, (error) => {
                popUpAlert(error, 'warning');
                showPage('');
            });
        })
}

function appendSpots(spots) {
    const hook = $('#spot-hook');
    hook.html('');
    spots.map(spot => {
        const html =
            '<div class="spot">' +
            '<h5>' + spot.description + '</h5>' +
            '<span>Location: ' + spot.latitude + ',' + spot.longitude + '</span><br>' +
            '<span>Chance: ' + spot.chance + '</span><br>' +
            '<span>Finder method: ' + spot.finderMethod + '</span><br>' +
            '<span>Time: ' + spot.time + '</span><br>' +
            '<span>Precise: ' + spot.precise + '</span><br>' +
            '<button class="btn btn-danger" type="button" onclick="deleteSpot(`' + spot.id + '`)">Delete</button>' +
            '</div>' +
            '<hr>';

        hook.append(html);
    });
}

function deleteSpot(id) {
    fetch('/spots/' + id, {
        method: 'DELETE'
    })
        .then(response => {
            handleResponse(response, (response) => {
                response.json()
                    .then(result => {
                        popUpAlert(result.message, 'success');
                        getSpots();
                    });
            }, (error) => {
                popUpAlert(error, 'warning');
            });
        })
}

getSpots();