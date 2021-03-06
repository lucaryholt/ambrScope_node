const router = require('express').Router();
const firebaseAuth = require('../util/firebase').auth();

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  return res.status(200).send({ message: 'Logged out!' });
});

router.get('/logintest', (req, res) => {
  if (req.session.user === undefined) {
    return res.status(403).send({ message: 'Not logged in.' });
  }
  return res.status(200).send({
    message: 'Logged in.',
    username: req.session.user.email,
    isAnonymous: req.session.user.anonymous,
  });
});

router.post('/auth/login', (req, res) => {
  if (req.body.username === undefined) {
    firebaseAuth.signInAnonymously()
      .then((user) => {
        req.session.user = {
          id: user.user.uid,
          anonymous: user.user.isAnonymous,
        };
        firebaseAuth.signOut();
        return res.status(200).send({ message: 'Logged in anonymously!' });
      })
      .catch(() => res.status(403).send({ message: 'Could not log in.' }));
  } else {
    firebaseAuth.signInWithEmailAndPassword(req.body.username, req.body.password)
      .then((user) => {
        req.session.user = {
          id: user.user.uid,
          email: user.user.email,
          anonymous: user.user.isAnonymous,
        };
        firebaseAuth.signOut();
        return res.status(200).send({ message: 'Logged in!', username: user.user.email });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/user-not-found') return res.status(404).send({ message: 'User does not exist.' });
        if (errorCode === 'auth/wrong-password') return res.status(403).send({ message: 'Wrong password.' });
        return res.status(403).send({ message: 'Could not log in.' });
      });
  }
});

router.post('/auth/register', (req, res) => {
  firebaseAuth.createUserWithEmailAndPassword(req.body.username, req.body.password)
    .then((user) => {
      req.session.user = {
        id: user.user.uid,
        email: user.user.email,
        anonymous: user.user.isAnonymous,
      };
      firebaseAuth.signOut();
      return res.status(200).send({ message: 'Registered and logged in!', username: user.user.email });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') return res.status(403).send({ message: 'Email is already in use.' });
      return res.status(500).send({ message: 'Could not register.' });
    });
});

router.post('/auth/passwordreset', (req, res) => {
  firebaseAuth.sendPasswordResetEmail(req.body.username)
    .then(() => res.status(200).send({ message: `Email sent to ${req.body.username}.` }))
    .catch((error) => res.status(500).send({ message: 'Could not reset password.', code: error.code }));
});

module.exports = router;
