const mongoClient = require("mongodb").MongoClient;
const familiesAPIConst = require("./constants");
let _familiesDB;
let _familiesCollection;

const asyncConnectDB = async _ => {
    try {
        let server = await mongoClient
            .connect(familiesAPIConst.mongodbURL, {
                useNewUrlParser: true
            });
        _familiesDB = await server.db(familiesAPIConst.mongoFamiliesApiDb);
        console.log(`familiesAPI-db connection: OK`);

        _familiesCollection = await getCollection(familiesAPIConst.familiesCollection);
        console.log("Noup");

    } catch (e) {
        console.log(`familiesAPI-db connection: ERROR`);
        console.log(e.stack);
    }
};

const getCollection = async collectionName => {
    try {
        console.log(`Connect to collection ${collectionName}: OK`);
        return _familiesDB.collection(collectionName);

    } catch (error) {
        console.log(`SConnect to collection ${collectionName}: ERROR`);
        console.log(error.stack);
    }
};

const getFamilliesCollection = _ => _familiesCollection;

module.exports = {
    configDB: asyncConnectDB,
    familiesCollection: getFamilliesCollection
};