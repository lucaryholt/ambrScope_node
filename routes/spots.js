const router = require('express').Router();
const uuid = require('uuid');
const escape = require('escape-html');
const firebaseRepo = require('../util/firebaseRepo.js');

router.get('/spots', (req, res) => {
  const { user } = req.session;

  if (user !== undefined) {
    if (!user.anonymous) {
      firebaseRepo.findSpotsByUserID(user.id)
        .then((spots) => {
          if (spots.length === 0) {
            return res.status(404).send({ message: 'No spots were found.' });
          }
          return res.status(200).send({ message: 'Spots were found.', spots });
        }).catch((reason) => res.status(500).send({ message: 'Internal Server Error', error: reason }));
    } else {
      return res.status(403).send({ message: 'Only non-anonymous users can access their spots.' });
    }
  } else {
    return res.status(403).send({ message: 'You need to be logged in to access your spots.' });
  }
});

router.post('/spots', async (req, res) => {
  const { user } = req.session;

  if (user !== undefined) {
    const spot = {
      id: uuid.v4(),
      userID: user.id,
      timestamp: `${new Date().getTime()}`,
      description: escape(req.body.description),
      time: escape(req.body.time),
      chance: escape(req.body.chance),
      finderMethod: escape(req.body.finderMethod),
      precise: req.body.precise,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      amount: escape(req.body.amount),
      additionalInfo: escape(req.body.additionalInfo),
    };
    await firebaseRepo.saveSpot(spot);

    return res.status(200).send({ message: 'Spot saved!' });
  }
  return res.status(403).send({ message: 'You need to be logged in to add spots.' });
});

router.delete('/spots/:id', (req, res) => {
  const { user } = req.session;

  if (user !== undefined) {
    firebaseRepo.findSpotByID(req.params.id)
      .then(async (spot) => {
        if (spot.userID === user.id) {
          await firebaseRepo.deleteSpot(spot.id);
          return res.status(200).send({ message: 'Spot deleted.' });
        }
        return res.status(403).send({ message: 'You do not have permission to delete this spot.' });
      })
      .catch(() => res.status(500).send({ message: 'Internal Server Error' }));
  } else {
    return res.status(403).send({ message: 'You need to be logged in to access this function.' });
  }
});

module.exports = router;
