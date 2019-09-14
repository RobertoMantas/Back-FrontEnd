const freedomsCol = require("../models/freedoms");
const HttpStatus = require('http-status-codes');
const ClientError = require("../utils/ClientError");

const loadInitDataResponseHandler = async (_req, res, next) => {
    try {
        res.send(await freedomsCol.init());
    } catch (error) {
        next(error);
    }
};
const getResponseHandler = async (_req, res, next) => {
    try {
        const result = await freedomsCol.get(res.locals.filterData);
        if (!result.length) throw new ClientError("Collection not found", "Not Found", HttpStatus.NOT_FOUND);
        res.send(result);
    } catch (error) {
        next(error);
    }
};

const postResponseHandler = async (_req, res, next) => {
    try {
        await freedomsCol.save([res.locals.freedom])
        res.send(HttpStatus.CREATED);
    } catch (error) {
        next(error);
    }
};

const putResponseHandler = async (_req, res, next) => {
    try {
        const dbObject = await freedomsCol.get(res.locals.filterData);
        if (dbObject.length != 1) throw new ClientError("Put object not found in DB", "Not Found", HttpStatus.NOT_FOUND);
        if (res.locals.filterData.data.country != res.locals.freedom.country || res.locals.filterData.data.year != res.locals.freedom.year) {
            throw new ClientError("Put object country/year invalid", "BAD_REQUEST", HttpStatus.BAD_REQUEST);
        }
        res.send(await freedomsCol.put(
            res.locals.filterData.data,
            res.locals.freedom
        ));
    } catch (error) {
        next(error);
    }
};

const deleteResponseHandler = async (_req, res, next) => {
    try {
        res.send(await freedomsCol.delete(res.locals.filterData));
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
    loadInitDataResponseHandler,
    getResponseHandler,
    postResponseHandler,
    putResponseHandler,
    deleteResponseHandler,
    methodNotAllowedHandler,
    errorResponseHandler
};