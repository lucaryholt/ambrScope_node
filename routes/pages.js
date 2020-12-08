const router = require('express').Router();
const path = require('path');

router.get(['/', '/about', '/addspot', '/mypage'], (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/pages/main.html'));
});

router.get('/pages/:page', (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/pages/', req.params.page + '.html'));
});

module.exports = router;