// Get rid of _id when returning contacts
function formatContacts (governments) {
  return governments.map((g) => {
      delete g._id // removes the property
      return g;
  });
}
module.exports.register = function (app, dbRoberto, BASE_API_PATH, apiKeyCheck) {

  console.log("GOVERNMENTS API");


  //Load Initial Data
  app.get(BASE_API_PATH + "/governments/loadInitialData", function (request, response) {
    dbRoberto.find({}).toArray(function (err, governments) {
      if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
      }
      console.log('INFO: Empty DB, loading initial data');

      if (governments.length === 0) {
        console.log('INFO: Empty DB, loading initial data');
        var country = [{
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
          "year": "2015",
          "trustGovernment": 0.06,
          "generosity": 0.17,
          "confidence": 6.28
        }, {
          "country": "Portugal",
          "year": "2015",
          "trustGovernment": 0.01,
          "generosity": 0.11,
          "confidence": 5.03
        }
        ];

        dbRoberto.insert(country);
        response.sendStatus(201);
        return;
      } else {
        console.log('INFO: DB has ' + governments.length + ' governments ');
        response.sendStatus(200);
        return;
      }
    });
  });

  app.get(BASE_API_PATH + "/governments", function (request, response) {
    console.log("INFO: New GET request to /governments");
    if (apiKeyCheck(request, response) == true) {
      dbRoberto.find({}).toArray(function (err, governments) {
        if (err) {
          console.error('WARNING: Error getting data from DB');
          response.sendStatus(500); // internal server error
        } else {
          var formattedContacts = formatContacts(governments);
          console.log("INFO: Sending governments: " + JSON.stringify(governments, 2, null));
          response.send(governments);
        }
      });
    }
  });


// GET a collection de paises en un mismo año 

app.get(BASE_API_PATH + "/governments/:year", function (request, response) {
  var year = request.params.year;
  var country = request.params.year;
  if(apiKeyCheck(request,response)==true){
      if(isNaN(request.params.year.charAt(0))){
           if (!country) {
              console.log("WARNING: New GET request to /governments/:country without name, sending 400...");
              response.sendStatus(400); // bad request
      } else {
           console.log("INFO: New GET request to /governments/" + country);
           dbRoberto.find({country:country}).toArray(function (err, results) {
           if (err) {
              console.error('WARNING: Error getting data from DB');
              response.sendStatus(500); // internal server error
          } else if (results.length > 0) { 
                  var result = results; //since we expect to have exactly ONE contact with this name
                  console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                  response.send(result);
          } else {
                  console.log("WARNING: There are not any result with country " + country);
                  response.sendStatus(404); // not found
              }
      });
}
  }else{
  if (!year) {
      console.log("WARNING: New GET request to /governments/:year without year, sending 400...");
      response.sendStatus(400); // bad request
  } else {
      console.log("INFO: New GET request to /governments/" + year);
      dbRoberto.find({year:year}).toArray(function (err, results) {
          if (err) {
              console.error('WARNING: Error getting data from DB');
              response.sendStatus(500); // internal server error
          } else if (results.length > 0) { 
                  var result = results; //since we expect to have exactly ONE contact with this name
                  console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                  response.send(result);
              } else {
                  console.log("WARNING: There are not any result with year " + year);
                  response.sendStatus(404); // not found
              
              }
      });
}
}
}});

//GET a recurso concreto con 2 parametros

app.get(BASE_API_PATH + "/governments/:country/:year", function (request, response) {
  var country = request.params.country;
  var year = request.params.year;
  if(apiKeyCheck(request,response)==true){
  if (!country || !year) {
      console.log("WARNING: New GET request to /governments/:country without name or without year, sending 400...");
      response.sendStatus(400); // bad request
  } else {
      console.log("INFO: New GET request to /governments/" + country + "/" + year);
      dbRoberto.find({country:country, $and:[{year:year}]}).toArray(function (err, results) {
          if (err) {
              console.error('WARNING: Error getting data from DB');
              response.sendStatus(500); // internal server error
          } else if (results.length > 0) { 
                  var result = results[0]; //since we expect to have exactly ONE contact with this name
                  console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                  response.send(result);
              } else {
                  console.log("WARNING: There are not any country with name " + country +  "and year " + year);
                  response.sendStatus(404); // not found
              
              }
      });
}
}
});


//POST over a collection 
app.post(BASE_API_PATH + "/governments", function (request, response) {
  var newCountryStat = request.body;
  if(apiKeyCheck(request,response)==true){
  if (!newCountryStat) {
      console.log("WARNING: New POST request to /governments/ without countryStat, sending 400...");
      response.sendStatus(400); // bad request
  } else {
      console.log("INFO: New POST request to /governments with body: " + JSON.stringify(newCountryStat, 2, null));
      if (!newCountryStat.country || !newCountryStat.year || !newCountryStat.trustGovernment) {
          console.log("WARNING: The countryStat " + JSON.stringify(newCountryStat, 2, null) + " is not well-formed, sending 422...");
          response.sendStatus(422); // unprocessable entity
      } else {
          dbRoberto.find().toArray(function (err, governments) {
              if (err) {
                  console.error('WARNING: Error getting data from DB');
                  response.sendStatus(500); // internal server error
              } else {
                  var governmentsBeforeInsertion = governments.filter((country) => {
                      return (country.country.localeCompare(newCountryStat.country ,"en", {'sensitivity': 'base'}) === 0 ) && country.year.localeCompare(newCountryStat.year,"en",{'sensivity':'base'}) === 0;
   });
                  if (governmentsBeforeInsertion.length > 0) {
                      console.log("WARNING: The newCountryStat " + JSON.stringify(newCountryStat, 2, null) + " already extis, sending 409...");
                      response.sendStatus(409); // conflict
                  } else {
                      console.log("INFO: Adding country " + JSON.stringify(newCountryStat, 2, null));
                      dbRoberto.insert(newCountryStat);
                      response.sendStatus(201); // created
                  }
              }
          });
      }
  }
  }
});


//POST over a single resource
app.post(BASE_API_PATH + "/governments/:country", function (request, response) {
  var country = request.params.country;
  if(apiKeyCheck(request,response)==true){
  console.log("WARNING: New POST request to /governments/" + country + ", sending 405...");
  response.sendStatus(405); // method not allowed
  }
});

//PUT over a collection
app.put(BASE_API_PATH + "/governments", function (request, response) {
  if(apiKeyCheck(request,response)==true){
  console.log("WARNING: New PUT request to /governments, sending 405...");
  response.sendStatus(405); // method not allowed
  }
});


  //PUT over a single resources g
  app.put(BASE_API_PATH + "/governments/:country/:year", function (request, response) {
    var updatedStat = request.body;
    var country = request.params.country;
    var year = request.params.year;
    
    if(apiKeyCheck(request,response)==true){
    if (!updatedStat) {
        console.log("WARNING: New PUT request to /governments/ without stat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /governments/" + country + " with data " + JSON.stringify(updatedStat, 2, null));
        if (!updatedStat.country || !updatedStat.year ||  !updatedStat.trustGovernment || !updatedStat.generosity || !updatedStat.confidence) {
            console.log("WARNING: The stat " + JSON.stringify(updatedStat, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbRoberto.find({country:country, $and:[{year:year}]}).toArray( function (err, provinces) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else if (provinces.length > 0) {
                        dbRoberto.update({country: country, year: year}, updatedStat);
                        console.log("INFO: Modifying salary with country " + country + " with data " + JSON.stringify(updatedStat, 2, null));
                        response.send(updatedStat); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any result with province " + country);
                        response.sendStatus(404); // not found
                    }
                }
            )}
        }
    }
    });





};
