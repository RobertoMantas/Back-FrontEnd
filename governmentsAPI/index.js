// Get rid of _id when returning governments
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
          }, {
            "country": "Portugal",
            "year": "2017",
            "trustGovernment": 0.02,
            "generosity": 0.14,
            "confidence": 5.33
          }];

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

  // pagination and search
  //Example for from to: http://localhost:8089/api/v1/governments?apikey=keyRob&from=3&&to=2015
  //Example for limit offset: http://localhost:8089/api/v1/governments?apikey=keyRob&limit=3&&offset=1
  //Example for limit offset: http://localhost:8089/api/v1/governments?apikey=keyRob&limit=3&&offset=1&from=3&&to=2016
app.get(BASE_API_PATH + "/governments", function (request, response) {
  if (!apiKeyCheck(request, response)) return;

  console.log("INFO2: New GET request to /governments ");
  
       /*PRUEBA DE BUSQUEDA */
          var limit = parseInt(request.query.limit);
          var offset = parseInt(request.query.offset);
          var from = request.query.from;
          var to = request.query.to;
          var aux = [];
          var aux2= [];
          var aux3 = [];

          
          if (limit && offset >=0) {
            console.log("INFO3: New GET request to /governments ");

          dbRoberto.find({}).skip(offset).limit(limit).toArray(function(err, countries) {
              if (err) {
                  console.error('WARNING: Error getting data from DB');
                   response.sendStatus(500); // internal server error
              } else {
                   if (countries.length === 0) {
                          response.send(aux3);
            console.log("INFO3: Empty you have to  loadInitialData ");

                          return;
                      }
                  console.log("INFO: Sending countries:: " + JSON.stringify(countries, 2, null));
                  if (from && to) {
                    console.log("INFO33: New GET request to /governments ");

                          aux = buscador(countries, aux, from, to);
                          if (aux.length > 0) {
                            var formatGovernments = formatContacts(countries);
                              aux2 = aux.slice(offset, offset+limit);
                              console.log("INFO: Sending results with from and to and limit and offset: " + JSON.stringify(aux, 2, null));
                              console.log("INFO: Sending results with from and to and limit and offset: " + JSON.stringify(countries, 2, null));
                              console.log("INFO: Sending results with from and to and limit and offset: " + JSON.stringify(aux2, 2, null));
                              response.send(aux2);
                          }
                          else {
                              
                              response.send(404); // No content 
                              return;
                          }
                      }
                      else {
                        var formatGovernments = formatContacts(countries);
                          response.send(countries);
                      }
              }
          });
          
          }
          else {

              dbRoberto.find({}).toArray(function(err, countries) {
                  if (err) {
                      console.error('ERROR from database');
                      response.sendStatus(500); // internal server error
                  }
                  else {
                      if (countries.length === 0) {
                          
                          response.sendStatus(204);
                      console.log("INFO3: Empty you have to  loadInitialData ");

                          return;
                      }
                      console.log("INFO: Sending governments: " + JSON.stringify(countries, 2, null));

                      if (from && to) {
                      console.log('INFO: New GET request to /governments from %d to %d', from, to);

                          aux = buscador(countries, aux, from, to);
                          if (aux.length > 0) {
                            var formatGovernments = formatContacts(countries);
                              response.send(aux);
                          }
                          else {
                              response.sendStatus(404); //No content
                              return;
                          }
                      }
                      else {
                        var formatGovernments = formatContacts(countries);
                          response.send(countries);
                      }
                  }
              });
          }

});





// SEARCH FUNCTION

var buscador = function(base, conjuntoauxiliar, desde, hasta) {

  var from = parseInt(desde);
  var to = parseInt(hasta);


  for (var j = 0; j < base.length; j++) {
      var anyo = base[j].year;
      if (to >= anyo && from <= anyo) {

          conjuntoauxiliar.push(base[j]);
      }
  }

  return conjuntoauxiliar;

};

// //GET COLLECTION
//   app.get(BASE_API_PATH + "/governments", function (request, response) {
//     console.log("INFO: New GET request to /governments");
//     if (apiKeyCheck(request, response) == true) {
//       dbRoberto.find({}).toArray(function (err, governments) {
//         if (err) {
//           console.error('WARNING: Error getting data from DB');
//           response.sendStatus(500); // internal server error
//         } else {
//           var formatGovernments = formatContacts(governments);
//           console.log("INFO: Sending governments: " + JSON.stringify(governments, 2, null));
//           response.send(governments);
//         }
//       });
//     }
//   });


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
                  var formatGovernments = formatContacts(result);

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
            var formatGovernments = formatContacts(result);

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
                  var formatGovernments = formatContacts(result);

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
                        console.log("INFO: Modifying government with country " + country + " with data " + JSON.stringify(updatedStat, 2, null));
                        var formatGovernments = formatContacts(updatedStat);

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



    //DELETE over a collection
app.delete(BASE_API_PATH + "/governments", function (request, response) {
  console.log("INFO: New DELETE request to /governments");
  if(apiKeyCheck(request,response)==true){
  dbRoberto.remove({}, {multi: true}, function (err, result) {
      var numRemoved = JSON.parse(result);
      if (err) {
          console.error('WARNING: Error removing data from DB');
          response.sendStatus(500); // internal server error
      } else {
          if (numRemoved.n > 0) {
              console.log("INFO: All the governments (" + numRemoved.n + ") have been succesfully deleted, sending 204...");
              response.sendStatus(204); // no content
          } else {
              console.log("WARNING: There are no governments to delete");
              response.sendStatus(404); // not found
          }
      }
  });
  }
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/governments/:country/:year", function (request, response) {
  var country = request.params.country;
  var year = request.params.year;
  
  if(apiKeyCheck(request,response)==true){
  if (!country || !year) {
      console.log("WARNING: New DELETE request to /governments/:country/:year without country or year, sending 400...");
      response.sendStatus(400); // bad request
  } else {
      console.log("INFO: New DELETE request to /governments/" + country + " and year " + year);
      dbRoberto.remove({country:country, $and:[{"year":year}]}, {}, function (err, result) {
      var numRemoved = JSON.parse(result);   
          if (err) {
              console.error('WARNING: Error removing data from DB');
              response.sendStatus(500); // internal server error
          } else {
              console.log("INFO: governments removed: " + numRemoved.n);
              if (numRemoved.n === 1) {
                  console.log("INFO: The government with country " + country + " and year " + year + " has been succesfully deleted, sending 204...");
                  response.sendStatus(204); //no content
              } else {
                  console.log("WARNING: There are no countries to delete");
                  response.sendStatus(404); // not found
              }
          }
      });
  }
  }
});



};
