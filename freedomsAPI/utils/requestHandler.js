const queryParametersHandler = req => {
    let filterYearResult = {};

    if (req.from != null)
        filterYearResult = {
            "year": {
                $gte: req.from,
                $lte: req.to
            }
        };

    let fields = ['limit', 'offset', 'pepe'];
    let object = {};
    ({
        [fields[0]]: object[[fields[0]]],
        [fields[1]]: object[[fields[1]]],
        [fields[2]]: object[[fields[2]]]
    } = req);

    let filterPaginationResult = {}
    if (req.limit != null) {
        filterPaginationResult.limit = req.limit;
    }

    if (req.offset != null) {
        filterPaginationResult.skip = req.offset;
    }

    return {
        ...result
    } = {
        filterYearResult,
        filterPaginationResult,
    };
};

module.exports = {
    queryParametersHandler: queryParametersHandler
};