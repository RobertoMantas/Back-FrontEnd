const requestQueryHandler =
    ({
        query: parameters = {}
    }, res, next) => {

        const filterYearResult = {
            ...(parameters.from && {
                year: {
                    $gte: parameters.from,
                    $lte: parameters.to
                }
            })
        };

        const filterPaginationResult = {
            ...(parameters.limit && {
                limit: parameters.limit
            }),
            ...(parameters.offset && {
                skip: parameters.offset
            })
        };

        res.locals.filterData = {
            data: filterYearResult,
            options: filterPaginationResult,
        };

        next();
    };

const requestParamsHandler =
    ({
        params: parameters = {}
    }, res, next) => {
        res.locals.filterData.data = {
            ...parameters,
            ...res.locals.filterData.data
        }

        next();
    };
module.exports = {
    requestQueryHandler,
    requestHandler: [requestQueryHandler, requestParamsHandler]
};