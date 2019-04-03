const HttpStatus = require('http-status-codes');
const ClientError = require("./clientError");

const {
    check,
    query,
    validationResult,
    oneOf
} = require('express-validator/check');


const paginationValidate = [
    check('limit')
    .optional()
    .isInt({
        min: 1
    })
    .toInt(),

    check('offset')
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
                req
            }) =>
            req.query.to >= value
        ),

        query('to')
        .optional()
        .isInt({
            min: 1
        })
        .toInt()
        .custom((value, {
            req
        }) => req.query.from <= value)
    ]
], "Invalid from-to params")

const validationHandler = req => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ClientError("Validation KO", errors.array().map(err => err.msg), HttpStatus.BAD_REQUEST);
    }
}

module.exports = {
    paginationValidate,
    fromToValidate,
    commonValidators: [paginationValidate, fromToValidate],
    validationHandler
}