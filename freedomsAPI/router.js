const express = require('express');
const router = express.Router();
const freedomsCol = require("./models/freedoms");
const {
    commonValidators,
    validationHandler
} = require("./utils/validators");
const {
    queryParametersHandler
} = require("./utils/requestHandler")

// Interceptor
router.use(commonValidators, (req, res, next) => {
    try {
        validationHandler(req, next);
        res.locals.filterData = queryParametersHandler(req.query);
        console.log("Interceptor");
        next();
    } catch (error) {
        next(error);
    }

});

/*router.get('', function (req, res) {
    res.send('get Page');
});*/

router.get('', async (req, res, next) => {
    try {
        let {
            filterYearResult: data,
            filterPaginationResult: options
        } =
        res.locals.filterData;

        res.send(await freedomsCol.get(data, options));

    } catch (error) {
        next(error);
    }
});

router.use((req, res, next) => {
    console.log("Interceptor 2");
    next();
});
router.get('/:year', function (req, res) {
    console.log("yaear");
    res.send(`get Page: year ${req.params.year}`);
});

router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).send(err.clientMessage || "Internal Server Error");
});

module.exports = {
    freedomsRouter: router
};