const freedomsCol = require("../models/freedoms");

const getResponseHandler = async (_req, res, next) => {
    try {
        res.send(await freedomsCol.get(res.locals.filterData));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getResponseHandler
};