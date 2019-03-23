/* global angular */
/* global M */
/* global $ */
var previousPage;
var nextPage;
var setPage;

angular.module("ManagerApp").
    controller("FamilyListCtrl", ["$scope", "$http", "$rootScope", function ($scope, $http, $rootScope) {
        console.log("Family ListCtrl initialized");

        if (!$rootScope.apikey) $rootScope.apikey = "keyJes";

        $scope.search = {};
        $scope.searchAdd = {};
        $scope.data = {};
        $scope.currentPage = 1;
        $scope.maxPages = 1;
        $scope.pages = [];
        $scope.pagesLeft = [];
        $scope.pagesMid = [];
        $scope.pagesRight = [];

        var dataCache = {};
        var modifier = "";
        var properties = "";
        var elementsPerPage = 2;

        $scope.previousPage = function () {
            var a;
            console.log("offset antes-: " + $scope.currentPage);
            a = (($scope.currentPage - 1) * 2) - 2;
            console.log("offset despues-: " + a);
            $http
                .get("../api/v1/families" + modifier + "?" + "apikey=" + $rootScope.apikey + "&limit=2&offset=" + a)
                .then(function (response) {
                    properties = "limit=2&offset=" + a;
                    $scope.currentPage--;
                    $scope.refreshPage();
                    refresh();

                });
        };

        $scope.nextPage = function () {
            var a;
            console.log("offset antes+: " + $scope.currentPage);
            a = (($scope.currentPage + 1) * 2) - 2;
            console.log("offset despues +: " + a);
            $http
                .get("../api/v1/families" + modifier + "?" + "apikey=" + $rootScope.apikey + "&limit=2&offset=" + a)
                .then(function (response) {
                    properties = "limit=2&offset=" + a;
                    $scope.currentPage++;
                    $scope.refreshPage();
                    refresh();
                });
        };

        $scope.refreshPage = function () {

            if ($scope.currentPage <= 0) $scope.currentPage = 1;
            if ($scope.currentPage > $scope.maxPages) $scope.currentPage = $scope.maxPages;
            $scope.data = dataCache;
            console.log("Página actual: " + $scope.currentPage);
            console.log("Máximo de páginas: " + $scope.maxPages);
        };

        $scope.refreshBotton = function () {
            $scope.maxPages = 1;
            $scope.currentPage = 1;
            properties = "";
            refresh();
        };

        var refresh = $scope.refresh = function () {
            $http
                .get("../api/v1/families" + modifier + "?" + "apikey=" + $rootScope.apikey + "&" + properties)
                .then(function (response) {
                    if ($scope.maxPages < Math.max(response.data.length / elementsPerPage))
                        $scope.maxPages = Math.ceil(response.data.length / elementsPerPage);
                    dataCache = response.data;
                    $scope.refreshPage();
                }, function (response) {
                    switch (response.status) {
                        case 401:
                            Materialize.toast('<i class="material-icons">error_outline</i> Error - Apikey perdida', 4000);
                            break;
                        case 403:
                            Materialize.toast('<i class="material-icons">error_outline</i> Error - Apikey errónea', 4000);
                            break;
                        case 404:
                            $scope.maxPages = 1;
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
                .delete("../api/v1/families" + "?" + "apikey=" + $rootScope.apikey)
                .then(function (response) {
                    console.log("Eliminando datos...");
                    Materialize.toast('<i class="material-icons">done</i> Datos eliminados', 4000);
                    properties = "";
                    $scope.maxPages = 1;
                    $scope.currentPage = 1;
                    refresh();
                }, function (response) {
                    Materialize.toast('<i class="material-icons">error_outline</i> Se ha producido un eror al eliminar los datos', 4000);
                });
        };

        $scope.loadInitialData = function () {
            refresh();
            if ($scope.data.length == 0) {
                $http
                    .get("../api/v1/families/loadInitialData" + "?" + "apikey=" + $rootScope.apikey)
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
                $rootScope.apikey = $scope.apikey;

                $http
                    .get("../api/v1/families" + modifier + "?" + "apikey=" + $rootScope.apikey + "&" + properties)
                    .then(function (response) {
                        Materialize.toast('<i class="material-icons">done</i> Apikey cambiada', 4000);
                        $scope.maxPages = Math.max(Math.ceil(response.data.length / elementsPerPage), 1);
                        dataCache = response.data;
                        $scope.refreshPage();
                    }, function (response) {
                        $scope.maxPages = 1;
                        dataCache = {};
                        $scope.refreshPage();
                        switch (response.status) {
                            case 401:
                                Materialize.toast('<i class="material-icons">error_outline</i> Error - Apikey perdida', 4000);
                                break;
                            case 403:
                                Materialize.toast('<i class="material-icons">error_outline</i> Error - Apikey errónea', 4000);
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


