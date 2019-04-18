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
    getResponseHandler,
    methodNotAllowedHandler,
    errorResponseHandler
} = require("./middlewares/responseHandler");

router.use(commonValidators);

router.route('')
    .get(validationHandler, requestQueryHandler, getResponseHandler)
    .all(methodNotAllowedHandler);
//router.get('', );

router.get('/:country/:year', countryValidate, yearValidate, validationHandler, requestHandler, getResponseHandler);

router.use((_req, _res, next) => {
    console.log("Interceptor 2");
    next();
});

router.get('/:country', countryValidate, requestHandler, getResponseHandler);

router.use(errorResponseHandler);

module.exports = {
    freedomsRouter: router
};