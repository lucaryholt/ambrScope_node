const router = require('express').Router();
const path = require('path');

router.get(['/', '/about', '/addspot', '/mypage'], (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../public/pages/main.html'));
});

router.get('/pages/:page', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../public/pages/', req.params.page + '.html'));
});

router.get('/*', (req, res) => {
    return res.status(501).redirect('/');
});

module.exports = router;