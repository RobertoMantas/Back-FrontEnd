const mongoClient = require("mongodb").MongoClient;
const freedomsConst = require("./constants");
let _freedomsCollection;

const asyncConnectDB = async _ => {
    try {
        let server = await mongoClient
            .connect(freedomsConst.mongodbURL, {
                useNewUrlParser: true
            });
        _freedomsCollection = server.db(freedomsConst.mongoFreedomsDb).collection(freedomsConst.freedomsCollection);
        console.log(`familiesAPI-db connection: OK`);
    } catch (error) {
        throw error.stack;
    }
}

const getFreedomsCollection = _ => _freedomsCollection;

module.exports = {
    configDB: asyncConnectDB,
    freedomsCollection: getFreedomsCollection
};