const router = require('express').Router();
const firebaseAuth = require('../util/firebase').auth();

router.get('/auth/logout', (req, res) => {
    firebaseAuth.signOut(); // TODO maybe just call this after login, as we dont use the firebase user after
    req.session.user = undefined;
    return res.status(200).send({ message: 'Logged out!' });
});

router.get('/auth/logintest', (req, res) => {
    if (req.session.user === undefined) {
        return res.status(403).send({ message: 'Not logged in.' });
    } else {
        return res.status(200).send({ message: 'Logged in.' });
    }
});

router.post('/auth/login', (req, res) => {
    if (req.body.username === undefined) {
        firebaseAuth.signInAnonymously()
            .then((user) => {
                req.session.user = {
                    id: user.user.uid,
                    anonymous: user.user.isAnonymous
                };
                return res.status(200).send({ message: 'Logged in anonymously!' });
            })
            .catch((error) => {
                console.log(error.code);
                return res.status(403).send({ message: 'Could not log in.' });
            });
    } else {
        firebaseAuth.signInWithEmailAndPassword(req.body.username, req.body.password)
            .then((user) => {
                req.session.user = {
                    id: user.user.uid,
                    email: user.user.email,
                    anonymous: user.user.isAnonymous
                };
                return res.status(200).send({ message: 'Logged in!', username: user.user.email });
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/user-not-found') return res.status(403).send({ message: 'User does not exist.' });
                else if (errorCode === 'auth/wrong-password') return res.status(403).send({ message: 'Wrong password.' });

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
                anonymous: user.user.isAnonymous
            };
            return res.status(200).send({ message: 'Registered and logged in!', username: user.user.email });
        })
        .catch((error) => {
            const errorCode = error.code;
            console.log(errorCode);

            if (errorCode === 'auth/email-already-in-use') return res.status(403).send({ message: 'Email is already in use.' });

            return res.status(500).send({ message: 'Could not register.' });
        });
});

router.post('/auth/passwordreset', (req, res) => {
    firebaseAuth.sendPasswordResetEmail(req.body.username)
        .then(() => {
            return res.status(200).send({ message: 'Email sent to ' + req.body.username + '.' });
        })
        .catch((error) => {
            return res.status(500).send({ message: 'Could not reset password.', code: error.code });
        });
});

module.exports = router;