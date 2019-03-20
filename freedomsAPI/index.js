//const configBackend = require("./utils/mongoUtils");
//const families = require("./models/familes");
const router = require("./router");

const indexF = async (app) => {
  console.log("Empieza");
  //await configBackend.configDB();
  //families.initDB();
  console.log("Termina");
  app.use("/families", router);
  console.log("FAMILIES API");
}
module.exports.register = indexF;