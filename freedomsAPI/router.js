const express = require('express');
const router = express.Router();
const {
    commonValidators,
    yearValidate,
    countryValidate,
    validationHandler
} = require("./middlewares/validators");
const {
    requestQueryHandler,
    requestHandler
} = require("./middlewares/requestHandler");

const {
    getResponseHandler
} = require("./middlewares/responseHandler");

router.use(commonValidators);

router.get('', validationHandler, requestQueryHandler, getResponseHandler);

router.get('/:country/:year', countryValidate, yearValidate, validationHandler, requestHandler, getResponseHandler);

router.use((_req, _res, next) => {
    console.log("Interceptor 2");
    next();
});

router.get('/:country', countryValidate, requestHandler, getResponseHandler);

router.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.clientMessage || "Internal Server Error");
});

module.exports = {
    freedomsRouter: router
};