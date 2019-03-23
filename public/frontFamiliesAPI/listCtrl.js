
angular.module("ManagerApp").
    controller("FamilyListCtrl", ["$scope", "$http", "$rootScope", function ($scope, $http, $rootScope) {
        console.log("Family ListCtrl initialized");

        if (!$rootScope.apikey_jes) $rootScope.apikey_jes = "keyJes";

        $scope.data = {};
        var dataCache = {};
        var modifier = "";
        var properties = "";

        $scope.refreshPage = function () {
            $scope.data = dataCache;
        };

        $scope.refreshBotton = function () {
            properties = "";
            refresh();
        };

        var refresh = $scope.refresh = function () {
            $http
                .get("../api/v1/families" + modifier + "?" + "apikey=" + $rootScope.apikey_jes + "&" + properties)
                .then(function (response) {
                    dataCache = response.data;
                    $scope.refreshPage();
                }, function (response) {
                    switch (response.status) {
                        case 401:
                            Materialize.toast('<i class="material-icons">error_outline</i> Error - Apikey perdida', 4000);
                            break;
                        case 403:
                            Materialize.toast('<i class="material-icons">error_outline</i> Error - Apikey no corresponde', 4000);
                            break;
                        case 404:
                            dataCache = {};
                            $scope.refreshPage();
                            Materialize.toast('<i class="material-icons">error_outline</i> Error - No hay datos', 4000);
                            break;
                        default:
                            Materialize.toast('<i class="material-icons">error_outline</i> Error cargando datos', 4000);
                            break;
                    }
                });
        };

        $scope.delAllData = function () {
            $http
                .delete("../api/v1/families" + "?" + "apikey=" + $rootScope.apikey_jes)
                .then(function (response) {
                    console.log("Eliminando datos...");
                    Materialize.toast('<i class="material-icons">done</i> Datos eliminados', 4000);
                    properties = "";
                    refresh();
                }, function (response) {
                    Materialize.toast('<i class="material-icons">error_outline</i> Se ha producido un error al eliminar los datos', 4000);
                });
        };

        $scope.loadInitialData = function () {
            refresh();
            if ($scope.data.length == 0) {
                $http
                    .get("../api/v1/families/loadInitialData" + "?" + "apikey=" + $rootScope.apikey_jes)
                    .then(function (response) {
                        console.log("Cargando datos iniciales...");
                        Materialize.toast('<i class="material-icons">done</i> Datos iniciales cargados', 4000);
                        refresh();
                    }, function (response) {
                        Materialize.toast('<i class="material-icons">error_outline</i> Error al carga los datos iniciales', 4000);
                    });
            }
            else {
                Materialize.toast('<i class="material-icons">error_outline</i> Error - La lista debe estar vacía para cargar los datos iniciales', 4000);
                console.log("La lista debe estar vacía...");
            }
        };

        refresh();

        $('#apikeyModal').modal({
            complete: function () {
                $rootScope.apikey_jes = $scope.apikey;

                $http
                    .get("../api/v1/families" + modifier + "?" + "apikey=" + $rootScope.apikey_jes + "&" + properties)
                    .then(function (response) {
                        Materialize.toast('<i class="material-icons">done</i> Apikey cambiada', 4000);
                        dataCache = response.data;
                        $scope.refreshPage();
                    }, function (response) {
                        dataCache = {};
                        $scope.refreshPage();
                        switch (response.status) {
                            case 401:
                                Materialize.toast('<i class="material-icons">error_outline</i> Error - Apikey perdida', 4000);
                                break;
                            case 403:
                                Materialize.toast('<i class="material-icons">error_outline</i> Error - Apikey errónea para este FrontEnd', 4000);
                                break;
                            default:
                                Materialize.toast('<i class="material-icons">error_outline</i> Error al cargar', 4000);
                                break;
                        }
                    });
                console.log("Apikey cambiada");
            }
        });

        $('#searchModal').modal({
            complete: function () {
                modifier = "";
                properties = "";
                if ($scope.from && $scope.to) {
                    properties = "from=" + $scope.from + "&to=" + $scope.to;
                }
                Materialize.toast('<i class="material-icons">done</i> Búsqueda realizada', 4000);
                refresh();
            }
        });
    }]);


