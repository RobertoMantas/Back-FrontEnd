const familiesAPI = require("./familiesAPI");
const freedomsAPI = require("./freedomsAPI");
const governmentsAPI = require("./governmentsAPI");
const express = require("express");
var path = require('path');
var bp = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var cors = require('cors');

const app = express();
var BASE_API_PATH = "/api/v1";

//Roberto
const mdbURLRoberto = "mongodb+srv://admin:admin1234@clusterrobertodsign-sxkzk.mongodb.net/governmentsAPI-db?retryWrites=true";
var dbRoberto;

//Jesus
const mdbURLJesus = "mongodb+srv://admin:admin1234@dgsin1819-03-jdiazcabe-ninmx.mongodb.net/familiesAPI-db?retryWrites=true";
var dbJesus;

app
  .get("/init", (req, res) => {
    res.send("Init Backend");
  })
  .on("error", _ => console.log("Error: Al levantar servidor"));

familiesAPI.register(app);
freedomsAPI.register(app);


app.use("/", express.static(path.join(__dirname, "public")));
app.use(bp.json());
app.use(cors());

app.listen(process.env.PORT || 8089, () => {
  console.log("Server ready");
}).on("error", (e) => {
  console.error("Server NOT ready!");
});



//------------------------------------------------Roberto--------------------------------------------------------------------------

app.get("/docsroberto", (req, res) => {
  res.redirect("https://documenter.getpostman.com/view/1779152/S11RJvKA");
});

var API_KEY_Rob = "keyRob";
// Helper method to check for apikey
var apiKeyCheck = function (request, response) {
  if (!request.query.apikey) {
    console.error('WARNING: No apikey was sent!');
    response.sendStatus(401);
    return false;
  }
  if (request.query.apikey !== API_KEY_Rob) {
    console.error('WARNING: Incorrect apikey was used!');
    response.sendStatus(403);
    return false;
  }
  return true;
};

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
      } else {
        console.info("Connected to the dbRoberto with " + government.length + " government");
      }
    });

    //var governmentsAPI = require("./governmentsAPI");

    governmentsAPI.register(app, dbRoberto, BASE_API_PATH, apiKeyCheck);
    
  }
});


app.use("/proxy/governments", (req, res) => {
  console.log("INFO: New GET request to /proxy/governments/");
  var http = require('http');
  var options = {
      host: 'dgsin1819-05.herokuapp.com',
      path: '/api/v1/co2'
  };

  var request = http.request(options, (response) => {
      var input = '';
      response.on('data', function(chunk) {
          input += chunk;
      });

      response.on('end', function() {
          console.log("INFO: The Proxy request to /proxy/governments/ worked correctly :)");
          res.send(input);
      });
  });

  request.on('error', function(e) {
      console.log("WARNING: New GET request to /proxy/governments/ - ERROR TRYING TO ACCESS, sending 503...");
      res.sendStatus(503);
  });
  request.end();


});

//------------------------------------------------Roberto--------------------------------------------------------------------------




//------------------------------------------------Jesus--------------------------------------------------------------------------

app.get("/docsjesus", (req, res) => {
  res.redirect("https://documenter.getpostman.com/view/7001703/S17qSUdT");
}); 

var API_KEY_Jes = "keyJes";
// Helper method to check for apikey
var apiKeyCheck_jes = function (request, response) {
  if (!request.query.apikey) {
    console.error('WARNING: No apikey was sent!');
    response.sendStatus(401);
    return false;
  }
  if (request.query.apikey !== API_KEY_Jes) {
    console.error('WARNING: Incorrect apikey was used!');
    response.sendStatus(403);
    return false;
  }
  return true;
};

MongoClient.connect(mdbURLJesus, (err, client) => {
  if (err) {
    console.error("DB connection error: " + err);
    process.exit(1);
  } else {
    dbJesus = client.db("familiesAPI-db").collection("families");
    dbJesus.find({}).toArray((err, family) => {
      if (err) {
        console.error("Error getting data from dbJesus: " + err);
      } else if (family.length == 0) {
        console.info("Adding initial family to empty dbJesus");
      } else {
        console.info("Connected to the dbJesus with " + family.length + " family");
      }
    });
    familiesAPI.register(app, dbJesus, BASE_API_PATH, apiKeyCheck_jes);
  }
});

//Conexión a API externa
app.use("/proxy/families", (req, res) => {
  console.log("INFO: New GET request to /proxy/families/");
  var http = require('http');
  var options = {
      host: 'dgsin1819-05.herokuapp.com',
      path: '/api/v1/co2'
  };

  var request = http.request(options, (response) => {
      var input = '';
      response.on('data', function(chunk) {
          input += chunk;
      });

      response.on('end', function() {
          console.log("INFO: The Proxy request to /proxy/families/ worked correctly :)");
          res.send(input);
      });
  });

  request.on('error', function(e) {
      console.log("WARNING: New GET request to /proxy/families/ - ERROR TRYING TO ACCESS, sending 503...");
      res.sendStatus(503);
  });
  request.end();


});
//------------------------------------------------Jesus--------------------------------------------------------------------------