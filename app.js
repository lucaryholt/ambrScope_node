require('dotenv').config();

const express = require('express');

const app = express();

// Socket.IO and Firebase setup, initialization
const server = require('http').createServer(app);
require('./util/socketServer.js')(server);
require('./util/firebaseRepo.js');

// General Express setup
app.use(express.static('public'));
app.use(express.json());

// Session setup
const session = require('express-session');

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
};

if (process.env.ENVIRONMENT === 'production') {
  app.set('trust proxy', 1);
  sessionOptions.cookie.secure = true;
}

app.use(session(sessionOptions));

// Rate limit setup
const rateLimiter = require('express-rate-limit');

const authLimit = rateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
});

const spotsLimit = rateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 30,
});

app.use('/auth', authLimit);
app.use('/spots', spotsLimit);

// Routes
app.use(require('./routes/auth.js'));
app.use(require('./routes/spots.js'));
app.use(require('./routes/pages.js'));

// Request listener
server.listen(process.env.PORT, (error) => {
  if (error) console.log('Error starting server.');
  else console.log('Server started on port', Number(process.env.PORT));
});
