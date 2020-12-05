require('dotenv').config();

const express = require('express');
const app = express();

require('./util/firebaseAuth.js');

app.use(express.static('public'));

app.use(require('./routes/pages.js'));

app.use(require('./routes/auth.js'));

app.listen(process.env.PORT, (error) => {
    if (error) console.log('Error starting server.');
    else console.log('Server started on port', Number(process.env.PORT));
});