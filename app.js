require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const session = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(require('./routes/pages.js'));

app.use(require('./routes/auth.js'));

app.listen(process.env.PORT, (error) => {
    if (error) console.log('Error starting server.');
    else console.log('Server started on port', Number(process.env.PORT));
});