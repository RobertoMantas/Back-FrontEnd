// Destruir ids
function formatear(families) {
  return families.map((f) => {
      delete f._id
      return f;
  });
}
module.exports.register = function (app, dbJesus, BASE_API_PATH, apiKeyCheck_jes) {

  console.log("FAMILIES API");

  //Cara de datos iniciales
  app.get(BASE_API_PATH + "/families/loadInitialData", function (request, response) {
      dbJesus.find({}).toArray(function (err, families) {
          if (err) {
              console.error('Error al intentar cargar los datos iniciales de familias');
              return 0;
          }
          console.log('Cargando datos iniciales datos familias...');

          if (families.length === 0) {
              console.log('Cargando datos iniciales datos familias...');
              var country = [{

                  "country": "Sweden",
                  "year": "2016",
                  "happinessScore": "7.29",
                  "economy": "1.45",
                  "family": "1.08"
              }, {
                  "country": "Norway",
                  "year": "2016",
                  "happinessScore": "7.29",
                  "economy": "1.45",
                  "family": "1.08"
              }, {
                  "country": "Spain",
                  "year": "2015",
                  "happinessScore": "6.32",
                  "economy": "1.23",
                  "family": "1.31"
              }, {
                  "country": "Russia",
                  "year": "2015",
                  "happinessScore": "5.71",
                  "economy": "1.13",
                  "family": "1.23"
              }, {
                  "country": "Portugal",
                  "year": "2017",
                  "happinessScore": "5.19",
                  "economy": "1.31",
                  "family": "1.36"
              }];

              dbJesus.insert(country);
              response.sendStatus(201);
              return;
          } else {
              console.log('La BD tiene ' + families.length + ' datos de felicidad familiar');
              response.sendStatus(200);
              return;
          }
      });
  });

  // Paginación y búsqueda
  app.get(BASE_API_PATH + "/families", function (request, response) {
      if (!apiKeyCheck_jes(request, response)) return;

      console.log("Nueva solicitud a datos de familias");

      var limit = parseInt(request.query.limit);
      var offset = parseInt(request.query.offset);
      var from = request.query.from;
      var to = request.query.to;
      var aux = [];
      var aux2 = [];
      var aux3 = [];

      if (limit && offset >= 0) {
          console.log("Nueva solicitud a datos de familias ");

          dbJesus.find({}).skip(offset).limit(limit).toArray(function (err, countries) {
              if (err) {
                  console.error('Error al intentar conseguir los datos de familias');
                  response.sendStatus(500);
              } else {
                  if (countries.length === 0) {
                      response.send(aux3);
                      console.log("No hay datos iniciales de familias");

                      return;
                  }
                  console.log("Cargando información de familias por países: " + JSON.stringify(countries, 2, null));
                  if (from && to) {
                      console.log("Nueva petición de datos a /families ");

                      aux = buscador(countries, aux, from, to);
                      if (aux.length > 0) {
                          aux2 = aux.slice(offset, offset + limit);
                          console.log("Enviando información limitando cantidad de datos y usando límites: " + JSON.stringify(aux, 2, null));
                          console.log("Enviando información limitando cantidad de datos y usando límites: " + JSON.stringify(countries, 2, null));
                          console.log("Enviando información limitando cantidad de datos y usando límites: " + JSON.stringify(aux2, 2, null));
                          response.send(aux2);
                      }
                      else {

                          response.send(404);
                          return;
                      }
                  }
                  else {
                      var reseteo = formatear(countries);
                      response.send(countries);
                  }
              }
          });

      }
      else {

          dbJesus.find({}).toArray(function (err, countries) {
              if (err) {
                  console.error('ERROR en la BD');
                  response.sendStatus(500);
              }
              else {
                  if (countries.length === 0) {

                      response.sendStatus(204);
                      console.log("No tienes datos de entrada...");

                      return;
                  }
                  console.log("Enviando datos de familias: " + JSON.stringify(countries, 2, null));

                  if (from && to) {
                      console.log('Nuevo GET a /familias desde %d a %d', from, to);

                      aux = buscador(countries, aux, from, to);
                      if (aux.length > 0) {
                          response.send(aux);
                      }
                      else {
                          response.sendStatus(404);
                          return;
                      }
                  }
                  else {
                      var reseteo = formatear(countries);
                      response.send(countries);
                  }
              }
          });
      }

  });

  // Función de Búsqueda
  var buscador = function (base, conjuntoauxiliar, desde, hasta) {

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

  //PUT sobre colección
  app.put(BASE_API_PATH + "/families", function (request, response) {
      if (apiKeyCheck_jes(request, response) == true) {
          console.log("ERROR: put a /families...");
          response.sendStatus(405);
      }
  });

  //PUT sobre un registro
  app.put(BASE_API_PATH + "/families/:country/:year", function (request, response) {
      var registro = request.body;
      var country = request.params.country;
      var year = request.params.year;

      if (apiKeyCheck_jes(request, response) == true) {
          if (!registro) {
              console.log("ERROR: put a /families/ sin información...");
              response.sendStatus(400);
          } else {
              console.log("Nuevo PUT a /families/" + country + " con la información " + JSON.stringify(registro, 2, null));
              if (!registro.country || !registro.year || !registro.happinessScore || !registro.economy || !registro.family) {
                  console.log("ERROR: la información " + JSON.stringify(registro, 2, null) + " no es correcta...");
                  response.sendStatus(422);
              } else {
                  dbJesus.find({ country: country, $and: [{ year: year }] }).toArray(function (err, families) {
                      if (err) {
                          console.error('Error accediendo a los datos...');
                          response.sendStatus(500);
                      } else if (families.length > 0) {
                          dbJesus.update({ country: country, year: year }, registro);
                          console.log("Modificando datos de familias del país " + country + " con los datos " + JSON.stringify(registro, 2, null));
                          response.send(registro);
                      } else {
                          console.log("ERROR: no hay resultados con el pais " + country);
                          response.sendStatus(404);
                      }
                  }
                  )
              }
          }
      }
  });

  //GET a una colección de países de un mismo año 
  app.get(BASE_API_PATH + "/families/:year", function (request, response) {
      var year = request.params.year;
      var country = request.params.year;
      if (apiKeyCheck_jes(request, response) == true) {
          if (isNaN(request.params.year.charAt(0))) {
              if (!country) {
                  console.log("Error: GET a /families/:country sin especificar país...");
                  response.sendStatus(400);
              } else {
                  console.log("GET a /families/" + country);
                  dbJesus.find({ country: country }).toArray(function (err, results) {
                      if (err) {
                          console.error('Error accediendo a los datos...');
                          response.sendStatus(500);
                      } else if (results.length > 0) {
                          var result = results;
                          console.log("Cargando resultados: " + JSON.stringify(result, 2, null));
                          response.send(result);
                      } else {
                          console.log("No hay resultados para el país " + country);
                          response.sendStatus(404); 
                      }
                  });
              }
          } else {
              if (!year) {
                  console.log("ERROR: GET a /families/:year sin especificar año...");
                  response.sendStatus(400);
              } else {
                  console.log("GET a /families/" + year);
                  dbJesus.find({ year: year }).toArray(function (err, results) {
                      if (err) {
                          console.error('Error accediendo a los datos...');
                          response.sendStatus(500);
                      } else if (results.length > 0) {
                          var reseteo = formatear(result);
                          var result = results;
                          console.log("Cargando resultados: " + JSON.stringify(result, 2, null));
                          response.send(result);
                      } else {
                          console.log("No hay resultados para el año " + year);
                          response.sendStatus(404);
                      }
                  });
              }
          }
      }
  });

  //GET a un registro concreto con 2 parametros
  app.get(BASE_API_PATH + "/families/:country/:year", function (request, response) {
      var country = request.params.country;
      var year = request.params.year;
      if (apiKeyCheck_jes(request, response) == true) {
          if (!country || !year) {
              console.log("ERROR: GET a /families/:country sin especificar país o año...");
              response.sendStatus(400);
          } else {
              console.log("GET a /families/" + country + "/" + year);
              dbJesus.find({ country: country, $and: [{ year: year }] }).toArray(function (err, results) {
                  if (err) {
                      console.error('Error accediendo a los datos...');
                      response.sendStatus(500);
                  } else if (results.length > 0) {
                      var result = results[0];
                      console.log("Cargando resultados: " + JSON.stringify(result, 2, null));
                      response.send(result);
                  } else {
                      console.log("ERROR: no existe país con el nombre " + country + " y el año " + year);
                      response.sendStatus(404);

                  }
              });
          }
      }
  });

  //DELETE sobre una colección
  app.delete(BASE_API_PATH + "/families", function (request, response) {
      console.log("DELETE a /families");
      if (apiKeyCheck_jes(request, response) == true) {
          dbJesus.remove({}, { multi: true }, function (err, result) {
              var contador = JSON.parse(result);
              if (err) {
                  console.error('Error eliminando los datos...');
                  response.sendStatus(500);
              } else {
                  if (contador.n > 0) {
                      console.log("Todos los datos de las " + contador.n + " familias han sido borrados satisfactoriamente");
                      response.sendStatus(204);
                  } else {
                      console.log("No hay datos de familias que eliminar...");
                      response.sendStatus(404);
                  }
              }
          });
      }
  });


  //DELETE sobre un registro
  app.delete(BASE_API_PATH + "/families/:country/:year", function (request, response) {
      var country = request.params.country;
      var year = request.params.year;

      if (apiKeyCheck_jes(request, response) == true) {
          if (!country || !year) {
              console.log("ERROR: delete a /families/:country/:year sin especificar país ni año");
               response.sendStatus(400);
          } else {
              console.log("Delete a /families/" + country + " del año " + year);
              dbJesus.remove({ country: country, $and: [{ "year": year }] }, {}, function (err, result) {
                  var contador = JSON.parse(result);
                  if (err) {
                      console.error('Error eliminando los datos...');
                      response.sendStatus(500);
                  } else {
                      console.log("Datos de familias eliminadas: " + contador.n);
                      if (contador.n === 1) {
                          console.log("Los datos de familias del país " + country + " y el año " + year + " han sido eliminados satisfactoriamente");
                          response.sendStatus(204);
                      } else {
                          console.log("No hay datos de familias que eliminar...");
                          response.sendStatus(404);
                      }
                  }
              });
          }
      }
  });

  //POST sobre la colección 
  app.post(BASE_API_PATH + "/families", function (request, response) {
      var coleccion = request.body;
      if (apiKeyCheck_jes(request, response) == true) {
          if (!coleccion) {
              console.log("ERROR: POST a /families/ sin información...");
              response.sendStatus(400); // bad request
          } else {
              console.log("POST a /families con la información: " + JSON.stringify(coleccion, 2, null));
              if (!coleccion.country || !coleccion.year || !coleccion.happinessScore|| !coleccion.economy|| !coleccion.family) {
                  console.log("La información " + JSON.stringify(coleccion, 2, null) + " no es correcta...");
                  response.sendStatus(422);
              } else {
                  dbJesus.find().toArray(function (err, families) {
                      if (err) {
                          console.error('Error accediendo a los datos...');
                          response.sendStatus(500);
                      } else {
                          var familiesBeforeInsertion = families.filter((country) => {
                              return (country.country.localeCompare(coleccion.country, "en", { 'sensitivity': 'base' }) === 0) && country.year.localeCompare(coleccion.year, "en", { 'sensivity': 'base' }) === 0;
                          });
                          if (familiesBeforeInsertion.length > 0) {
                              console.log("ERROR: la información " + JSON.stringify(coleccion, 2, null) + " ya existe...");
                              response.sendStatus(409);
                          } else {
                              console.log("Añadiendo información " + JSON.stringify(coleccion, 2, null));
                              dbJesus.insert(coleccion);
                              response.sendStatus(201);
                          }
                      }
                  });
              }
          }
      }
  });

  //POST sobre un solo registro
  app.post(BASE_API_PATH + "/families/:country", function (request, response) {
      var country = request.params.country;
      if (apiKeyCheck_jes(request, response) == true) {
          console.log("ERROR: POST a /families/" + country + "...");
          response.sendStatus(405);
      }
  });

};

