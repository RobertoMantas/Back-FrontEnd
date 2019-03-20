const express = require('express');
const router = express.Router();

// Interceptor
router.use(function timeLog(req, res, next) {
    console.log("Interceptor");
    next();
});

router.get('', function (req, res) {
    res.send('get Page');
});

router.get('/:year', function (req, res) {
    res.send(`get Page: year ${req.params.year}`);
});

module.exports = router;