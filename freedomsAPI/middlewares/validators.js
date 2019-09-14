const HttpStatus = require('http-status-codes');
const ClientError = require("../utils/cClientError");

const {
    query,
    param,
    body,
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
        min: 0
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

const bodyValidate = [
    body('year')
    .isInt({
        min: 1
    })
    .toInt(),

    body('country')
    .isString()
    .trim(),

    body('hScore')
    .isDecimal({
        min: 0.00,
        max: 1.00
    })
    .toFloat(),

    body('freedom')
    .isDecimal({
        min: 0.00,
        max: 1.00
    })
    .toFloat(),

    body('hRank')
    .isInt({
        min: 1
    })
    .toInt()
];
const validationHandler = (req, _res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new ClientError("Validation KO", errors.array().map(err => `${err.param}: ${err.msg}`), HttpStatus.BAD_REQUEST));
    }
    next();
};

module.exports = {
    commonValidators: [paginationValidate, fromToValidate],
    yearValidate,
    countryValidate,
    validationHandler,
    bodyValidate
};