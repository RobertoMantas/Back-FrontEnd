const familiesAPI = require("./familiesAPI");
const freedomsAPI = require("./freedomsAPI");
const governmentsAPI = require("./governmentsAPI");
const express = require("express");
var path = require('path');
var bp = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

const app = express();
var BASE_API_PATH = "/api/v1";
const mdbURLRoberto = "mongodb+srv://admin:admin1234@clusterrobertodsign-sxkzk.mongodb.net/governmentsAPI-db?retryWrites=true";
var dbRoberto;

app
  .get("/init", (req, res) => {
    res.send("Init Backend");
  })
  .on("error", _ => console.log("Error: Al levantar servidor"));

familiesAPI.register(app);
freedomsAPI.register(app);


app.get("/docs", (req, res) => {
  res.redirect("https://documenter.getpostman.com/view/5455766/S11NMcFj");
});

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bp.json());


var API_KEY = "keyRob";

// Helper method to check for apikey
var apiKeyCheck = function (request, response) {
  if (!request.query.apikey) {
    console.error('WARNING: No apikey was sent!');
    response.sendStatus(401);
    return false;
  }
  if (request.query.apikey !== API_KEY) {
    console.error('WARNING: Incorrect apikey was used!');
    response.sendStatus(403);
    return false;
  }
  return true;
};

var initialgovernment = [{
  "country": "Sweden",
  "year": "2016",
  "trustGovernment": 0.40,
  "generosity": 0.83,
  "confidence": 7.27
}, {
  "country": "Norway",
  "year": "2016",
  "trustGovernment": 0.35,
  "generosity": 0.37,
  "confidence": 7.42
}, {
  "country": "Spain",
  "year": "2016",
  "trustGovernment": 0.06,
  "generosity": 0.17,
  "confidence": 6.28
}, {
  "country": "Portugal",
  "year": "2016",
  "trustGovernment": 0.01,
  "generosity": 0.11,
  "confidence": 5.03
}
];

MongoClient.connect(mdbURLRoberto, (err, client) => {
  if (err) {
    console.error("DB connection error: " + err);
    process.exit(1);
  } else {
    dbRoberto = client.db("governmentsAPI-db").collection("government");
    dbRoberto.find({}).toArray((err, government) => {
      if (err) {
        console.error("Error getting data from dbRoberto: " + err);
      } else if (government.length == 0) {
        console.info("Adding initial government to empty dbRoberto");
        dbRoberto.insert(initialgovernment);
      } else {
        console.info("Connected to the dbRoberto with " + government.length + " government");
      }
    });

    //var governmentsAPI = require("./governmentsAPI");

    governmentsAPI.register(app, dbRoberto, BASE_API_PATH, apiKeyCheck);

    app.listen(process.env.PORT || 8088, () => {
      console.log("Server ready");
    }).on("error", (e) => {
      console.error("Server NOT ready!");
    });
  }
});


