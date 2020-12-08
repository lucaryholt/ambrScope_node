const router = require('express').Router();
const firebaseRepo = require('../util/firebaseRepo.js');
const uuid = require('uuid');

router.get('/spots', async (req, res) => {
    const user = req.session.user;

    if (user !== undefined) {
        if (!user.anonymous) {
            firebaseRepo.findSpotsByUserID(user.id)
                .then(spots => {
                    return res.status(200).send({ message: 'Spots were found.', spots });
                }).catch(reason => {
                    if (reason === 0) return res.status(404).send({ message: 'No spots were found.' });
                    else return res.status(500).send({ message: 'Internal Server Error' });
                });
        } else {
            return res.status(403).send({ message: 'Only non-anonymous users can access their spots.' });
        }
    } else {
        return res.status(403).send({ message: 'You need to be logged in to access your spots.' });
    }
});

router.post('/spots', async (req, res) => {
    const user = req.session.user;

    if (user !== undefined) {
        const spot = {
            id: uuid.v4(),
            userID: user.id,
            timestamp: new Date().getTime() + "",
            description: req.body.description,
            time: req.body.time,
            chance: req.body.chance,
            finderMethod: req.body.finderMethod,
            precise: req.body.precise,
            latitude: req.body.latitude,
            longitude: req.body.longitude
    }
    await firebaseRepo.saveSpot(spot);

    return res.status(200).send({ message: 'Spot saved!' });
    } else {
        return res.status(403).send({ message: 'You need to be logged in to add spots.' });
    }
});

router.delete('/spots/:id', async (req, res) => {
    const user = req.session.user;

    if (user !== undefined) {
        firebaseRepo.findSpotByID(req.params.id)
            .then(async spot => {
                if (spot.userID === user.id) {
                    await firebaseRepo.deleteSpot(spot.id);
                    return res.status(200).send({ message: 'Spot deleted.' });
                } else {
                    return res.status(403).send({ message: 'You do not have permission to delete this spot.' });
                }
            })
            .catch(error => {
                return res.status(500).send({ message: 'Internal Server Error' });
            });
    } else {
        return res.status(403).send({ message: 'You need to be logged in to access this function.' });
    }
});

module.exports = router;