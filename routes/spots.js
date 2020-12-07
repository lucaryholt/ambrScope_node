const router = require('express').Router();
const firebaseRepo = require('../util/firebaseRepo.js');
const uuid = require('uuid');

router.post('/spots/addspot', async (req, res) => {
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

module.exports = router;