const configBackend = require("./utils/mongoUtils");
const {
  init: freedomsInitDB
} = require("./models/freedoms");
const {
  freedomsRouter
} = require("./router");

const indexF = async (app, urlbase) => {
  try {
    await configBackend.configDB();
    await freedomsInitDB();
    app.use(`${urlbase}/freedoms`, freedomsRouter);
    console.log("Config FreedomsAPI module: OK ");
  } catch (error) {
    console.error("Config FreedomsAPI module: KO ");
    console.error(error);
  }

};
module.exports.register = indexF;