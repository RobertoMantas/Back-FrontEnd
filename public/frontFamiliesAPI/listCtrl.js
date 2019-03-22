
angular.module("ManagerApp").
    controller("FamiliesListCtrl", ["$scope", "$http", "$rootScope", function ($scope, $http, $rootScope) {
        console.log("Inicializando el ListCtrl de Families...");

        if (!$rootScope.apikey) $rootScope.apikey = "keyJes";

        $scope.search = {};
        $scope.data = {};
        var dataCache = {};

        $scope.refreshPage = function () {
            $scope.data = dataCache;
        };

        $scope.refreshBotton = function () {
            properties = "";
            refresh();
        };

        var refresh = $scope.refresh = function () {
            $http
                .get("../api/v1/families" + modifier + "?" + "apikey=" + $rootScope.apikey + "&" + properties)
                .then(function (response) {
                    dataCache = response.data;
                    $scope.refreshPage();
                }, function (response) {
                    switch (response.status) {
                        case 404:
                            dataCache = {};
                            $scope.refreshPage();
                            Materialize.toast('<i class="material-icons">error_outline</i> No se han econtrado datos', 4000);
                            break;
                        default:
                            Materialize.toast('<i class="material-icons">error_outline</i> Error cargando los datos', 4000);
                            break;
                    }
                });
        };

        $scope.loadInitialData = function () {
            refresh();
            if ($scope.data.length == 0) {
                $http
                    .get("../api/v1/families/loadInitialData" + "?" + "apikey=" + $rootScope.apikey)
                    .then(function (response) {
                        console.log("Carga de datos iniciales...");
                        Materialize.toast('<i class="material-icons">done</i> Datos iniciales cargados', 4000);
                        refresh();
                    }, function (response) {
                        Materialize.toast('<i class="material-icons">error_outline</i> Error al añadir datos iniciales', 4000);
                    });
            }
            else {
                Materialize.toast('<i class="material-icons">error_outline</i> Para añadir datos iniciales debe estar vacía', 4000);
            }
        };

        refresh();

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