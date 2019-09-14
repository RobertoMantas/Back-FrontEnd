# Freedoms API

####Recurso base

```javascript
.../api/v1/freedoms
```

####Ejemplo de un dato:

```javascript
 {
 	"year": 2015,
    "country": "Switzerland",
    "hScore": 0.94143,
    "freedom": 0.66557,
    "hRank": 1
	}
```

#### Carga de datos

```javascript
GET:  .../api/v1/freedoms/loadInitialData
Result: 200
```

#### Todos los datos

```javascript
GET:  .../api/v1/freedoms
Result:  [{
 	"year": 2015,
    "country": "Switzerland",
    "hScore": 0.94143,
    "freedom": 0.66557,
    "hRank": 1
	},{
 	"year": 2016,
    "country": "Australia",
    "hScore": 0.94143,
    "freedom": 0.66557,
    "hRank": 1
	} ...]
```

#### Nuevo dato

```javascript
POST:  .../api/v1/freedoms/
Body:  {
 	"year": 2013,
    "country": "Spain",
    "hScore": 0.94143,
    "freedom": 0.66557,
    "hRank": 1
	}
Result: 201 CREATED
```

#### Eliminar todo el conjunto

```javascript
DELETE:  .../api/v1/freedoms/
Result: 200
```

#### Todos los datos por pais

```javascript
GET:  .../api/v1/freedoms/Switzerland
Result:  [{
 	"year": 2015,
    "country": "Switzerland",
    "hScore": 0.94143,
    "freedom": 0.66557,
    "hRank": 1
	},{
 	"year": 2016,
    "country": "Switzerland",
    "hScore": 0.94143,
    "freedom": 0.66557,
    "hRank": 1
	} ...]
```

#### Recuperar dado una ventana de tiempo

```javascript
GET:  .../api/v1/freedoms/?from=2014&to=2015
Result:  [{
 	"year": 2014,
    "country": "Spain",
    "hScore": 0.04143,
    "freedom": 0.557,
    "hRank": 9
	}, {"year": 2015,
    "country": "Finland",
    "hScore": 0.04143,
    "freedom": 0.557,
    "hRank": 9},{
 	"year": 2015,
    "country": "Spain",
    "hScore": 0.04143,
    "freedom": 0.557,
    "hRank": 9
	}]
```

###### Se deben enviar los dos parametros, `from` y `to`, siendo el primero un valor numerico menor que el segundo, si no devolverá `400 BAD REQUEST`

#### Recuperar dato

```javascript
GET:  .../api/v1/freedoms/Spain/2013
Result: {
 	"year": 2013,
    "country": "Spain",
    "hScore": 0.04143,
    "freedom": 0.557,
    "hRank": 9
	}
```

###### Si un el idenficiador no existe, devolverá `404 NOT FOUND`

#### Actualizar dato

```javascript
PUT:  .../api/v1/freedoms/Spain/2013
Body:  {
 	"year": 2013,
    "country": "Spain",
    "hScore": 0.04143,
    "freedom": 0.557,
    "hRank": 9
	}
Result: 200
```

###### Si los campos enviados en el body no se concuerda con el pais y año del objeto que se va a modificar, se devolverá un `400 BAD REQUEST`, al igual que si se envía algun dato erroneo (año menor que uno, puntaje que no sea un número, etc.). Sin embargo, si el idenficador no se encuentra en la BD se devolverá un `404 NOT FOUND`

#### Recuperar dado una ventana de tiempo y pais

```javascript
GET:  .../api/v1/freedoms/Spain?from=2014&to=2015
Result:  [{
 	"year": 2014,
    "country": "Spain",
    "hScore": 0.04143,
    "freedom": 0.557,
    "hRank": 9
	}, {
 	"year": 2015,
    "country": "Spain",
    "hScore": 0.04143,
    "freedom": 0.557,
    "hRank": 9
	}]
```
