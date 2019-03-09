const familiesAPI = require("./familiesAPI");
const freedomsAPI = require("./freedomsAPI");
const governmentsAPI = require("./governmentsAPI");
const express = require("express");

const app = express();

app
  .get("/init", (req, res) => {
    res.send("Init Backend");
  })
  .on("error", _ => console.log("Error: Al levantar servidor"));

familiesAPI.register(app);
freedomsAPI.register(app);
governmentsAPI.register(app);

app.listen(process.env.PORT || 8080);
