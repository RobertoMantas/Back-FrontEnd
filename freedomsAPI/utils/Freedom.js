class Freedom {
    constructor(object) {
        this.year = object.year;
        this.country = object.country;
        this.hScore = object.hScore;
        this.freedom = object.freedom;
        this.hRank = object.hRank;
    }
    getUpdateFields() {
        return Object.keys(this).reduce((acc, key) => {
            let temporal_acc = {}
            if (this[key] != undefined) {
                temporal_acc[key] = this[key];
            }
            return {
                ...acc,
                ...temporal_acc
            };
        }, {});
    }
}

module.exports = Freedom;