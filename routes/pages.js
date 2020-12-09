const router = require('express').Router();
const path = require('path');

router.get(['/', '/about', '/addspot', '/mypage'], (req, res) => res.status(200).sendFile(path.join(__dirname, '../public/pages/main.html')));

router.get('/pages/:page', (req, res) => res.status(200).sendFile(path.join(__dirname, '../public/pages/', `${req.params.page}.html`)));

router.get('/*', (req, res) => res.status(501).redirect('/'));

module.exports = router;
