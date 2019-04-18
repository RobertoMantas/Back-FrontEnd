const express = require('express');
const router = express.Router();
const freedomsCol = require("./models/freedoms");
const {
    commonValidators,
    yearValidate,
    countryValidate,
    validationHandler
} = require("./utils/validators");
const {
    queryParametersHandler,
    pathVariablesHandler
} = require("./utils/requestHandler")

// Interceptor
router.use(commonValidators, validationHandler, queryParametersHandler);


router.get('', async (_req, res, next) => {
    try {
        res.send(await freedomsCol.get(res.locals.filterData));
    } catch (error) {
        next(error);
    }
});

router.get('/:country/:year', countryValidate, yearValidate, validationHandler, pathVariablesHandler, async (_req, res, next) => {
    try {
        res.send(await freedomsCol.get(res.locals.filterData));
    } catch (error) {
        next(error);
    }
});

router.use((_req, _res, next) => {
    console.log("Interceptor 2");
    next();
});

router.get('/:country', countryValidate, pathVariablesHandler, async (_req, res, next) => {
    try {
        res.send(await freedomsCol.get(res.locals.filterData));
    } catch (error) {
        next(error);
    }
});

router.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.clientMessage || "Internal Server Error");
});

module.exports = {
    freedomsRouter: router
};