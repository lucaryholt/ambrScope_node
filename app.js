require('dotenv').config();

const express = require('express');
const app = express();
const server = require('http').createServer(app);

require('./util/socketServer.js').initiateSocketServer(server);
require('./util/firebaseRepo.js');

app.use(express.static('public'));
app.use(express.json());

const session = require('express-session');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const rateLimiter = require('express-rate-limit');

const authLimit = rateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 20
});

const spotsLimit = rateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 30
});

app.use('/auth', authLimit);
app.use('/spots', spotsLimit);

app.use(require('./routes/auth.js'));
app.use(require('./routes/spots.js'));
app.use(require('./routes/pages.js'));

server.listen(process.env.PORT, (error) => {
    if (error) console.log('Error starting server.');
    else console.log('Server started on port', Number(process.env.PORT));
});