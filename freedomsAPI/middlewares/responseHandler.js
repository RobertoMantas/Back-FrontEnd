const freedomsCol = require("../models/freedoms");
const HttpStatus = require('http-status-codes');
const ClientError = require("../utils/clientError");

const getResponseHandler = async (_req, res, next) => {
    try {
        res.send(await freedomsCol.get(res.locals.filterData));
    } catch (error) {
        next(error);
    }
};

const errorResponseHandler = (err, _req, res, _next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.clientMessage || "Internal Server Error");
};

const methodNotAllowedHandler = (_req, _res, next) => {
    next(new ClientError("Method Not Allowed", "Method Not Allowed", HttpStatus.METHOD_NOT_ALLOWED));
};

module.exports = {
    getResponseHandler,
    methodNotAllowedHandler,
    errorResponseHandler
};