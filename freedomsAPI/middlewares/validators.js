const HttpStatus = require('http-status-codes');
const ClientError = require("../utils/clientError");

const {
    query,
    param,
    validationResult,
    oneOf
} = require('express-validator/check');


const paginationValidate = [
    query('limit')
    .optional()
    .isInt({
        min: 1
    })
    .toInt(),

    query('offset')
    .optional()
    .isInt({
        min: 1
    })
    .toInt()

];

const fromToValidate = oneOf([
    [
        query('from')
        .optional()
        .isInt({
            min: 1
        })
        .toInt()
        .custom((value, {
            req: {
                query: params
            }
        }) => params.to >= value),

        query('to')
        .optional()
        .isInt({
            min: 1
        })
        .toInt()
        .custom((value, {
            req: {
                query: params
            }
        }) => params.from <= value)
    ]
], "Invalid from-to params");

const yearValidate = [
    param('year')
    .isInt({
        min: 1
    })
    .toInt()
];

const countryValidate = [
    param('country')
    .isString()
    .not()
    .isEmpty()
];
const validationHandler = (req, _res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new ClientError("Validation KO", errors.array().map(err => err.msg), HttpStatus.BAD_REQUEST));
    }
    next();
};

module.exports = {
    commonValidators: [paginationValidate, fromToValidate],
    yearValidate,
    countryValidate,
    validationHandler
};