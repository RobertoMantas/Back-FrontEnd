const express = require("express");
const router = express.Router();
const {
    commonValidators,
    yearValidate,
    countryValidate,
    bodyValidate,
    validationHandler
} = require("./middlewares/validators");
const {
    requestQueryHandler,
    requestHandler,
    requestBodyHandler
} = require("./middlewares/requestHandler");

const {
    loadInitDataResponseHandler,
    getResponseHandler,
    postResponseHandler,
    putResponseHandler,
    deleteResponseHandler,
    methodNotAllowedHandler,
    errorResponseHandler
} = require("./middlewares/responseHandler");

router.use(commonValidators);


router
    .route("/loadInitialData")
    .get(loadInitDataResponseHandler)
    .all(methodNotAllowedHandler);

router
    .route("")
    .get(validationHandler, requestQueryHandler, getResponseHandler)
    .post(
        bodyValidate,
        validationHandler,
        requestBodyHandler,
        postResponseHandler
    )
    .delete(validationHandler, requestQueryHandler, deleteResponseHandler)
    .all(methodNotAllowedHandler);

router
    .route("/:country")
    .get(countryValidate, validationHandler, requestHandler, getResponseHandler)
    .all(methodNotAllowedHandler);

router
    .route("/:country/:year")
    .get(countryValidate, yearValidate, validationHandler, requestHandler, getResponseHandler)
    .put(
        bodyValidate,
        countryValidate,
        yearValidate,
        validationHandler,
        requestHandler,
        requestBodyHandler,
        putResponseHandler
    )
    .delete(countryValidate, yearValidate, validationHandler, requestHandler, deleteResponseHandler)
    .all(methodNotAllowedHandler);

router.use((_req, _res, next) => {
    console.log("Interceptor 2");
    next();
});

router.use(errorResponseHandler);

module.exports = {
    freedomsRouter: router
};