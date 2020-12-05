require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.static('public'));

app.use(require('./routes/pages.js'));

app.listen(process.env.PORT, (error) => {
    if (error) console.log('Error starting server.');
    else console.log('Server started on port', Number(process.env.PORT));
});