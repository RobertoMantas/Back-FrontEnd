const {
    freedomsCollection
} = require("../utils/mongoUtils");
var csv = require('fast-csv');
const fs = require('fs');
const {
    promisify
} = require('util');


const readDirAsync = promisify(fs.readdir);


const asyncCvsReader = fileName => {
    return new Promise((resolve, reflect) => {
        const totalObjects = [];
        csv.fromPath(`resources/${fileName}`, {
                headers: true,
                delimiter: ';'
            })
            .validate((data, next) => {
                if (parseInt(fileName.split(".")[0]) &&
                    data['Country'] &&
                    !isNaN(data['Health (Life Expectancy)'].replace(",", ".")) &&
                    !isNaN(data['Freedom'].replace(",", ".")) &&
                    !isNaN(data['Happiness Rank'])) {
                    next(null, true);
                } else {

                    reflect(new Error(`Invalid data in ${fileName}`));
                }
            })
            .on("data", data =>
                totalObjects.push({
                    year: parseInt(fileName.split(".")[0]),
                    country: data['Country'],
                    hScore: parseFloat(data['Health (Life Expectancy)'].replace(",", ".")),
                    freedom: parseFloat(data['Freedom'].replace(",", ".")),
                    hRank: parseInt(data['Happiness Rank'])
                })
            )
            .on("end", async _ =>
                resolve(totalObjects));
    });
}
const initDB = async _ => {
    try {
        let files = await readDirAsync("resources/");
        await deleteDB({});
        let csvReaderResult = (await Promise.all(files.map(fileName => asyncCvsReader(fileName)))).reduce((t, cv) => t.concat(cv), []);
        await saveDB(csvReaderResult);

    } catch (error) {
        throw error.stack;
    }
};

const saveDB = async data => {
    try {
        const result = await freedomsCollection().insertMany(data);
        console.log(`Insert OK: ${result.insertedCount }`);
    } catch (error) {
        throw error.stack;
    }
};

const deleteDB =
    async data => {
        try {
            const result = await freedomsCollection().deleteMany(data);
            console.log(`Remove OK: ${result.deletedCount}`);
        } catch (error) {
            throw error.stack;
        }
    };

const getDB =
    async ({
        data = {},
        options = {}
    }) => {
        try {
            const result = await freedomsCollection().find(data, options).toArray();
            console.log(`GET OK: ${result.length}`);
            return result;
        } catch (error) {
            throw error.stack;
        }
    };

const putDB =
    async ({
        data = {},
        options = {}
    }) => {
        try {
            const result = await freedomsCollection().find(data, options).toArray();
            console.log(`GET OK: ${result.length}`);
            return result;
        } catch (error) {
            throw error.stack;
        }
    };

module.exports = {
    init: initDB,
    save: saveDB,
    delete: deleteDB,
    get: getDB,
    put: putDB
};